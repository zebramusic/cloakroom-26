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

  if (!session?.user || session.user.principalType !== "admin") {
    redirect("/admin/login");
  }

  // Lazy-load database operations
  const connectDB = (await import("@/lib/mongodb")).default;
  const { Order, Quote, Product } = await import("@/lib/models");

  await connectDB();

  // Calculate date ranges for comparison
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Fetch stats
  const totalOrders = await Order.countDocuments();
  const totalQuotes = await Quote.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Calculate last month's orders for trend
  const lastMonthOrders = await Order.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });
  const thisMonthOrders = await Order.countDocuments({
    createdAt: { $gte: startOfThisMonth },
  });
  const ordersTrend = lastMonthOrders > 0 
    ? Math.round(((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)
    : thisMonthOrders > 0 ? 100 : 0;

  // Calculate total revenue
  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Calculate last month's revenue for trend
  const lastMonthRevenueData = await Order.aggregate([
    { 
      $match: { 
        paymentStatus: "paid",
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      } 
    },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const lastMonthRevenue = lastMonthRevenueData[0]?.total || 0;
  
  const thisMonthRevenueData = await Order.aggregate([
    { 
      $match: { 
        paymentStatus: "paid",
        createdAt: { $gte: startOfThisMonth }
      } 
    },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  const thisMonthRevenue = thisMonthRevenueData[0]?.total || 0;
  const revenueTrend = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : thisMonthRevenue > 0 ? 100 : 0;

  // Calculate last month's quotes for trend
  const lastMonthQuotes = await Quote.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });
  const thisMonthQuotes = await Quote.countDocuments({
    createdAt: { $gte: startOfThisMonth },
  });
  const quotesTrend = lastMonthQuotes > 0
    ? Math.round(((thisMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100)
    : thisMonthQuotes > 0 ? 100 : 0;

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
        ordersTrend,
        revenueTrend,
        quotesTrend,
      }}
      ordersData={ordersData}
      quotesData={quotesData}
    />
  );
}
