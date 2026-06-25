import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require the user to be logged IN (authenticated)
const PROTECTED_PREFIXES = ['/dashboard'];

// Auth routes — logged-in users should be redirected away from these
const AUTH_ROUTES = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve JWT token from the session cookie (works with next-auth JWT strategy)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // If the user is logged in and visits /login or /register, redirect to /dashboard
  if (isAuthenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is NOT logged in and visits a protected route, redirect to /login
  if (!isAuthenticated && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run the proxy on all paths EXCEPT:
     * - Next.js internals (_next/static, _next/image)
     * - Static assets (favicon.ico, sitemap.xml, robots.txt, images, fonts)
     * - NextAuth API routes (must be allowed through to function)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)',
  ],
};
