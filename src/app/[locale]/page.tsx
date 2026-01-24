import { unstable_setRequestLocale } from "next-intl/server";
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import { SitePage } from "@/lib/models/site";
import { BlockRenderer } from "@/components/site/BlockRenderer";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { getHeroSettings } from "@/lib/utils/hero-settings";

// Fallback sections if no site builder content exists
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { getTranslations } from "next-intl/server";
import { Box, Zap, Shield } from "lucide-react";

async function getHomePageContent(locale: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const page = await SitePage.findOne({
        key: "home",
        status: "published",
      })
        .sort({ publishedAt: -1 })
        .lean();

      if (!page) return null;

      const localeData =
        locale === "en" && page.localeData.en
          ? page.localeData.en
          : page.localeData.ro;

      return localeData.blocks || [];
    },
    [`home-${locale}`],
    {
      tags: ["site-pages", "site-page-home"],
      revalidate: 3600,
    },
  )();
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  // Try to get site builder content
  const blocks = await getHomePageContent(locale);

  // If site builder content exists, use it
  if (blocks && blocks.length > 0) {
    return (
      <>
        <BlockRenderer blocks={blocks} locale={locale} />
        <PortfolioSection locale={locale} />
      </>
    );
  }

  // Otherwise, use fallback static content
  const t = await getTranslations("home");

  // Check for custom hero settings
  const heroSettings = await getHeroSettings("home", locale as "ro" | "en");

  const features = [
    {
      icon: Box,
      title: t("features.compact.title"),
      description: t("features.compact.description"),
    },
    {
      icon: Zap,
      title: t("features.speed.title"),
      description: t("features.speed.description"),
    },
    {
      icon: Shield,
      title: t("features.safety.title"),
      description: t("features.safety.description"),
    },
  ];

  return (
    <>
      <Hero
        title={heroSettings?.title || t("hero.title")}
        subtitle={heroSettings?.subtitle || t("hero.subtitle")}
        primaryCTA={
          heroSettings?.primaryCTA || {
            label: t("hero.cta"),
            href: `/${locale}/cere-oferta`,
          }
        }
        secondaryCTA={
          heroSettings?.secondaryCTA || {
            label: t("hero.ctaSecondary"),
            href: `/${locale}/shop`,
          }
        }
        variant="home"
        backgroundImage={heroSettings?.backgroundImage}
      />

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            {t("features.title")}
          </h2>
          <FeatureGrid features={features} columns={3} variant="icon-top" />
        </div>
      </section>

      {/* CTA Section */}
      <QuoteCTA
        variant="full-width"
        heading={locale === "ro" ? "Gata să începem?" : "Ready to Start?"}
        description={
          locale === "ro"
            ? "Cere o ofertă personalizată pentru evenimentul tău. Răspundem în maximum 24 de ore."
            : "Request a personalized quote for your event. We respond within 24 hours."
        }
        ctaLabel={t("hero.cta")}
        ctaHref={`/${locale}/cere-oferta`}
      />

      {/* Portfolio Section */}
      <PortfolioSection locale={locale} />
    </>
  );
}
