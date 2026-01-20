import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HeroProps {
  title: string;
  subtitle?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  variant?: "home" | "page";
  children?: ReactNode;
}

export function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  variant = "home",
  children,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10",
        variant === "home" ? "min-h-[80vh] py-20" : "py-16",
      )}
    >
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex flex-col items-center text-center",
            variant === "home" ? "justify-center min-h-[60vh]" : "",
          )}
        >
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
              {subtitle}
            </p>
          )}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col gap-4 sm:flex-row">
              {primaryCTA && (
                <Link href={primaryCTA.href}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {primaryCTA.label}
                  </Button>
                </Link>
              )}
              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {secondaryCTA.label}
                  </Button>
                </Link>
              )}
            </div>
          )}
          {children && <div className="mt-12 w-full">{children}</div>}
        </div>
      </div>
    </section>
  );
}
