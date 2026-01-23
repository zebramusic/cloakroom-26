"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerNav from "@/components/customer/CustomerNav";
import MessageThread from "@/components/customer/MessageThread";
import MessageInput from "@/components/customer/MessageInput";
import {
  ArrowLeft,
  PackageSearch,
  HelpCircle,
  Clock,
  CheckCircle2,
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
  createdAt: Date;
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

export default function ConversationPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account/login");
    } else if (
      status === "authenticated" &&
      session?.user.principalType !== "customer"
    ) {
      router.push("/account/login");
    }
  }, [status, session, router]);

  const fetchConversation = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/customer/threads/${threadId}/messages`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Conversation not found");
        }
        throw new Error("Failed to load conversation");
      }

      const data = await response.json();
      setThread(data.thread);
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user.principalType === "customer"
    ) {
      fetchConversation();
    }
  }, [status, session, fetchConversation]);

  const handleMessageSent = () => {
    fetchConversation();
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNav userName={session?.user?.name || "User"} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading conversation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNav userName={session?.user?.name || "User"} />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/account/messages">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Messages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNav userName={session?.user?.name || "User"} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Conversation not found</div>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      <CustomerNav userName={session?.user?.name || "User"} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/account/messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>

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
                customerName={session?.user?.name || "You"}
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
                This conversation has been closed. It will reopen when you send
                a new message.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
