import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateInvoicePDF } from "@/lib/pdf/invoice"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient()
    const { orderId } = params

    // Fetch order
    const { data: order, error: orderError } = (await (supabase
      .from("orders") as any)
      .select("*")
      .eq("id", orderId)
      .single()) as any

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Fetch order items
    const { data: orderItems, error: itemsError } = (await (supabase
      .from("order_items") as any)
      .select("*")
      .eq("order_id", orderId)) as any

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to fetch order items" },
        { status: 500 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF({
      orderNumber: order.order_number,
      orderDate: order.created_at,
      customerName: `${order.billing_first_name} ${order.billing_last_name}`,
      customerEmail: order.email,
      billingAddress: {
        name: `${order.billing_first_name} ${order.billing_last_name}`,
        company: order.billing_company || undefined,
        address: order.billing_address,
        city: order.billing_city,
        county: order.billing_county,
        postalCode: order.billing_postal_code,
        country: order.billing_country,
      },
      items: orderItems.map((item: any) => ({
        name: item.product_name,
        sku: item.product_sku,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: item.total_price,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.delivery_fee || 0,
      codFee: order.cod_fee || 0,
      total: order.total,
      paymentMethod: order.payment_method,
      locale: order.locale || "ro",
    })

    // Return PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Factura-${order.order_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Invoice generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    )
  }
}
