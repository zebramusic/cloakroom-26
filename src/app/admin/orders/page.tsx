import { createClient } from "@/lib/supabase/server";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

interface Order {
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

const orderColumns: Column<Order>[] = [
  {
    key: "order_number",
    label: "Order #",
    sortable: true,
  },
  {
    key: "customer_name",
    label: "Customer",
    sortable: true,
  },
  {
    key: "customer_email",
    label: "Email",
    sortable: true,
  },
  {
    key: "total",
    label: "Total",
    sortable: true,
    render: (value) => `${value.toFixed(2)} RON`,
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
    label: "Delivery",
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
];

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-1">View and manage all orders</p>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={(orders || []) as Order[]}
        columns={orderColumns}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found"
      />
    </div>
  );
}
