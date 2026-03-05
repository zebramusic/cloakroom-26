"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PortfolioCard } from "./PortfolioCard";
import { ArrowRight } from "lucide-react";

interface PortfolioSectionProps {
  locale: string;
}

export function PortfolioSection({ locale }: PortfolioSectionProps) {
  const t = useTranslations("portfolio");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio?featured=true&limit=6")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load portfolio:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("sectionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => (
              <PortfolioCard
                key={item._id}
                item={item}
                locale={locale}
                href={`/${locale}/portfolio/${item.slug}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${locale}/portfolio`}>
              <Button size="lg" variant="outline">
                {t("viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
