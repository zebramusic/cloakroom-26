import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

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

    // Create order
    const { data: order, error: orderError } = (await (supabase
      .from("orders") as any)
      .insert({
        order_number: orderNumber,
        status: "pending",
        
        // Contact
        email,
        phone,
        
        // Billing address
        billing_first_name: billingFirstName,
        billing_last_name: billingLastName,
        billing_company: billingCompany || null,
        billing_address: billingAddress,
        billing_city: billingCity,
        billing_county: billingCounty,
        billing_postal_code: billingPostalCode,
        billing_country: billingCountry,
        
        // Shipping address
        shipping_is_same: shippingIsSame,
        shipping_first_name: shippingIsSame ? billingFirstName : shippingFirstName,
        shipping_last_name: shippingIsSame ? billingLastName : shippingLastName,
        shipping_address: shippingIsSame ? billingAddress : shippingAddress,
        shipping_city: shippingIsSame ? billingCity : shippingCity,
        shipping_county: shippingIsSame ? billingCounty : shippingCounty,
        shipping_postal_code: shippingIsSame ? billingPostalCode : shippingPostalCode,
        shipping_country: shippingIsSame ? billingCountry : shippingCountry,
        
        // Delivery & Payment
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        payment_status: "pending",
        
        // Totals
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        cod_fee: codFee,
        total,
        
        // Notes
        notes: notes || null,
        
        // Metadata
        locale,
      })
      .select()
      .single()) as any

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = (await (supabase
      .from("order_items") as any)
      .insert(orderItems)) as any

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      // Rollback order
      await (supabase.from("orders") as any).delete().eq("id", order.id)
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      )
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail: email,
        customerName: `${billingFirstName} ${billingLastName}`,
        orderItems: orderItems.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
          total: item.total_price,
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
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error("Order API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
