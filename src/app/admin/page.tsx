import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/admin/DashboardContent";

export const dynamic = "force-dynamic";

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

interface QuoteData {
  id: string;
  customerName: string;
  companyName: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export default async function AdminDashboardPage() {
  const session = await auth();
  
  if (!session?.user || session.user.principalType !== 'admin') {
    redirect('/admin/login');
  }

  // Lazy-load database operations
  const connectDB = (await import("@/lib/mongodb")).default;
  const { Order, Quote, Product } = await import("@/lib/models");

  await connectDB();

  // Fetch stats
  const totalOrders = await Order.countDocuments();
  const totalQuotes = await Quote.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Calculate total revenue
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Fetch recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const ordersData: OrderData[] = recentOrders.map((order: any) => ({
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    total: order.total,
    paymentStatus: order.paymentStatus,
    deliveryStatus: order.deliveryStatus,
    createdAt: order.createdAt.toISOString(),
  }));

  // Fetch recent quotes
  const recentQuotes = await Quote.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const quotesData: QuoteData[] = recentQuotes.map((quote: any) => ({
    id: quote._id.toString(),
    customerName: quote.customerName,
    companyName: quote.companyName || "N/A",
    quantity: quote.quantity,
    status: quote.status,
    createdAt: quote.createdAt.toISOString(),
  }));

  return (
    <DashboardContent
      stats={{
        totalOrders,
        totalRevenue,
        totalQuotes,
        totalProducts,
      }}
      ordersData={ordersData}
      quotesData={quotesData}
    />
  );
}
