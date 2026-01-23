import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

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
  backgroundImage?: string;
  children?: ReactNode;
}

export function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  variant = "home",
  backgroundImage,
  children,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        variant === "home" ? "min-h-[80vh] py-20" : "py-16",
        !backgroundImage &&
          "bg-gradient-to-br from-primary/10 via-background to-secondary/10",
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover"
              priority={variant === "home"}
              quality={90}
            />
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4">
        <div
          className={cn(
            "flex flex-col items-center text-center",
            variant === "home" ? "justify-center min-h-[60vh]" : "",
          )}
        >
          <h1
            className={cn(
              "mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
              backgroundImage && "text-white drop-shadow-lg",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mb-8 max-w-2xl text-lg sm:text-xl md:text-2xl",
                backgroundImage
                  ? "text-white/95 drop-shadow-md"
                  : "text-muted-foreground",
              )}
            >
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
