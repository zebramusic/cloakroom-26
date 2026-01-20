import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

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
  const supabase = await createClient()

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        if (orderId) {
          // Update order payment status
          const { error } = (await (supabase
            .from("orders") as any)
            .update({
              payment_status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)) as any

          if (error) {
            console.error("Failed to update order:", error)
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

        if (orderId) {
          // Update order payment status
          const { error } = (await (supabase
            .from("orders") as any)
            .update({
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)) as any

          if (error) {
            console.error("Failed to update order:", error)
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
          const { data: orders } = (await (supabase
            .from("orders") as any)
            .select("*")
            .eq("payment_method", "stripe")) as any

          // TODO: Store payment_intent_id in orders table to make this lookup efficient
          console.log(`Charge refunded for payment intent: ${paymentIntentId}`)
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
