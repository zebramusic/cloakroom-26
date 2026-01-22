import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { Customer } from '@/lib/models-customer';

/**
 * POST /api/customer/orders/claim
 * Claim an unclaimed order by order number and email match
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.principalType !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get customer details
    const customer = await Customer.findById(session.user.id);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Find order by order number
    const order = await Order.findOne({ orderNumber: orderNumber.trim() });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is already claimed
    if (order.customerId) {
      return NextResponse.json(
        { error: 'This order has already been claimed' },
        { status: 400 }
      );
    }

    // Verify email matches (case-insensitive)
    if (order.customerEmail.toLowerCase() !== customer.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email address does not match order' },
        { status: 403 }
      );
    }

    // Claim the order
    order.customerId = customer._id;
    await order.save();

    console.log('[ORDER CLAIMED]', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerId: customer._id,
      customerEmail: customer.email,
    });

    return NextResponse.json({
      message: 'Order claimed successfully',
      order: order.toObject(),
    });
  } catch (error) {
    console.error('[ORDER CLAIM ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to claim order' },
      { status: 500 }
    );
  }
}
