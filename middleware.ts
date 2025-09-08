import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `${ip}:${request.nextUrl.pathname}`
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request)
    const now = Date.now()
    
    const current = requestCounts.get(key)
    
    if (!current || current.resetTime < now) {
      // Start new window
      requestCounts.set(key, {
        count: 1,
        resetTime: now + RATE_LIMIT.windowMs,
      })
    } else if (current.count >= RATE_LIMIT.maxRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((current.resetTime - now) / 1000)),
          },
        }
      )
    } else {
      // Increment count
      current.count++
      requestCounts.set(key, current)
    }
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance on each request
      const cutoff = now - RATE_LIMIT.windowMs * 2
      for (const [k, v] of requestCounts.entries()) {
        if (v.resetTime < cutoff) {
          requestCounts.delete(k)
        }
      }
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}