"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Package, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface OrderDisplay {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  payment_method: string;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

interface OrdersListProps {
  orders: OrderDisplay[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const router = useRouter();
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const orderColumns: Column<OrderDisplay>[] = [
    {
      key: "order_number",
      label: "Order #",
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold">{value}</span>
      ),
    },
    {
      key: "customer_name",
      label: "Customer",
      sortable: true,
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (value) => (
        <span className="font-semibold">{value.toFixed(2)} RON</span>
      ),
    },
    {
      key: "payment_status",
      label: "Payment",
      sortable: true,
      render: (value) => {
        const colors: Record<string, string> = {
          paid: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-700",
        };
        return (
          <Badge variant="secondary" className={colors[value] || ""}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "delivery_status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const colors: Record<string, string> = {
          pending: "bg-gray-100 text-gray-700",
          processing: "bg-blue-100 text-blue-700",
          shipped: "bg-purple-100 text-purple-700",
          delivered: "bg-green-100 text-green-700",
          cancelled: "bg-red-100 text-red-700",
        };
        return (
          <Badge variant="secondary" className={colors[value] || ""}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value, "ro"),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/orders/${order.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          {order.delivery_status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateOrderStatus(order.id, "processing")}
              disabled={updatingOrder === order.id}
            >
              <Package className="w-4 h-4 mr-1" />
              Process
            </Button>
          )}

          {order.delivery_status === "processing" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateOrderStatus(order.id, "shipped")}
              disabled={updatingOrder === order.id}
            >
              <Check className="w-4 h-4 mr-1" />
              Ship
            </Button>
          )}

          {(order.delivery_status === "pending" ||
            order.delivery_status === "processing") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateOrderStatus(order.id, "cancelled")}
              disabled={updatingOrder === order.id}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-1">View and manage all orders</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={orders}
        columns={orderColumns}
        searchPlaceholder="Search by order #, customer name or email..."
        emptyMessage="No orders found"
      />
    </div>
  );
}
