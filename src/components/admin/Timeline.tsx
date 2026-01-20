import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type?: "success" | "info" | "warning" | "error";
  user?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <Circle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Circle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getLineColor = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-green-200";
      case "error":
        return "bg-red-200";
      case "warning":
        return "bg-orange-200";
      default:
        return "bg-blue-200";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Icon and Line */}
          <div className="flex flex-col items-center">
            <div className="flex-shrink-0">{getIcon(event.type)}</div>
            {index < events.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-full min-h-[40px] mt-2",
                  getLineColor(event.type),
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {event.description}
                  </p>
                )}
                {event.user && (
                  <p className="text-xs text-gray-500 mt-1">by {event.user}</p>
                )}
              </div>
              <time className="text-sm text-gray-500 flex-shrink-0">
                {formatDate(event.timestamp, "ro")}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
