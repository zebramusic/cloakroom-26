import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe/client"
import connectDB from "@/lib/mongodb"
import { Order } from "@/lib/models"
import Stripe from "stripe"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  // Handle the event
  await connectDB()

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
          // Update order payment status
          const order = await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: "paid",
              paymentIntentId: paymentIntent.id,
            },
            { new: true }
          )

          if (!order) {
            console.error("Order not found:", orderId)
          } else {
            console.log(`Order ${orderId} marked as paid`)
            // TODO: Send confirmation email
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
          // Update order payment status
          const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: "failed" },
            { new: true }
          )

          if (!order) {
            console.error("Order not found:", orderId)
          } else {
            console.log(`Order ${orderId} payment failed`)
            // TODO: Send payment failed email
          }
        }
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent

        if (paymentIntentId) {
          // Find order by payment intent and update status
          const order = await Order.findOneAndUpdate(
            { paymentIntentId: paymentIntentId as string },
            { paymentStatus: "refunded" },
            { new: true }
          )

          if (order) {
            console.log(`Order ${order._id} refunded for payment intent: ${paymentIntentId}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
