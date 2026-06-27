import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================
// Rate Limit Configuration
// ============================================================
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_API = 200 // Increased from 100
const RATE_LIMIT_MAX_AUTH = 20 // Increased from 10
const RATE_LIMIT_MAX_BOOKING = 50 // Increased from 5

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitInfo(
  ip: string,
  type: 'api' | 'auth' | 'booking',
  max: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const key = `${type}:${ip}`
  const now = Date.now()

  let record = rateLimitStore.get(key)

  // Reset if window expired
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs }
    rateLimitStore.set(key, record)
  }

  record.count++

  return {
    allowed: record.count <= max,
    remaining: Math.max(0, max - record.count),
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  }
}

// ============================================================
// Main Middleware
// ============================================================
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Skip rate limiting for public API endpoints
  const publicApiPaths = [
    '/api/settings',
    '/api/paket',
    '/api/blog',
    '/api/destinasi',
    '/api/chat',
  ]

  // Check if this is a public API path
  const isPublicApi = publicApiPaths.some(path => pathname.startsWith(path))

  // Get client IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'

  // Initialize response
  let response = NextResponse.next()

  // ============================================================
  // Rate Limiting for API Routes (skip for public APIs)
  // ============================================================
  if (pathname.startsWith('/api') && !isPublicApi) {
    let rateLimitConfig = { max: RATE_LIMIT_MAX_API, windowMs: RATE_LIMIT_WINDOW }

    // Auth endpoints have stricter limits
    if (pathname.includes('/auth') || pathname.endsWith('/login')) {
      rateLimitConfig = { max: RATE_LIMIT_MAX_AUTH, windowMs: RATE_LIMIT_WINDOW }
    }
    // Booking creation endpoint
    else if (pathname === '/api/booking' && request.method === 'POST') {
      rateLimitConfig = { max: RATE_LIMIT_MAX_BOOKING, windowMs: RATE_LIMIT_WINDOW }
    }

    const rateLimitType = pathname.includes('/auth') ? 'auth' :
      pathname === '/api/booking' ? 'booking' : 'api'

    const result = getRateLimitInfo(
      ip,
      rateLimitType,
      rateLimitConfig.max,
      rateLimitConfig.windowMs
    )

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(rateLimitConfig.max))
    response.headers.set('X-RateLimit-Remaining', String(result.remaining))
    response.headers.set('X-RateLimit-Reset', String(result.resetIn + Math.floor(Date.now() / 1000)))

    if (!result.allowed) {
      console.warn(`[RateLimit] Blocked ${ip} for ${rateLimitType} - ${pathname}`)

      const errorMessage = rateLimitType === 'auth'
        ? 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.'
        : 'Terlalu banyak request. Silakan coba lagi nanti.'

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 429 }
      )
    }
  }

  // ============================================================
  // Security Headers for Admin Routes
  // ============================================================
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  // ============================================================
  // Force HTTPS in Production
  // ============================================================
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host')
    if (host && !host.startsWith('localhost') && request.headers.get('x-forwarded-proto') !== 'https') {
      const url = request.url.replace('http://', 'https://')
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
