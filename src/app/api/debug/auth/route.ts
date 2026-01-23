import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';

/**
 * Debug endpoint to check auth status
 * GET /api/debug/auth
 */
export async function GET(request: Request) {
  try {
    // Get session via auth()
    const session = await auth();
    
    // Get token via getToken (same as middleware)
    const token = await getToken({ 
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Get all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieNames = allCookies.map(c => c.name);
    
    // Get headers
    const headersList = await headers();
    const host = headersList.get('host');
    const referer = headersList.get('referer');

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      host,
      referer,
      session: session ? {
        user: session.user,
        expires: session.expires,
      } : null,
      token: token ? {
        id: token.id,
        email: token.email,
        role: token.role,
        principalType: token.principalType,
      } : null,
      cookies: cookieNames,
      hasSessionCookie: cookieNames.some(name => 
        name.includes('next-auth') || name.includes('session')
      ),
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
