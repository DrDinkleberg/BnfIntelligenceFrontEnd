import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// Security Middleware for BNF Intelligence Platform
// Handles CSP, security headers, and request validation
// ============================================

// Nonce generator for CSP (if needed for inline scripts)
function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

// Content Security Policy
function getCSPHeader(nonce: string): string {
  const csp = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // Trusted external scripts
      'https://accounts.google.com',
      'https://*.googletagmanager.com',
      'https://*.sentry.io',
      // Development only
      ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind and most CSS-in-JS
      'https://fonts.googleapis.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://*.googleusercontent.com',
      'https://*.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      // API endpoints
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      // Google OAuth
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      // Sentry
      'https://*.sentry.io',
      'https://*.ingest.sentry.io',
      // Analytics (if using)
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      // Development
      ...(process.env.NODE_ENV === 'development' ? ['ws://localhost:*'] : []),
    ],
    'frame-src': [
      "'self'",
      'https://accounts.google.com',
    ],
    'frame-ancestors': ["'self'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  }

  return Object.entries(csp)
    .map(([key, values]) => {
      if (values.length === 0) return key
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

// Security headers
function getSecurityHeaders(nonce: string): Record<string, string> {
  return {
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(nonce),
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // HTTP Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Permissions Policy (formerly Feature-Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // Opt out of FLoC
      'browsing-topics=()', // Opt out of Topics API
    ].join(', '),
    
    // Cross-Origin policies
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // Pass nonce to the page for inline scripts
    'X-Nonce': nonce,
  }
}

// Rate limiting state (in production, use Redis or Cloud Memorystore)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)

export function middleware(request: NextRequest) {
  const nonce = generateNonce()
  
  // Get client IP (Cloud Run provides this in x-forwarded-for)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  // Rate limiting (skip for static assets)
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next/') ||
                        request.nextUrl.pathname.startsWith('/static/') ||
                        request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/)
  
  if (!isStaticAsset && !checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'Content-Type': 'text/plain',
      },
    })
  }
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // Apply security headers
  const securityHeaders = getSecurityHeaders(nonce)
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)
  
  // Remove sensitive headers
  response.headers.delete('X-Powered-By')
  
  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
