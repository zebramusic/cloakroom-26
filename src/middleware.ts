import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed',
  localeDetection: false
});

export async function middleware(request: NextRequest) {
  // Skip i18n for admin, api, and account routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAccountRoute = request.nextUrl.pathname.startsWith('/account');
  
  // First, handle i18n for non-admin/account routes
  let response = (isAdminRoute || isApiRoute || isAccountRoute) ? NextResponse.next() : intlMiddleware(request);

  // Then, handle auth - use getToken which works in Edge runtime
  const token = await getToken({ req: request });

  // Protect customer account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    // Public account routes (don't require authentication)
    const publicAccountRoutes = [
      '/account/login', 
      '/account/signup', 
      '/account/forgot-password', 
      '/account/reset-password',
      '/account/verify-email',
    ];
    const isPublicRoute = publicAccountRoutes.some(route => request.nextUrl.pathname === route);
    
    if (isPublicRoute) {
      // Redirect to shop if already logged in as customer
      if (token && token.principalType === 'customer' && !request.nextUrl.pathname.startsWith('/account/reset-password')) {
        return NextResponse.redirect(new URL('/shop', request.url));
      }
      return response;
    }
    
    // Require customer authentication for all other account routes
    if (!token || token.principalType !== 'customer') {
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Public admin routes (don't require authentication)
    const publicAdminRoutes = ['/admin/login', '/admin/signup', '/admin/forgot-password', '/admin/reset-password'];
    const isPublicRoute = publicAdminRoutes.some(route => request.nextUrl.pathname === route);
    
    if (isPublicRoute) {
      // Redirect to dashboard if already logged in as admin (except for password reset)
      if (token && token.principalType === 'admin' && !request.nextUrl.pathname.startsWith('/admin/reset-password')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return response;
    }
    
    // Require admin authentication for all other admin routes
    if (!token || token.principalType !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Get user role from token
    const role = token.role as string;
    
    // Role-based route protection
    const path = request.nextUrl.pathname;
    
    // Admin-only routes
    if ((path.startsWith('/admin/settings') || 
         path.startsWith('/admin/partners/') ||
         path === '/admin/partners') && 
        role !== 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Admin and Manager only routes (users management)
    if ((path.startsWith('/admin/users/') || path === '/admin/users') &&
        role !== 'admin' && role !== 'manager') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Manager and above routes
    if ((path.startsWith('/admin/orders/') ||
         path.startsWith('/admin/quotes/') ||
         path === '/admin/orders' ||
         path === '/admin/quotes') &&
        role !== 'admin' && role !== 'manager' && role !== 'support') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    // Products - editors can view but not edit
    if (path.startsWith('/admin/products/edit') && 
        role !== 'admin' && role !== 'manager') {
      return NextResponse.redirect(new URL('/admin/products', request.url));
    }
  }

  return response;
}

export const config = {
  // Exclude: API routes, Next.js internals, static files
  // Include: All other routes including /admin and /account for auth checks
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ]
};
