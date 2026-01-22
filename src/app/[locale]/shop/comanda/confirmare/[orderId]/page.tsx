import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
  Phone,
  Mail,
  MapPin,
  Download,
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import mongoose from "mongoose";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface OrderConfirmationPageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { locale, orderId } = await params;

  // Validate orderId
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    notFound();
  }

  await connectDB();

  // Fetch order details
  const order = await Order.findById(orderId).lean();

  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "ro" ? "ro-RO" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">
            {locale === "ro" ? "Comandă confirmată!" : "Order Confirmed!"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {locale === "ro"
              ? "Mulțumim pentru comandă! Am primit detaliile și o vom procesa în cel mai scurt timp."
              : "Thank you for your order! We've received your details and will process it shortly."}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {locale === "ro" ? "Număr comandă:" : "Order number:"}{" "}
            <strong className="font-mono text-foreground">
              {order.orderNumber}
            </strong>
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Order Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Payment Instructions */}
            {order.paymentMethod === "bank_transfer" && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-blue-900">
                      {locale === "ro" ? "Detalii plată" : "Payment Details"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium text-blue-900">
                    {locale === "ro"
                      ? "Vă rugăm să efectuați plata prin transfer bancar la următoarele date:"
                      : "Please make the payment via bank transfer to:"}
                  </p>
                  <div className="space-y-1 rounded-md bg-white p-4">
                    <p>
                      <strong>
                        {locale === "ro" ? "Beneficiar:" : "Beneficiary:"}
                      </strong>{" "}
                      Garderobă Profesională SRL
                    </p>
                    <p>
                      <strong>
                        {locale === "ro" ? "Cont IBAN:" : "IBAN:"}
                      </strong>{" "}
                      RO49 AAAA 1B31 0075 9384 0000
                    </p>
                    <p>
                      <strong>{locale === "ro" ? "Bancă:" : "Bank:"}</strong>{" "}
                      Banca Transilvania
                    </p>
                    <p>
                      <strong>{locale === "ro" ? "Sumă:" : "Amount:"}</strong>{" "}
                      {formatPrice(order.total)}
                    </p>
                    <p>
                      <strong>
                        {locale === "ro" ? "Referință:" : "Reference:"}
                      </strong>{" "}
                      {order.orderNumber}
                    </p>
                  </div>
                  <p className="text-xs text-blue-800">
                    {locale === "ro"
                      ? "* Comanda va fi procesată după confirmarea plății (1-2 zile lucrătoare)."
                      : "* Order will be processed after payment confirmation (1-2 business days)."}
                  </p>
                </CardContent>
              </Card>
            )}

            {order.paymentMethod === "cash_on_delivery" && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-amber-900">
                      {locale === "ro"
                        ? "Plată la livrare"
                        : "Cash on Delivery"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-amber-900">
                  <p>
                    {locale === "ro"
                      ? `Veți plăti suma de ${formatPrice(order.total)} curierului la primirea coletului. Vă rugăm să aveți suma pregătită în numerar.`
                      : `You will pay ${formatPrice(order.total)} to the courier upon receiving the package. Please have the amount ready in cash.`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "ro" ? "Produse comandate" : "Order Items"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                        <Image
                          src="/placeholder-product.jpg"
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "ro" ? "Cantitate:" : "Quantity:"}{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.subtotal)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <CardTitle>
                    {locale === "ro"
                      ? "Informații livrare"
                      : "Delivery Information"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium">
                    {locale === "ro" ? "Metodă livrare:" : "Delivery method:"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingMethod === "courier"
                      ? locale === "ro"
                        ? "Livrare cu curier (3-5 zile lucrătoare)"
                        : "Courier delivery (3-5 business days)"
                      : locale === "ro"
                        ? "Ridicare personală din București"
                        : "Personal pickup from Bucharest"}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 text-sm font-medium">
                    {locale === "ro" ? "Adresă livrare:" : "Delivery address:"}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.customerName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state},{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Contact */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "ro" ? "Rezumat comandă" : "Order Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === "ro" ? "Subtotal" : "Subtotal"}
                  </span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === "ro" ? "TVA (19%)" : "VAT (19%)"}
                  </span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {locale === "ro" ? "Livrare" : "Delivery"}
                    </span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{locale === "ro" ? "TOTAL" : "TOTAL"}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "ro" ? "Ai întrebări?" : "Questions?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href="mailto:comenzi@garderoba.ro"
                    className="hover:underline"
                  >
                    comenzi@garderoba.ro
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href="tel:+40721234567" className="hover:underline">
                    +40 721 234 567
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === "ro"
                    ? "Program: Luni - Vineri, 09:00 - 18:00"
                    : "Hours: Monday - Friday, 09:00 - 18:00"}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <a href={`/api/invoices/${orderId}`} download>
                  <Download className="mr-2 h-4 w-4" />
                  {locale === "ro"
                    ? "Descarcă Factură (PDF)"
                    : "Download Invoice (PDF)"}
                </a>
              </Button>
              <Button asChild className="w-full">
                <Link href={`/${locale}/shop`}>
                  {locale === "ro"
                    ? "Continuă cumpărăturile"
                    : "Continue Shopping"}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}`}>
                  {locale === "ro"
                    ? "Înapoi la pagina principală"
                    : "Back to Homepage"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
