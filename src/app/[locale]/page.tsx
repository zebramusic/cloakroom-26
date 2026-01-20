import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { QuoteCTA } from "@/components/sections/QuoteCTA";
import { Box, Zap, Shield, Users, Building2, PartyPopper } from "lucide-react";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("home");

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
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primaryCTA={{
          label: t("hero.cta"),
          href: `/${locale}/cere-oferta`,
        }}
        secondaryCTA={{
          label: t("hero.ctaSecondary"),
          href: `/${locale}/shop`,
        }}
        variant="home"
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
    </>
  );
}
