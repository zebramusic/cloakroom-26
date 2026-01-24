import { getTranslations } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  // Fetch portfolio items
  let items = [];
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || "http://localhost:3000";
    
    const res = await fetch(
      `${baseUrl}/api/portfolio?limit=100`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.status}`);
    }

    const data = await res.json();
    items = data.items || [];
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    // Continue with empty items array
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("pageTitle")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("pageSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="container">
          <PortfolioGrid locale={locale} initialItems={items} />
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });

  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}
