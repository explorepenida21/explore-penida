const withNextIntl = require('next-intl/plugin')('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================
  // Security Headers
  // ============================================================
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            // Prevent clickjacking
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Control referrer information
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // XSS Protection (legacy but still useful)
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Permissions Policy - disable unnecessary features
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            // Strict Transport Security (force HTTPS)
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            // Content Security Policy
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://app.sandbox.midtrans.com https://app.midtrans.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://*.midtrans.com",
              "media-src 'self' https://res.cloudinary.com https://*.cloudinary.com blob:",
              "connect-src 'self' https://*.midtrans.com https://openrouter.ai https://api.fonnte.com https://api.cloudinary.com https://generativelanguage.googleapis.com",
              "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com",
              "frame-ancestors 'self' https://app.sandbox.midtrans.com",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // ============================================================
  // Image Configuration
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 1 day
  },

  // ============================================================
  // Compression
  // ============================================================
  compress: true,

  // ============================================================
  // Production Optimizations
  // ============================================================
  reactStrictMode: true,
  poweredByHeader: false, // Hide X-Powered-By header

  // ============================================================
  // PWA Configuration (disable in production to avoid conflicts)
  // ============================================================
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },

  // ============================================================
  // Redirects for www/non-www and HTTP/HTTPS
  // ============================================================
  async redirects() {
    return [
      // Force HTTPS is handled by hosting provider (Rumahweb SSL)
      // Force non-www to www (optional - uncomment if needed)
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: '^(?!www\\.).*' }],
      //   destination: 'https://www.:host/:path*',
      //   permanent: true,
      // },
    ]
  },

  // ============================================================
  // Experimental Features
  // ============================================================
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['framer-motion', 'react-datepicker', 'recharts', 'swiper'],
  },
}

module.exports = withNextIntl(nextConfig)