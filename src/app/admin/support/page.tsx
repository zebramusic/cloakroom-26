"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  PackageSearch,
  HelpCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";

interface Thread {
  _id: string;
  type: "order_support" | "general_support";
  customerId: string;
  orderId?: string;
  subject: string;
  status: "open" | "closed";
  lastMessageAt: Date;
  unreadByCustomer: number;
  unreadByAdmin: number;
  assignedTo?: string;
  createdAt: Date;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchThreads();
  }, [statusFilter, typeFilter]);

  const fetchThreads = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/support/threads?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const data = await response.json();
      setThreads(data.threads || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load support threads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchThreads();
  };

  const getThreadIcon = (type: string) => {
    return type === "order_support" ? (
      <PackageSearch className="h-5 w-5" />
    ) : (
      <HelpCircle className="h-5 w-5" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "open" ? (
      <Badge variant="default" className="bg-green-500">
        <Clock className="mr-1 h-3 w-3" />
        Open
      </Badge>
    ) : (
      <Badge variant="secondary">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Closed
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">Loading support threads...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Support</h1>
          <p className="mt-2 text-gray-600">
            Manage customer conversations and support requests
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="order_support">Order Support</SelectItem>
                  <SelectItem value="general_support">
                    General Support
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threads List */}
      {threads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold">No support threads</h3>
            <p className="text-center text-gray-600">
              {searchQuery
                ? "No threads match your search"
                : "No customer support requests yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <Link key={thread._id} href={`/admin/support/${thread._id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getThreadIcon(thread.type)}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {thread.subject}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {thread.type === "order_support"
                            ? "Order Support"
                            : "General Support"}
                          {" · "}
                          {new Date(thread.lastMessageAt).toLocaleDateString(
                            "ro-RO",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {thread.unreadByAdmin > 0 && (
                        <Badge variant="destructive">
                          {thread.unreadByAdmin} new
                        </Badge>
                      )}
                      {getStatusBadge(thread.status)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
