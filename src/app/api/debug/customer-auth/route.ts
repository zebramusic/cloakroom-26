import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Lazy-load to avoid Edge Runtime issues
    const connectDB = (await import("@/lib/mongodb")).default;
    const { Customer } = await import("@/lib/models-customer");
    const { verifyPassword } = await import("@/lib/auth/customer-auth");

    await connectDB();

    const normalizedEmail = email.toLowerCase();
    const customer = await Customer.findOne({ email: normalizedEmail }).lean();

    if (!customer) {
      return NextResponse.json({
        success: false,
        error: 'Customer not found',
        debug: { normalizedEmail }
      });
    }

    const passwordValid = customer.passwordHash 
      ? await verifyPassword(password, customer.passwordHash)
      : false;

    return NextResponse.json({
      success: true,
      debug: {
        found: true,
        email: customer.email,
        hasPassword: !!customer.passwordHash,
        passwordValid,
        emailVerified: customer.emailVerified,
        isActive: customer.isActive,
        env: process.env.NODE_ENV,
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
