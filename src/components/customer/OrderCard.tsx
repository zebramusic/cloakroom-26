"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    items: Array<{
      productName: string;
      quantity: number;
    }>;
    createdAt: string;
  };
}

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

export default function OrderCard({ order }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const productNames = order.items.map((item) => item.productName).join(", ");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Order #{order.orderNumber}
          </CardTitle>
          <Badge
            className={
              statusColors[order.status] || "bg-gray-100 text-gray-800"
            }
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">
            {new Date(order.createdAt).toLocaleDateString("ro-RO", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-medium">
            {itemCount} product{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Products:</span>
          <span
            className="font-medium text-right max-w-[200px] truncate"
            title={productNames}
          >
            {productNames}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment:</span>
          <Badge
            variant="outline"
            className={
              paymentStatusColors[order.paymentStatus] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {order.paymentStatus.charAt(0).toUpperCase() +
              order.paymentStatus.slice(1)}
          </Badge>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total:</span>
          <span className="text-primary">{order.total.toFixed(2)} RON</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/account/orders/${order._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
