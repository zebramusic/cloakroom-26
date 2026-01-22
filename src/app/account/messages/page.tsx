"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomerNav from "@/components/customer/CustomerNav";
import {
  MessageSquare,
  Plus,
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

export default function MessagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [error, setError] = useState("");

  // New thread form
  const [newThread, setNewThread] = useState({
    type: "general_support",
    subject: "",
    orderId: "",
    initialMessage: "",
  });

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

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user.principalType === "customer"
    ) {
      fetchThreads();
    }
  }, [status, session]);

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/customer/threads");
      if (!response.ok) throw new Error("Failed to fetch threads");

      const data = await response.json();
      setThreads(data.threads || []);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThread.subject.trim() || !newThread.initialMessage.trim()) {
      setError("Subject and message are required");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/customer/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThread),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create thread");
      }

      const data = await response.json();
      setShowNewThreadDialog(false);
      setNewThread({
        type: "general_support",
        subject: "",
        orderId: "",
        initialMessage: "",
      });
      router.push(`/account/messages/${data.thread._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create conversation");
    } finally {
      setIsCreating(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNav userName={session?.user?.name || "User"} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="mt-2 text-gray-600">
              View and manage your conversations with support
            </p>
          </div>

          <Dialog
            open={showNewThreadDialog}
            onOpenChange={setShowNewThreadDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogDescription>
                  Get help with an order or ask a general question
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Conversation Type</Label>
                  <Select
                    value={newThread.type}
                    onValueChange={(value) =>
                      setNewThread({ ...newThread, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general_support">
                        General Support
                      </SelectItem>
                      <SelectItem value="order_support">
                        Order Support
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newThread.type === "order_support" && (
                  <div>
                    <Label htmlFor="orderId">Order Number (optional)</Label>
                    <Input
                      id="orderId"
                      placeholder="e.g., ORD-2024-001"
                      value={newThread.orderId}
                      onChange={(e) =>
                        setNewThread({ ...newThread, orderId: e.target.value })
                      }
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={newThread.subject}
                    onChange={(e) =>
                      setNewThread({ ...newThread, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail..."
                    className="min-h-[150px]"
                    value={newThread.initialMessage}
                    onChange={(e) =>
                      setNewThread({
                        ...newThread,
                        initialMessage: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewThreadDialog(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateThread} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Start Conversation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {threads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">No messages yet</h3>
              <p className="mb-6 text-center text-gray-600">
                Start a conversation with our support team
              </p>
              <Button onClick={() => setShowNewThreadDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Start Your First Conversation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Link key={thread._id} href={`/account/messages/${thread._id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getThreadIcon(thread.type)}</div>
                        <div>
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
                              },
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {thread.unreadByCustomer > 0 && (
                          <Badge variant="destructive">
                            {thread.unreadByCustomer} new
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
    </div>
  );
}
