import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTABlockProps {
  data: {
    headline: string;
    description?: string;
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
    backgroundColor?: string;
  };
  locale: string;
}

export function CTABlock({ data, locale }: CTABlockProps) {
  const bgColorClass =
    {
      gray: "bg-gray-100",
      primary: "bg-primary text-white",
      secondary: "bg-secondary text-white",
    }[data.backgroundColor || "gray"] || "bg-gray-100";

  return (
    <section className={`py-16 px-4 ${bgColorClass}`}>
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>

        {data.description && (
          <p
            className={`text-lg mb-8 ${data.backgroundColor === "primary" || data.backgroundColor === "secondary" ? "text-white/90" : "text-muted-foreground"}`}
          >
            {data.description}
          </p>
        )}

        {(data.primaryCta || data.secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
