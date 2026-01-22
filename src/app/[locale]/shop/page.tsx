import { unstable_setRequestLocale } from "next-intl/server";
import connectDB from "@/lib/mongodb";
import { Product, Category } from "@/lib/models";
import { ProductCard } from "@/components/cards/ProductCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";

interface SearchParams {
  category?: string;
  price_min?: string;
  price_max?: string;
  sort?: string;
  page?: string;
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const awaitedSearchParams = await searchParams;

  await connectDB();

  // Fetch Site Builder blocks for hero section
  const { SitePage } = await import("@/lib/models");
  const { BlockRenderer } = await import("@/components/site/BlockRenderer");
  const sitePage = await SitePage.findOne({
    slug: "shop",
    status: "published",
  }).lean();

  const page = parseInt(awaitedSearchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = { isActive: true };

  if (awaitedSearchParams.category) {
    filter.categoryId = awaitedSearchParams.category;
  }

  if (awaitedSearchParams.price_min) {
    filter.basePrice = {
      ...filter.basePrice,
      $gte: parseFloat(awaitedSearchParams.price_min),
    };
  }

  if (awaitedSearchParams.price_max) {
    filter.basePrice = {
      ...filter.basePrice,
      $lte: parseFloat(awaitedSearchParams.price_max),
    };
  }

  // Build sort
  let sort: any = {};
  switch (awaitedSearchParams.sort) {
    case "price_asc":
      sort = { basePrice: 1 };
      break;
    case "price_desc":
      sort = { basePrice: -1 };
      break;
    case "name_asc":
      sort = locale === "ro" ? { nameRo: 1 } : { nameEn: 1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    default:
      // Featured first, then newest
      sort = { isFeatured: -1, createdAt: -1 };
  }

  let products: any[] = [];
  let count = 0;

  try {
    [products, count] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    // Map MongoDB fields to expected format
    products = products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      name_ro: p.name || p.nameRo || p.name_ro || "",
      name_en: p.name || p.nameEn || p.name_en || "",
      base_price: p.basePrice || p.base_price || 0,
      tax_rate: p.taxRate || p.tax_rate || 0.21, // Default to 21% if not set
      description_ro:
        p.description || p.descriptionRo || p.description_ro || "",
      description_en:
        p.description || p.descriptionEn || p.description_en || "",
      is_active: p.isActive ?? p.is_active ?? true,
      is_featured: p.isFeatured ?? p.is_featured ?? false,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const totalPages = Math.ceil(count / limit) || 1;

  // Fetch categories
  let categories: any[] = [];
  try {
    categories = await Category.find({ isActive: true })
      .select("name nameRo nameEn slug")
      .lean();

    // Map MongoDB fields to expected format - serialize to plain objects
    categories = categories.map((c: any) => ({
      id: c._id.toString(),
      name_ro: c.nameRo || c.name_ro || c.name || "",
      name_en: c.nameEn || c.name_en || c.name || "",
      slug: c.slug || "",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback to hardcoded categories
    categories = [
      { id: "racks", name_ro: "Rack-uri", name_en: "Racks" },
      { id: "counters", name_ro: "Ghișee", name_en: "Counters" },
      { id: "barriers", name_ro: "Bariere", name_en: "Barriers" },
      { id: "accessories", name_ro: "Accesorii", name_en: "Accessories" },
    ];
  }

  return (
    <div className="py-8">
      {/* Site Builder Hero Block */}
      {sitePage && <BlockRenderer blocks={sitePage.blocks} locale={locale} />}

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <FilterBar locale={locale} categories={categories} />
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {locale === "ro"
                ? `${count} produse găsite`
                : `${count} products found`}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any) => (
                <ProductCard
                  key={product._id.toString()}
                  product={{
                    ...product,
                    id: product._id.toString(),
                  }}
                  locale={locale}
                />
              ))}
            </div>

            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                locale={locale}
              />
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              {locale === "ro" ? "Nu s-au găsit produse" : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
