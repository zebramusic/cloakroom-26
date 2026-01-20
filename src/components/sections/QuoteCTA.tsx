import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface QuoteCTAProps {
  variant?: "inline" | "full-width" | "sticky";
  heading?: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function QuoteCTA({
  variant = "inline",
  heading,
  description,
  ctaLabel,
  ctaHref,
}: QuoteCTAProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
        variant === "inline" && "py-16",
        variant === "full-width" && "py-20",
        variant === "sticky" &&
          "fixed bottom-0 left-0 right-0 z-40 py-4 shadow-lg lg:hidden",
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4",
          variant === "sticky"
            ? "flex items-center justify-between"
            : "text-center",
        )}
      >
        {variant !== "sticky" && (
          <>
            {heading && (
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
            )}
            {description && (
              <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                {description}
              </p>
            )}
          </>
        )}
        <Link href={ctaHref}>
          <Button
            size={variant === "sticky" ? "default" : "lg"}
            variant="secondary"
            className={cn(
              "font-semibold",
              variant === "sticky" && "w-full sm:w-auto",
            )}
          >
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </section>
  );
}
