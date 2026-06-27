// ============================================================
// Rate Limiting Helper for Next.js
// Note: This is a simple in-memory implementation
// For production with multiple servers, use Redis store
// ============================================================

export interface RateLimitConfig {
  windowMs: number
  max: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

export interface RateLimitStore {
  count: number
  resetTime: number
}

// ============================================================
// Configuration
// ============================================================
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  api: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
  auth: { windowMs: 15 * 60 * 1000, max: 10 }, // 10 attempts per 15 minutes
  booking: { windowMs: 60 * 60 * 1000, max: 5 }, // 5 bookings per hour
}

// ============================================================
// In-Memory Store
// ============================================================
const rateLimitStore = new Map<string, RateLimitStore>()

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get rate limit configuration by type
 */
export function getRateLimitConfig(type: 'api' | 'auth' | 'booking'): RateLimitConfig {
  return RATE_LIMITS[type] || RATE_LIMITS.api
}

/**
 * Clean expired entries from store (call periodically)
 */
export function cleanExpiredEntries(): void {
  const now = Date.now()
  const entries = Array.from(rateLimitStore.entries())
  for (const [key, value] of entries) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Check and update rate limit for an IP
 */
export function checkRateLimit(
  ip: string,
  type: 'api' | 'auth' | 'booking'
): RateLimitResult {
  const config = getRateLimitConfig(type)
  const key = `${type}:${ip}`
  const now = Date.now()

  let record = rateLimitStore.get(key)

  // Reset if window expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, record)
  }

  record.count++

  return {
    allowed: record.count <= config.max,
    remaining: Math.max(0, config.max - record.count),
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  }
}

/**
 * Get current rate limit status for an IP
 */
export function getRateLimitStatus(
  ip: string,
  type: 'api' | 'auth' | 'booking'
): RateLimitResult {
  const config = getRateLimitConfig(type)
  const key = `${type}:${ip}`
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    return {
      allowed: true,
      remaining: config.max,
      resetIn: Math.ceil(config.windowMs / 1000),
    }
  }

  return {
    allowed: record.count <= config.max,
    remaining: Math.max(0, config.max - record.count),
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  }
}

/**
 * Reset rate limit for an IP (useful for testing)
 */
export function resetRateLimit(ip: string, type?: 'api' | 'auth' | 'booking'): void {
  if (type) {
    rateLimitStore.delete(`${type}:${ip}`)
  } else {
    rateLimitStore.delete(`api:${ip}`)
    rateLimitStore.delete(`auth:${ip}`)
    rateLimitStore.delete(`booking:${ip}`)
  }
}

/**
 * Get all current entries (for debugging/monitoring)
 */
export function getStoreStats(): {
  totalEntries: number
  apiEntries: number
  authEntries: number
  bookingEntries: number
} {
  let apiEntries = 0
  let authEntries = 0
  let bookingEntries = 0

  const keys = Array.from(rateLimitStore.keys())
  for (const key of keys) {
    if (key.startsWith('api:')) apiEntries++
    else if (key.startsWith('auth:')) authEntries++
    else if (key.startsWith('booking:')) bookingEntries++
  }

  return {
    totalEntries: rateLimitStore.size,
    apiEntries,
    authEntries,
    bookingEntries,
  }
}
