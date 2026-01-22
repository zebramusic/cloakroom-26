import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Order } from "@/lib/models"
import { generateInvoicePDF } from "@/lib/pdf/invoice"
import mongoose from "mongoose"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      )
    }

    await connectDB()

    // Fetch order with items
    const order = await Order.findById(orderId).lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      billingAddress: {
        name: order.customerName,
        company: undefined,
        address: order.billingAddress?.street || order.shippingAddress.street,
        city: order.billingAddress?.city || order.shippingAddress.city,
        county: order.billingAddress?.state || order.shippingAddress.state,
        postalCode: order.billingAddress?.postalCode || order.shippingAddress.postalCode,
        country: order.billingAddress?.country || order.shippingAddress.country,
      },
      items: order.items.map((item: any) => ({
        name: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.subtotal,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.shippingCost || 0,
      codFee: 0, // COD fee not stored separately in new schema
      total: order.total,
      paymentMethod: order.paymentMethod,
      locale: "ro",
    })

    // Return PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Factura-${order.orderNumber}.pdf"`,
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
