import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import { hashPassword } from '@/lib/auth/customer-auth';

/**
 * POST /api/customer/profile/change-password
 * Change customer password
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findById(session.user.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Verify current password
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(currentPassword, customer.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash and update new password
    customer.passwordHash = await hashPassword(newPassword);
    await customer.save();

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('[POST /api/customer/profile/change-password] Error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
