import PDFDocument from "pdfkit"
import { Readable } from "stream"

interface InvoiceData {
  orderNumber: string
  orderDate: string
  customerName: string
  customerEmail: string
  billingAddress: {
    name: string
    address: string
    city: string
    county: string
    postalCode: string
    country: string
    company?: string
  }
  items: Array<{
    name: string
    sku: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  deliveryFee: number
  codFee: number
  total: number
  paymentMethod: string
  locale: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(price)
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" })
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    const isRomanian = data.locale === "ro"

    // Header
    doc
      .fontSize(24)
      .fillColor("#7c3aed")
      .text(isRomanian ? "FACTURĂ PROFORMĂ" : "PROFORMA INVOICE", 50, 50)

    doc.fontSize(10).fillColor("#000000").text(`#${data.orderNumber}`, 50, 80)

    // Company Info (Right aligned)
    const rightX = 350
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Garderobă Profesională SRL", rightX, 50, { align: "right" })
    doc
      .fontSize(9)
      .font("Helvetica")
      .text("Str. Exemplu nr. 1", rightX, 68, { align: "right" })
      .text("București, 010101", rightX, 80, { align: "right" })
      .text("România", rightX, 92, { align: "right" })
      .text("CUI: RO12345678", rightX, 104, { align: "right" })
      .text("Tel: +40 721 234 567", rightX, 116, { align: "right" })
      .text("comenzi@garderoba.ro", rightX, 128, { align: "right" })

    // Line separator
    doc.moveTo(50, 160).lineTo(550, 160).stroke("#e5e7eb")

    // Date and Payment Info
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(isRomanian ? "Data emitere:" : "Issue date:", 50, 180)
    doc
      .font("Helvetica")
      .text(
        new Date(data.orderDate).toLocaleDateString(isRomanian ? "ro-RO" : "en-US"),
        150,
        180
      )

    doc
      .font("Helvetica-Bold")
      .text(isRomanian ? "Metodă plată:" : "Payment method:", 50, 195)
    const paymentMethodText: Record<string, string> = {
      stripe: isRomanian ? "Card bancar" : "Credit Card",
      bank_transfer: isRomanian ? "Transfer bancar" : "Bank Transfer",
      cash_on_delivery: isRomanian ? "Ramburs" : "Cash on Delivery",
    }
    doc.font("Helvetica").text(paymentMethodText[data.paymentMethod] || data.paymentMethod, 150, 195)

    // Billing Information
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(isRomanian ? "Facturat către:" : "Bill to:", 50, 230)

    let y = 248
    if (data.billingAddress.company) {
      doc.fontSize(10).font("Helvetica").text(data.billingAddress.company, 50, y)
      y += 14
    }
    doc.text(data.billingAddress.name, 50, y)
    y += 14
    doc.text(data.billingAddress.address, 50, y)
    y += 14
    doc.text(
      `${data.billingAddress.city}, ${data.billingAddress.county}, ${data.billingAddress.postalCode}`,
      50,
      y
    )
    y += 14
    doc.text(data.billingAddress.country, 50, y)
    y += 14
    doc.fontSize(9).text(data.customerEmail, 50, y)

    // Items Table
    const tableTop = y + 40
    const itemCodeX = 50
    const descriptionX = 120
    const quantityX = 340
    const priceX = 400
    const amountX = 480

    // Table header
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#6b7280")
    doc
      .text(isRomanian ? "COD" : "CODE", itemCodeX, tableTop)
      .text(isRomanian ? "DESCRIERE" : "DESCRIPTION", descriptionX, tableTop)
      .text(isRomanian ? "CANT." : "QTY", quantityX, tableTop)
      .text(isRomanian ? "PREȚ UNITAR" : "UNIT PRICE", priceX, tableTop)
      .text(isRomanian ? "TOTAL" : "TOTAL", amountX, tableTop)

    // Table header line
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke("#e5e7eb")

    // Table rows
    let itemY = tableTop + 25
    doc.fontSize(9).font("Helvetica").fillColor("#000000")

    data.items.forEach((item) => {
      doc.text(item.sku, itemCodeX, itemY, { width: 60 })
      doc.text(item.name, descriptionX, itemY, { width: 210 })
      doc.text(item.quantity.toString(), quantityX, itemY, { width: 50 })
      doc.text(formatPrice(item.unitPrice), priceX, itemY, { width: 70, align: "right" })
      doc.text(formatPrice(item.total), amountX, itemY, { width: 70, align: "right" })

      itemY += 20
    })

    // Totals section
    const totalsY = itemY + 20
    doc.moveTo(340, totalsY - 10).lineTo(550, totalsY - 10).stroke("#e5e7eb")

    const totalsX = 400
    const totalsValueX = 480

    doc.fontSize(9).font("Helvetica").fillColor("#6b7280")
    doc.text(isRomanian ? "Subtotal:" : "Subtotal:", totalsX, totalsY)
    doc.fillColor("#000000").text(formatPrice(data.subtotal), totalsValueX, totalsY, {
      width: 70,
      align: "right",
    })

    doc.fillColor("#6b7280").text(isRomanian ? "TVA (19%):" : "VAT (19%):", totalsX, totalsY + 15)
    doc.fillColor("#000000").text(formatPrice(data.tax), totalsValueX, totalsY + 15, {
      width: 70,
      align: "right",
    })

    let currentY = totalsY + 30

    if (data.deliveryFee > 0) {
      doc
        .fillColor("#6b7280")
        .text(isRomanian ? "Transport:" : "Delivery:", totalsX, currentY)
      doc.fillColor("#000000").text(formatPrice(data.deliveryFee), totalsValueX, currentY, {
        width: 70,
        align: "right",
      })
      currentY += 15
    }

    if (data.codFee > 0) {
      doc
        .fillColor("#6b7280")
        .text(isRomanian ? "Taxă ramburs:" : "COD fee:", totalsX, currentY)
      doc.fillColor("#000000").text(formatPrice(data.codFee), totalsValueX, currentY, {
        width: 70,
        align: "right",
      })
      currentY += 15
    }

    // Total line
    doc.moveTo(340, currentY).lineTo(550, currentY).stroke("#e5e7eb")
    currentY += 10

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#7c3aed")
      .text(isRomanian ? "TOTAL:" : "TOTAL:", totalsX, currentY)
    doc.text(formatPrice(data.total), totalsValueX, currentY, { width: 70, align: "right" })

    // Footer
    const footerY = 720
    doc
      .fontSize(8)
      .fillColor("#9ca3af")
      .font("Helvetica")
      .text(
        isRomanian
          ? "Acest document este o factură proformă și nu constituie document fiscal."
          : "This is a proforma invoice and does not constitute a tax document.",
        50,
        footerY,
        { align: "center", width: 500 }
      )

    doc.text(
      `© 2026 Garderobă Profesională SRL. ${isRomanian ? "Toate drepturile rezervate." : "All rights reserved."}`,
      50,
      footerY + 15,
      { align: "center", width: 500 }
    )

    doc.end()
  })
}
