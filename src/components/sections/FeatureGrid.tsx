import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "icon-top" | "icon-left";
}

export function FeatureGrid({
  features,
  columns = 3,
  variant = "icon-top",
}: FeatureGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div
                className={cn(
                  "flex gap-4",
                  variant === "icon-top" && "flex-col items-center text-center",
                  variant === "icon-left" && "flex-row items-start",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={cn(variant === "icon-top" && "text-center")}
              >
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
