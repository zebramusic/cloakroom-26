import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroBlockProps {
  data: {
    headline: string;
    subheadline?: string;
    primaryCta?: {
      text: string;
      href: string;
      variant?: string;
    };
    secondaryCta?: {
      text: string;
      href: string;
      variant?: string;
    };
    backgroundImage?: string;
    alignment?: "left" | "center" | "right";
  };
  locale: string;
}

export function HeroBlock({ data, locale }: HeroBlockProps) {
  const alignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[data.alignment || "center"];

  return (
    <section
      className="relative py-20 px-4"
      style={
        data.backgroundImage
          ? {
              backgroundImage: `url(${data.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {data.backgroundImage && <div className="absolute inset-0 bg-black/50" />}

      <div
        className={`container mx-auto relative z-10 flex flex-col ${alignmentClass} gap-6 max-w-4xl`}
      >
        <h1
          className={`text-4xl md:text-6xl font-bold ${data.backgroundImage ? "text-white" : ""}`}
        >
          {data.headline}
        </h1>

        {data.subheadline && (
          <p
            className={`text-xl md:text-2xl ${data.backgroundImage ? "text-white/90" : "text-muted-foreground"} max-w-2xl`}
          >
            {data.subheadline}
          </p>
        )}

        {(data.primaryCta || data.secondaryCta) && (
          <div className="flex gap-4 mt-4">
            {data.primaryCta && (
              <Link href={data.primaryCta.href}>
                <Button
                  size="lg"
                  variant={(data.primaryCta.variant as any) || "default"}
                >
                  {data.primaryCta.text}
                </Button>
              </Link>
            )}
            {data.secondaryCta && (
              <Link href={data.secondaryCta.href}>
                <Button
                  size="lg"
                  variant={(data.secondaryCta.variant as any) || "outline"}
                >
                  {data.secondaryCta.text}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
