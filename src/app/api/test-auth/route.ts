import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get session via auth()
    const session = await auth();
    
    // Get token via getToken
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Get all cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
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
      cookies: allCookies.map(c => ({
        name: c.name,
        valueLength: c.value.length,
        valuePreview: c.value.substring(0, 20) + '...',
      })),
      authCookie: allCookies.find(c => 
        c.name.includes('next-auth') || 
        c.name.includes('session-token') ||
        c.name.includes('authjs')
      ) ? 'found' : 'not found',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
