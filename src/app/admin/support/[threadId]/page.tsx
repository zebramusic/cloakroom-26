"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import MessageThread from "@/components/customer/MessageThread";
import MessageInput from "@/components/customer/MessageInput";
import {
  ArrowLeft,
  PackageSearch,
  HelpCircle,
  Clock,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building2,
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

interface Customer {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  phone?: string;
}

interface Message {
  _id: string;
  threadId: string;
  senderType: "customer" | "admin";
  senderId: string;
  body: string;
  attachments: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>;
  readAt: Date | null;
  createdAt: Date;
}

export default function AdminConversationPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const router = useRouter();
  const [thread, setThread] = useState<Thread | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchConversation = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/support/threads/${threadId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Conversation not found");
        }
        throw new Error("Failed to load conversation");
      }

      const data = await response.json();
      setThread(data.thread);
      setCustomer(data.customer);
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const handleMessageSent = () => {
    fetchConversation();
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/support/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchConversation();
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/admin/support">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Support
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">Conversation not found</div>
      </div>
    );
  }

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

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-6">
        <Link href="/admin/support">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Support
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Name
                    </div>
                    <div className="mt-1 font-semibold">{customer.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                    <div className="mt-1">
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-primary hover:underline"
                      >
                        {customer.email}
                      </a>
                    </div>
                  </div>
                  {customer.phone && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone
                      </div>
                      <div className="mt-1">
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-primary hover:underline"
                        >
                          {customer.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {customer.companyName && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        Company
                      </div>
                      <div className="mt-1">{customer.companyName}</div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">
                  Customer information not available
                </p>
              )}

              <div className="pt-4 border-t">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Thread Status
                </div>
                <Select
                  value={thread.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-gray-500">
                Created:{" "}
                {new Date(thread.createdAt).toLocaleDateString("ro-RO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getThreadIcon(thread.type)}</div>
                  <div>
                    <CardTitle className="text-2xl">{thread.subject}</CardTitle>
                    <CardDescription className="mt-2">
                      {thread.type === "order_support"
                        ? "Order Support"
                        : "General Support"}
                      {" · "}
                      Started{" "}
                      {new Date(thread.createdAt).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(thread.status)}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="border-t">
                <MessageThread
                  messages={messages}
                  customerName={customer?.name || "Customer"}
                />
              </div>

              {thread.status === "open" && (
                <MessageInput
                  threadId={threadId}
                  onMessageSent={handleMessageSent}
                />
              )}

              {thread.status === "closed" && (
                <div className="border-t bg-gray-50 p-4 text-center text-gray-600">
                  This conversation has been closed. Change status to "Open" to
                  send messages.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
