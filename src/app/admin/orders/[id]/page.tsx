import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { formatDate } from "@/lib/utils/format";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();

  if (!order) {
    notFound();
  }

  const deliveryFee = order.deliveryFee ?? order.shippingCost ?? 0;
  const codFee = order.codFee ?? 0;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt.toISOString(), "ro")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
            Payment: {order.paymentStatus}
          </Badge>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      {item.variantId && (
                        <p className="text-sm text-gray-500">
                          Variant: {item.variantId}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.price.toFixed(2)} RON</p>
                      <p className="text-sm text-gray-500">
                        Subtotal: {item.subtotal.toFixed(2)} RON
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{order.subtotal.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (19%)</span>
                  <span>{order.tax.toFixed(2)} RON</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>{deliveryFee.toFixed(2)} RON</span>
                  </div>
                )}
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Fee</span>
                    <span>{codFee.toFixed(2)} RON</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} RON</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater
                orderId={order._id.toString()}
                currentStatus={order.status}
                currentPaymentStatus={order.paymentStatus}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium break-all">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Method</p>
                <p className="font-medium capitalize">
                  {order.paymentMethod.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.paymentIntentId && (
                <div>
                  <p className="text-sm text-gray-500">Stripe Payment ID</p>
                  <p className="text-xs font-mono break-all">
                    {order.paymentIntentId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
