"use client";

import { useEffect, useRef } from "react";
import { FileText, Image as ImageIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Attachment {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface Message {
  _id: string;
  threadId: string;
  senderType: "customer" | "admin";
  senderId: string;
  body: string;
  attachments: Attachment[];
  readAt: Date | null;
  createdAt: Date;
}

interface MessageThreadProps {
  messages: Message[];
  customerName?: string;
}

export default function MessageThread({
  messages,
  customerName = "You",
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  if (messages.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4 overflow-y-auto p-4"
      style={{ maxHeight: "60vh" }}
    >
      {messages.map((message) => {
        const isCustomer = message.senderType === "customer";
        const senderName = isCustomer ? customerName : "Support Team";

        return (
          <div
            key={message._id}
            className={cn("flex", isCustomer ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg p-3",
                isCustomer
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 text-gray-900",
              )}
            >
              {/* Sender Name & Timestamp */}
              <div className="mb-1 flex items-center justify-between gap-3 text-xs opacity-80">
                <span className="font-semibold">{senderName}</span>
                <span>
                  {new Date(message.createdAt).toLocaleDateString("ro-RO", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Message Body */}
              <div className="whitespace-pre-wrap break-words">
                {message.body}
              </div>

              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.attachments.map((att, index) => (
                    <a
                      key={index}
                      href={att.url}
                      download={att.filename}
                      className={cn(
                        "flex items-center gap-2 rounded border p-2 text-sm hover:bg-opacity-80",
                        isCustomer
                          ? "border-primary-foreground/20 bg-primary-foreground/10"
                          : "border-gray-300 bg-white",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getFileIcon(att.mimeType)}
                      <div className="flex-1 truncate">
                        <div className="truncate font-medium">
                          {att.filename}
                        </div>
                        <div className="text-xs opacity-70">
                          {formatFileSize(att.size)}
                        </div>
                      </div>
                      <Download className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
