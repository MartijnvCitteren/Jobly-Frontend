/**
 * Next.js Middleware
 *
 * Voegt security headers toe aan alle responses.
 * Draait op Edge Runtime voor optimale performance.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Content Security Policy
 */
const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' http://localhost:8090 https:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, ' ')
  .trim()

/**
 * Security headers die toegevoegd worden aan elke response
 */
const SECURITY_HEADERS = [
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: CSP_HEADER,
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Enable XSS filter in browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Control referer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Permissions Policy (Feature Policy)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * Middleware functie
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next()

  // Voeg security headers toe
  SECURITY_HEADERS.forEach(({ key, value }) => {
    response.headers.set(key, value)
  })

  return response
}

/**
 * Configureer op welke routes de middleware draait
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
