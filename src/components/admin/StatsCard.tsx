import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = "purple",
}: StatsCardProps) {
  const iconColorClasses = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.value > 0
                      ? "text-green-600"
                      : trend.value < 0
                        ? "text-red-600"
                        : "text-gray-600",
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-sm text-gray-500">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              iconColorClasses[iconColor as keyof typeof iconColorClasses] ||
                iconColorClasses.purple,
            )}
          >
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
