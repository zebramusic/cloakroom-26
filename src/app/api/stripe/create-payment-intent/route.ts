import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json()

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify order exists
    const supabase = await createClient()
    const { data: order, error: orderError } = (await (supabase
      .from("orders") as any)
      .select("*")
      .eq("id", orderId)
      .single()) as any

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "ron",
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
