import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified
    customer.emailVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpires = undefined;
    await customer.save();

    console.log('[EMAIL VERIFIED]', { customerId: customer._id, email: customer.email });

    return NextResponse.json({
      message: 'Email verified successfully. You can now log in.',
      verified: true,
    });
  } catch (error) {
    console.error('[EMAIL VERIFICATION ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again.' },
      { status: 500 }
    );
  }
}
