import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Customer } from '@/lib/models-customer';
import mongoose from 'mongoose';

/**
 * PATCH /api/customer/profile/addresses/[id]
 * Update a shipping address
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    const body = await request.json();
    const { label, street, city, county, postalCode, country, isDefault } = body;

    await connectDB();

    const customer = await Customer.findById(session.user.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (!customer.shippingAddresses) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Find the address to update
    const addressIndex = customer.shippingAddresses.findIndex(
      addr => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      customer.shippingAddresses.forEach((addr, idx) => {
        if (idx !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update address fields
    const address = customer.shippingAddresses[addressIndex];
    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (county !== undefined) address.county = county;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await customer.save();

    return NextResponse.json({
      message: 'Address updated successfully',
      address: customer.shippingAddresses[addressIndex],
    });
  } catch (error) {
    console.error('[PATCH /api/customer/profile/addresses/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customer/profile/addresses/[id]
 * Delete a shipping address
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth();

    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json({ error: 'Invalid address ID' }, { status: 400 });
    }

    await connectDB();

    const customer = await Customer.findById(session.user.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (!customer.shippingAddresses) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Find the address to delete
    const addressIndex = customer.shippingAddresses.findIndex(
      addr => addr._id?.toString() === addressId
    );

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const wasDefault = customer.shippingAddresses[addressIndex].isDefault;

    // Remove the address
    customer.shippingAddresses.splice(addressIndex, 1);

    // If the deleted address was default and there are remaining addresses,
    // make the first one default
    if (wasDefault && customer.shippingAddresses.length > 0) {
      customer.shippingAddresses[0].isDefault = true;
    }

    await customer.save();

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/customer/profile/addresses/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
