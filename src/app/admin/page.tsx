import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileText, DollarSign, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

interface Quote {
  id: string;
  customer_name: string;
  company_name: string;
  quantity: number;
  status: string;
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
    key: "total",
    label: "Total",
    sortable: true,
    render: (value) => `${value} RON`,
  },
  {
    key: "payment_status",
    label: "Payment",
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
    key: "created_at",
    label: "Date",
    sortable: true,
    render: (value) => formatDate(value, "ro"),
  },
];

const quoteColumns: Column<Quote>[] = [
  {
    key: "customer_name",
    label: "Customer",
    sortable: true,
  },
  {
    key: "company_name",
    label: "Company",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Quantity",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const colors: Record<string, string> = {
        new: "bg-blue-100 text-blue-700",
        contacted: "bg-purple-100 text-purple-700",
        quoted: "bg-orange-100 text-orange-700",
        won: "bg-green-100 text-green-700",
        lost: "bg-red-100 text-red-700",
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

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const [ordersResult, quotesResult] = await Promise.all([
    supabase
      .from("orders")
      .select("total, payment_status, created_at", { count: "exact" }),
    supabase.from("quotes").select("id, status", { count: "exact" }),
  ]);

  const totalOrders = ordersResult.count || 0;
  const totalQuotes = quotesResult.count || 0;

  // Calculate revenue (only paid orders)
  const paidOrders =
    ordersResult.data?.filter((o: any) => o.payment_status === "paid") || [];
  const totalRevenue = paidOrders.reduce(
    (sum: number, order: any) => sum + (order.total || 0),
    0,
  );

  // Calculate pending orders
  const pendingOrders =
    ordersResult.data?.filter((o: any) => o.payment_status === "pending")
      .length || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch recent quotes
  const { data: recentQuotes } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your business metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          iconColor="purple"
        />
        <StatsCard
          title="Total Quotes"
          value={totalQuotes}
          icon={FileText}
          iconColor="blue"
        />
        <StatsCard
          title="Revenue"
          value={`${totalRevenue.toFixed(2)} RON`}
          icon={DollarSign}
          iconColor="green"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={TrendingUp}
          iconColor="orange"
        />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <DataTable
          data={(recentOrders || []) as Order[]}
          columns={orderColumns}
          searchable={false}
          emptyMessage="No orders yet"
        />
      </div>

      {/* Recent Quotes */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Quotes</h2>
        <DataTable
          data={(recentQuotes || []) as Quote[]}
          columns={quoteColumns}
          searchable={false}
          emptyMessage="No quotes yet"
        />
      </div>
    </div>
  );
}
