import nodemailer from "nodemailer"

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface OrderEmailData {
  orderId: string
  orderNumber: string
  customerEmail: string
  customerName: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  deliveryFee: number
  codFee: number
  total: number
  paymentMethod: string
  deliveryMethod: string
  billingAddress: {
    name: string
    address: string
    city: string
    county: string
    postalCode: string
    country: string
  }
  shippingAddress: {
    name: string
    address: string
    city: string
    county: string
    postalCode: string
    country: string
  }
  locale: string
}

function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
    style: "currency",
    currency: "RON",
  }).format(price)
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const isRomanian = data.locale === "ro"

  const subject = isRomanian
    ? `Confirmare comandă ${data.orderNumber}`
    : `Order Confirmation ${data.orderNumber}`

  const itemsHTML = data.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price, data.locale)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${formatPrice(item.total, data.locale)}</td>
    </tr>
  `
    )
    .join("")

  const paymentMethodText = {
    stripe: isRomanian ? "Card bancar" : "Credit Card",
    bank_transfer: isRomanian ? "Transfer bancar" : "Bank Transfer",
    cash_on_delivery: isRomanian ? "Ramburs" : "Cash on Delivery",
  }[data.paymentMethod] || data.paymentMethod

  const deliveryMethodText = {
    courier: isRomanian ? "Livrare cu curier" : "Courier Delivery",
    pickup: isRomanian ? "Ridicare personală" : "Personal Pickup",
  }[data.deliveryMethod] || data.deliveryMethod

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                ${isRomanian ? "Comandă Confirmată!" : "Order Confirmed!"}
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; opacity: 0.9;">
                ${isRomanian ? "Mulțumim pentru comandă!" : "Thank you for your order!"}
              </p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  ${isRomanian ? "Număr comandă:" : "Order number:"}
                </p>
                <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #111827; font-family: monospace;">
                  ${data.orderNumber}
                </p>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">
                ${isRomanian ? "Produse comandate:" : "Order Items:"}
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 4px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">
                      ${isRomanian ? "Produs" : "Product"}
                    </th>
                    <th style="padding: 12px 8px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">
                      ${isRomanian ? "Cant." : "Qty"}
                    </th>
                    <th style="padding: 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">
                      ${isRomanian ? "Preț" : "Price"}
                    </th>
                    <th style="padding: 12px 8px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">
                      ${isRomanian ? "Total" : "Total"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding: 0 30px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">${isRomanian ? "Subtotal:" : "Subtotal:"}</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatPrice(data.subtotal, data.locale)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">${isRomanian ? "TVA (19%):" : "VAT (19%):"}</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatPrice(data.tax, data.locale)}</td>
                </tr>
                ${
                  data.deliveryFee > 0
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">${isRomanian ? "Livrare:" : "Delivery:"}</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatPrice(data.deliveryFee, data.locale)}</td>
                </tr>
                `
                    : ""
                }
                ${
                  data.codFee > 0
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">${isRomanian ? "Taxă ramburs:" : "COD Fee:"}</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatPrice(data.codFee, data.locale)}</td>
                </tr>
                `
                    : ""
                }
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #111827;">
                    ${isRomanian ? "TOTAL:" : "TOTAL:"}
                  </td>
                  <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #7c3aed;">
                    ${formatPrice(data.total, data.locale)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery & Payment Info -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 10px; vertical-align: top;">
                    <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px;">
                      <p style="margin: 0 0 8px; font-weight: 600; color: #111827; font-size: 14px;">
                        ${isRomanian ? "Metodă plată:" : "Payment method:"}
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        ${paymentMethodText}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px; vertical-align: top;">
                    <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px;">
                      <p style="margin: 0 0 8px; font-weight: 600; color: #111827; font-size: 14px;">
                        ${isRomanian ? "Metodă livrare:" : "Delivery method:"}
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        ${deliveryMethodText}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #111827; font-size: 14px;">
                  ${isRomanian ? "Adresă livrare:" : "Shipping address:"}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                  ${data.shippingAddress.name}<br>
                  ${data.shippingAddress.address}<br>
                  ${data.shippingAddress.city}, ${data.shippingAddress.county}, ${data.shippingAddress.postalCode}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                ${isRomanian ? "Ai întrebări? Contactează-ne:" : "Questions? Contact us:"}
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="mailto:comenzi@garderoba.ro" style="color: #7c3aed; text-decoration: none;">comenzi@garderoba.ro</a>
                | 
                <a href="tel:+40721234567" style="color: #7c3aed; text-decoration: none;">+40 721 234 567</a>
              </p>
              <p style="margin: 16px 0 0; font-size: 12px; color: #9ca3af;">
                © 2026 Garderobă Profesională. ${isRomanian ? "Toate drepturile rezervate." : "All rights reserved."}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: `"Garderobă Profesională" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject,
      html,
    })

    console.log(`Order confirmation email sent to ${data.customerEmail}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to send order confirmation email:", error)
    return { success: false, error }
  }
}
