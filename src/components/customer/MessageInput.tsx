"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Paperclip, Send, X, FileText, Image as ImageIcon } from "lucide-react";

interface Attachment {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface MessageInputProps {
  threadId: string;
  onMessageSent: () => void;
}

export default function MessageInput({
  threadId,
  onMessageSent,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 5) {
      setError("Maximum 5 attachments allowed");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/customer/threads/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        return response.json();
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments((prev) => [...prev, ...uploadedFiles]);
    } catch (err: any) {
      setError(err.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      setError("Message cannot be empty");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const response = await fetch(
        `/api/customer/threads/${threadId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message.trim(),
            attachments,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Clear form
      setMessage("");
      setAttachments([]);
      onMessageSent();
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

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

  return (
    <div className="border-t bg-white p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((att, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 text-sm"
            >
              {getFileIcon(att.mimeType)}
              <span className="max-w-[150px] truncate">{att.filename}</span>
              <span className="text-gray-500">
                ({formatFileSize(att.size)})
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-red-600"
                disabled={isSending}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px] resize-none"
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            disabled={isUploading || isSending || attachments.length >= 5}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isSending || attachments.length >= 5}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Attach File"}
          </Button>
          <span className="ml-2 text-xs text-gray-500">
            {attachments.length}/5 files
          </span>
        </div>

        <Button onClick={handleSendMessage} disabled={isSending || isUploading}>
          <Send className="h-4 w-4 mr-2" />
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Press Enter to send, Shift+Enter for new line. Max 5 files, 5MB each.
      </p>
    </div>
  );
}
