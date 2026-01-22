import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import { OrdersList } from "@/components/admin/OrdersList";

export const dynamic = "force-dynamic";

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

export default async function OrdersPage() {
  await connectDB();
  const ordersData = await Order.find().sort({ createdAt: -1 }).lean();

  // Transform MongoDB data to match the display format
  const orders: OrderDisplay[] = ordersData.map((order: any) => ({
    id: order._id.toString(),
    order_number: order.orderNumber,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    total: order.total,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    delivery_status: order.status,
    created_at: order.createdAt.toISOString(),
  }));

  return <OrdersList orders={orders} />;
}
