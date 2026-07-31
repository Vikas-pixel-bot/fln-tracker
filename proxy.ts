import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Exact paths that are public
  const publicPaths = ['/', '/signin']
  
  // Path prefixes that are public (games, resources, apis)
  const publicPrefixes = ['/play', '/arcade', '/resources', '/api', '/pedagogy', '/dashboards', '/about-lotb', '/catchup']
  
  const isPublicPath = publicPaths.includes(pathname)
  const isPublicPrefix = publicPrefixes.some(prefix => pathname.startsWith(prefix))
  
  if (isPublicPath || isPublicPrefix) {
    return NextResponse.next()
  }

  // Check for authentication cookies. 
  // We check for both Auth.js v5 and older NextAuth v4 cookies, including secure variants.
  const hasSessionToken = request.cookies.has('authjs.session-token') || 
                          request.cookies.has('__Secure-authjs.session-token') ||
                          request.cookies.has('next-auth.session-token') ||
                          request.cookies.has('__Secure-next-auth.session-token');
                          
  // If the user does not have a session cookie and tries to access a protected route,
  // redirect them to the landing page (which serves as the unauthenticated portal)
  if (!hasSessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
