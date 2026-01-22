import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import mongoose from "mongoose";
import CustomerNav from "@/components/customer/CustomerNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  processing: "bg-purple-100 text-purple-800 border-purple-300",
  shipped: "bg-cyan-100 text-cyan-800 border-cyan-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || session.user.principalType !== "customer") {
    redirect("/account/login");
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    redirect("/account/orders");
  }

  await connectDB();

  const order = await Order.findOne({
    _id: id,
    customerId: session.user.id,
  }).lean();

  if (!order) {
    redirect("/account/orders");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav userName={session.user.name || "Customer"} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/account/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Badge
                    className={
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      paymentStatusColors[order.paymentStatus] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    Payment:{" "}
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      {item.variantId && (
                        <p className="text-sm text-gray-500">
                          Variant: {item.variantId}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium">{item.price.toFixed(2)} RON</p>
                      <p className="text-sm font-semibold text-primary">
                        {item.subtotal.toFixed(2)} RON
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{order.subtotal.toFixed(2)} RON</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{order.shippingCost.toFixed(2)} RON</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 19%):</span>
                  <span>{order.tax.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">
                    {order.total.toFixed(2)} RON
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{order.customerName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2 text-gray-600">
                  Phone: {order.customerPhone}
                </p>
                <p className="text-gray-600">Email: {order.customerEmail}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment & Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <p className="text-gray-600">Payment Method:</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-600">Shipping Method:</p>
                  <p className="font-medium">{order.shippingMethod}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-600">Tracking Number:</p>
                    <p className="font-medium font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <p className="text-gray-600">Order Notes:</p>
                    <p className="italic">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
