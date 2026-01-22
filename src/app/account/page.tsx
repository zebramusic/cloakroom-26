import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomerNav from "@/components/customer/CustomerNav";

export default async function CustomerDashboardPage() {
  const session = await auth();

  if (!session || session.user.principalType !== "customer") {
    redirect("/account/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav userName={session.user.name || "Customer"} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*... rest remains*/}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session?.user.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your orders, messages, and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View your order history and track shipments
              </p>
              <Link href="/account/orders">
                <Button variant="outline" className="w-full">
                  View Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chat with support about your orders
              </p>
              <Link href="/account/messages">
                <Button variant="outline" className="w-full">
                  View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Update your account information and addresses
              </p>
              <Link href="/account/profile">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/ro/shop">
                <Button className="w-full">Browse Products</Button>
              </Link>
              <Link href="/ro/cere-oferta">
                <Button variant="outline" className="w-full">
                  Request Quote
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
