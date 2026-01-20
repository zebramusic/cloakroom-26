import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {createServerClient, type CookieOptions} from '@supabase/ssr';

const intlMiddleware = createMiddleware({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  // First, handle i18n
  let response = intlMiddleware(request);

  // Then, handle Supabase auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
  const {data: {session}} = await supabase.auth.getSession();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      // Redirect to dashboard if already logged in
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return response;
    }
    
    // Require authentication for all other admin routes
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
