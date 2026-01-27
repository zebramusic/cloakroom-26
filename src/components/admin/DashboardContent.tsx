"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { DataTable, Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, FileText, Package, DollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

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

interface DashboardContentProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalQuotes: number;
    totalProducts: number;
    ordersTrend?: number;
    revenueTrend?: number;
    quotesTrend?: number;
  };
  ordersData: OrderData[];
  quotesData: QuoteData[];
}

export function DashboardContent({
  stats,
  ordersData,
  quotesData,
}: DashboardContentProps) {
  const orderColumns: Column<OrderData>[] = [
    {
      key: "orderNumber",
      label: "Order #",
      sortable: true,
    },
    {
      key: "customerName",
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
      key: "paymentStatus",
      label: "Payment",
      render: (value) => {
        const colors: Record<string, string> = {
          paid: "bg-green-100 text-green-700 border-green-200",
          pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
          failed: "bg-red-100 text-red-700 border-red-200",
        };
        return (
          <Badge variant="secondary" className={colors[value] || ""}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value, "ro"),
    },
  ];

  const quoteColumns: Column<QuoteData>[] = [
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
    },
    {
      key: "companyName",
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
          new: "bg-blue-100 text-blue-700 border-blue-200",
          reviewed: "bg-yellow-100 text-yellow-700 border-yellow-200",
          approved: "bg-green-100 text-green-700 border-green-200",
          rejected: "bg-red-100 text-red-700 border-red-200",
        };
        return (
          <Badge variant="secondary" className={colors[value] || ""}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value, "ro"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            iconColor="purple"
            trend={
              stats.totalOrders > 0 && stats.ordersTrend !== undefined
                ? {
                    value: stats.ordersTrend,
                    label: "from last month",
                  }
                : undefined
            }
          />
          <StatsCard
            title="Total Revenue"
            value={`${stats.totalRevenue.toLocaleString()} RON`}
            icon={DollarSign}
            iconColor="green"
            trend={
              stats.totalRevenue > 0 && stats.revenueTrend !== undefined
                ? {
                    value: stats.revenueTrend,
                    label: "from last month",
                  }
                : undefined
            }
          />
          <StatsCard
            title="Quote Requests"
            value={stats.totalQuotes}
            icon={FileText}
            iconColor="blue"
            trend={
              stats.totalQuotes > 0 && stats.quotesTrend !== undefined
                ? {
                    value: stats.quotesTrend,
                    label: "from last month",
                  }
                : undefined
            }
          />
          <StatsCard
            title="Active Products"
            value={stats.totalProducts}
            icon={Package}
            iconColor="orange"
          />
        </div>

        {/* Recent Orders */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Recent Orders</CardTitle>
                <CardDescription className="text-base">
                  Latest orders from your customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={orderColumns}
              data={ordersData}
              searchable={false}
              emptyMessage="No orders yet"
            />
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Recent Quote Requests
                </CardTitle>
                <CardDescription className="text-base">
                  New inquiries from potential customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={quoteColumns}
              data={quotesData}
              searchable={false}
              emptyMessage="No quotes yet"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
