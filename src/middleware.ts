import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Middleware for handling authentication and route protection
 *
 * This middleware:
 * - Protects private routes by redirecting unauthenticated users to sign-in
 * - Prevents authenticated users from accessing auth pages
 * - Allows public access to landing page and API routes
 * - Preserves callback URL for better UX after authentication
 */
export default auth(req => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Define route patterns
  const isAuthPage = pathname.startsWith('/auth')
  const isPublicPage = pathname === '/'
  const isApiRoute = pathname.startsWith('/api')
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  // Allow public assets and API routes to pass through
  if (isPublicAsset || isApiRoute) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in (except for public and auth pages)
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    const signInUrl = new URL('/auth/signin', req.url)
    // Preserve the intended destination for redirect after login
    signInUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

/**
 * Configure which routes the middleware should run on
 *
 * Matches all request paths except:
 * - API routes (/api/*)
 * - Static files (_next/static/*)
 * - Image optimization files (_next/image/*)
 * - Favicon and other static assets
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
