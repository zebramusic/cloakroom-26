import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import mongoose from 'mongoose';

/**
 * POST /api/customer/profile/addresses
 * Add a new shipping address
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { label, street, city, county, postalCode, country, isDefault } = body;

    // Validate required fields
    if (!label || !street || !city) {
      return NextResponse.json(
        { error: 'Label, street, and city are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await Customer.findById(session.user.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      if (customer.shippingAddresses) {
        customer.shippingAddresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
    }

    // Create new address
    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      label,
      street,
      city,
      county: county || '',
      postalCode: postalCode || '',
      country: country || 'RO',
      isDefault: isDefault || false,
    };

    // Initialize array if it doesn't exist
    if (!customer.shippingAddresses) {
      customer.shippingAddresses = [];
    }

    // If this is the first address, make it default
    if (customer.shippingAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    customer.shippingAddresses.push(newAddress);
    await customer.save();

    return NextResponse.json({ 
      message: 'Address added successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('[POST /api/customer/profile/addresses] Error:', error);
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    );
  }
}
