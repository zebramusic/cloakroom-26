import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connectDB from "@/lib/mongodb"
import { Order } from "@/lib/models"
import { Customer } from "@/lib/models-customer"
import { auth } from "@/auth"
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Check if user is authenticated
    const session = await auth()

    const {
      email,
      phone,
      billingFirstName,
      billingLastName,
      billingCompany,
      billingAddress,
      billingCity,
      billingCounty,
      billingPostalCode,
      billingCountry,
      shippingIsSame,
      shippingFirstName,
      shippingLastName,
      shippingAddress,
      shippingCity,
      shippingCounty,
      shippingPostalCode,
      shippingCountry,
      deliveryMethod,
      notes,
      paymentMethod,
      items,
      locale,
    } = body

    // Validate required fields
    if (!email || !phone || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const taxRate = 0.19 // 19% VAT
    const tax = subtotal * taxRate
    
    // Add delivery fee
    let deliveryFee = 0
    if (deliveryMethod === "courier") {
      deliveryFee = 50
    }
    
    // Add COD fee if applicable
    let codFee = 0
    if (paymentMethod === "cash_on_delivery") {
      codFee = 15
    }
    
    const total = subtotal + tax + deliveryFee + codFee

    // Generate order number (format: ORD-YYYYMMDD-XXXX)
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "")
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderNumber = `ORD-${dateStr}-${randomStr}`

    // Create order with embedded items
    const orderItems = items.map((item: any) => ({
      productId: item.product_id || item.id,
      productName: item.name,
      sku: item.sku,
      variantId: item.variant_id || item.variantId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }))

    // Try to find customer by session or email
    let customerId: mongoose.Types.ObjectId | undefined
    if (session?.user?.id && session?.user?.principalType === "customer") {
      if (mongoose.Types.ObjectId.isValid(session.user.id)) {
        customerId = new mongoose.Types.ObjectId(session.user.id)
      }
    } else {
      const existingCustomer = await Customer.findOne({ email }).lean()
      if (existingCustomer?._id) {
        customerId = new mongoose.Types.ObjectId(existingCustomer._id.toString())
      }
    }

    const order = await Order.create({
      orderNumber,
      status: "pending",
      customerId,
      customerName: `${billingFirstName} ${billingLastName}`,
      customerEmail: email,
      customerPhone: phone,
      
      billingAddress: {
        street: billingAddress,
        city: billingCity,
        state: billingCounty,
        postalCode: billingPostalCode,
        country: billingCountry,
      },
      
      shippingAddress: {
        street: shippingIsSame ? billingAddress : shippingAddress,
        city: shippingIsSame ? billingCity : shippingCity,
        state: shippingIsSame ? billingCounty : shippingCounty,
        postalCode: shippingIsSame ? billingPostalCode : shippingPostalCode,
        country: shippingIsSame ? billingCountry : shippingCountry,
      },
      
      items: orderItems,
      subtotal,
      shippingCost: deliveryFee,
      deliveryFee,
      codFee,
      tax,
      total,
      paymentStatus: "pending",
      paymentMethod,
      shippingMethod: deliveryMethod,
      notes: notes || undefined,
    })

    if (!order) {
      console.error("Order creation error")
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }
    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerEmail: email,
        customerName: `${billingFirstName} ${billingLastName}`,
        orderItems: order.items.map((item: any) => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.price,
          total: item.subtotal,
        })),
        subtotal,
        tax,
        deliveryFee,
        codFee,
        total,
        paymentMethod,
        deliveryMethod,
        billingAddress: {
          name: `${billingFirstName} ${billingLastName}`,
          address: billingAddress,
          city: billingCity,
          county: billingCounty,
          postalCode: billingPostalCode,
          country: billingCountry,
        },
        shippingAddress: {
          name: shippingIsSame
            ? `${billingFirstName} ${billingLastName}`
            : `${shippingFirstName} ${shippingLastName}`,
          address: shippingIsSame ? billingAddress : shippingAddress,
          city: shippingIsSame ? billingCity : shippingCity,
          county: shippingIsSame ? billingCounty : shippingCounty,
          postalCode: shippingIsSame ? billingPostalCode : shippingPostalCode,
          country: shippingIsSame ? billingCountry : shippingCountry,
        },
        locale,
      })
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
