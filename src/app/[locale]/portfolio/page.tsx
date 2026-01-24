import { getTranslations } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import connectDB from "@/lib/mongodb";
import { PortfolioItem, PortfolioImage } from "@/lib/models";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  // Fetch portfolio items directly from database
  let items = [];
  try {
    await connectDB();

    const portfolioItems = await PortfolioItem.find({ isPublished: true })
      .sort({ isFeatured: -1, orderIndex: 1, publishedAt: -1 })
      .limit(100)
      .lean();

    // Get cover images for each item and serialize for client component
    items = await Promise.all(
      portfolioItems.map(async (item: any) => {
        let serializedItem = {
          ...item,
          _id: item._id.toString(),
          coverImageId: item.coverImageId?.toString(),
        };

        if (item.coverImageId) {
          const coverImage = await PortfolioImage.findById(item.coverImageId)
            .select("variants altText")
            .lean();

          if (coverImage) {
            serializedItem.coverImage = {
              ...coverImage,
              _id: (coverImage as any)._id.toString(),
            };
          }
        }
        return serializedItem;
      }),
    );
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
