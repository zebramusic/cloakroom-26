import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import { hashPassword, validatePassword } from '@/lib/auth/customer-auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.error },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (!customer.isActive) {
      return NextResponse.json(
        { error: 'This account is not active' },
        { status: 403 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update customer
    customer.passwordHash = passwordHash;
    customer.passwordResetToken = undefined;
    customer.passwordResetExpires = undefined;
    await customer.save();

    console.log('[PASSWORD RESET SUCCESS]', { customerId: customer._id, email: customer.email });

    return NextResponse.json({
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
