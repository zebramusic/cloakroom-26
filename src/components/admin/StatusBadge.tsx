import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export type StatusType = "quote" | "order-payment" | "order-delivery";

interface StatusConfig {
  label: string;
  color: string;
}

const statusConfigs: Record<StatusType, Record<string, StatusConfig>> = {
  quote: {
    new: { label: "New", color: "bg-blue-100 text-blue-700 border-blue-200" },
    contacted: {
      label: "Contacted",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    quoted: {
      label: "Quoted",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    won: {
      label: "Won",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    lost: { label: "Lost", color: "bg-red-100 text-red-700 border-red-200" },
    expired: {
      label: "Expired",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
  },
  "order-payment": {
    paid: {
      label: "Paid",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    failed: {
      label: "Failed",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  },
  "order-delivery": {
    pending: {
      label: "Pending",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    processing: {
      label: "Processing",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    shipped: {
      label: "Shipped",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  },
};

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const config = statusConfigs[type]?.[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", config.color, className)}
    >
      {config.label}
    </Badge>
  );
}
