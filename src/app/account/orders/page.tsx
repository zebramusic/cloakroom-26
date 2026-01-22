import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models";
import OrderCard from "@/components/customer/OrderCard";
import ClaimOrderDialog from "@/components/customer/ClaimOrderDialog";
import CustomerNav from "@/components/customer/CustomerNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CustomerOrdersPage() {
  const session = await auth();

  if (!session || session.user.principalType !== "customer") {
    redirect("/account/login");
  }

  await connectDB();

  // Fetch customer's orders
  const orders = await Order.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav userName={session.user.name || "Customer"} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">
              View and manage your order history
            </p>
          </div>
          <ClaimOrderDialog />
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>
                You haven&apos;t placed any orders yet or haven&apos;t claimed
                them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                To see your orders here, you can either:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-4">
                <li>Place a new order from our shop</li>
                <li>Claim an existing order using your order number</li>
              </ul>
              <div className="flex gap-4 pt-4">
                <Link href="/ro/shop">
                  <Button>Browse Products</Button>
                </Link>
                <ClaimOrderDialog />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard
                  key={order._id.toString()}
                  order={{
                    _id: order._id.toString(),
                    orderNumber: order.orderNumber,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    total: order.total,
                    items: order.items,
                    createdAt: order.createdAt.toISOString(),
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
