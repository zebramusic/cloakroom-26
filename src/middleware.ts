import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const intlMiddleware = createMiddleware({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed',
  localeDetection: false
});

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  // Skip i18n for admin, api, and account routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAccountRoute = request.nextUrl.pathname.startsWith('/account');
  
  // Handle i18n for public routes only
  if (!isAdminRoute && !isApiRoute && !isAccountRoute) {
    return intlMiddleware(request);
  }
  
  return NextResponse.next();
});

export const config = {
  // Exclude: API routes, Next.js internals, static files
  // Include: All other routes including /admin and /account for auth checks
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ]
};
