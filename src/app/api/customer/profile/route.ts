import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';

/**
 * GET /api/customer/profile
 * Fetch authenticated customer's profile
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const customer = await Customer.findById(session.user.id)
      .select('-passwordHash -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires')
      .lean();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('[GET /api/customer/profile] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/customer/profile
 * Update customer profile (name, company, phone, locale, billing address)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      companyName,
      phone,
      cui,
      vatNumber,
      localePreference,
      billingAddress,
    } = body;

    await connectDB();

    const customer = await Customer.findById(session.user.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Update fields if provided
    if (name !== undefined) customer.name = name;
    if (companyName !== undefined) customer.companyName = companyName;
    if (phone !== undefined) customer.phone = phone;
    if (cui !== undefined) customer.cui = cui;
    if (vatNumber !== undefined) customer.vatNumber = vatNumber;
    if (localePreference !== undefined && ['ro', 'en'].includes(localePreference)) {
      customer.localePreference = localePreference;
    }
    if (billingAddress !== undefined) {
      customer.billingAddress = billingAddress;
    }

    await customer.save();

    // Return updated customer without sensitive fields
    const updatedCustomer = await Customer.findById(session.user.id)
      .select('-passwordHash -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires')
      .lean();

    return NextResponse.json({ customer: updatedCustomer });
  } catch (error) {
    console.error('[PATCH /api/customer/profile] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
