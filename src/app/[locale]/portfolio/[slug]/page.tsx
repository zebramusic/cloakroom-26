import { getTranslations } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { MagnifierModal } from "@/components/portfolio/MagnifierModal";
import { ImageGalleryClient } from "@/components/portfolio/ImageGalleryClient";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations("portfolio");

  // Fetch portfolio item directly from database
  const connectDB = (await import("@/lib/mongodb")).default;
  const { PortfolioItem, PortfolioImage } = await import("@/lib/models");

  await connectDB();

  const item = await PortfolioItem.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!item) {
    notFound();
  }

  // Serialize item for client components
  const serializedItem: any = {
    ...item,
    _id: (item as any)._id.toString(),
  };

  // Get all images for this item
  const imagesRaw = await PortfolioImage.find({ portfolioItemId: item._id })
    .sort({ orderIndex: 1 })
    .lean();

  // Serialize images for client components
  const images = imagesRaw.map((img: any) => ({
    ...img,
    _id: img._id.toString(),
    portfolioItemId: img.portfolioItemId.toString(),
  }));

  const content =
    locale === "en" && serializedItem.localeContent.en.title
      ? serializedItem.localeContent.en
      : serializedItem.localeContent.ro;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-8 border-b">
        <div className="container">
          <Link href={`/${locale}/portfolio`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToGallery")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Content */}
      <article className="py-16">
        <div className="container max-w-5xl">
          {/* Title & Meta */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {content.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              {serializedItem.eventMeta?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{serializedItem.eventMeta.location}</span>
                </div>
              )}
              {serializedItem.eventMeta?.startsAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(serializedItem.eventMeta.startsAt).toLocaleDateString(
                      locale === "ro" ? "ro-RO" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </span>
                </div>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {serializedItem.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-secondary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {images.length > 0 && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <Image
                src={images[0].variants.mediumUrl}
                alt={
                  locale === "en" && images[0].altText.en
                    ? images[0].altText.en
                    : images[0].altText.ro
                }
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          {/* Excerpt */}
          {content.excerpt && (
            <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {content.excerpt}
            </div>
          )}

          {/* Body */}
          {content.body && (
            <div className="mb-12">
              <MarkdownRenderer content={content.body} />
            </div>
          )}

          {/* Gallery */}
          {images.length > 1 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {t("details.gallery")}
              </h2>
              <ImageGalleryClient
                images={images}
                itemTitle={content.title}
                itemSlug={slug}
                itemMeta={serializedItem.eventMeta}
                locale={locale}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Query database directly instead of HTTP fetch
  const connectDB = (await import("@/lib/mongodb")).default;
  const { PortfolioItem } = await import("@/lib/models");

  await connectDB();

  const item = await PortfolioItem.findOne({
    slug,
    isPublished: true,
  }).lean();

  if (!item) {
    return {
      title: "Not Found",
    };
  }

  const content =
    locale === "en" && item.localeContent.en.title
      ? item.localeContent.en
      : item.localeContent.ro;

  return {
    title: content.title,
    description: content.excerpt,
  };
}
