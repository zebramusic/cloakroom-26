import { unstable_setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/cards/ProductCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { Hero } from "@/components/sections/Hero";

interface SearchParams {
  category?: string;
  price_min?: string;
  price_max?: string;
  sort?: string;
  page?: string;
}

export default async function ShopPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: SearchParams;
}) {
  unstable_setRequestLocale(locale);

  const supabase = await createClient();
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const offset = (page - 1) * limit;

  // Build query
  let query = (supabase.from("products") as any)
    .select("*", { count: "exact" })
    .eq("is_active", true);

  // Apply filters
  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category);
  }

  if (searchParams.price_min) {
    query = query.gte("base_price", parseFloat(searchParams.price_min));
  }

  if (searchParams.price_max) {
    query = query.lte("base_price", parseFloat(searchParams.price_max));
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price_asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("base_price", { ascending: false });
      break;
    case "name_asc":
      query = query.order(locale === "ro" ? "name_ro" : "name_en", {
        ascending: true,
      });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      // Featured first, then newest
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
  }

  const totalPages = count ? Math.ceil(count / limit) : 1;

  // For now, hardcode categories until database schema is updated
  const categories = [
    { id: "racks", name_ro: "Rack-uri", name_en: "Racks" },
    { id: "counters", name_ro: "Ghișee", name_en: "Counters" },
    { id: "barriers", name_ro: "Bariere", name_en: "Barriers" },
    { id: "accessories", name_ro: "Accesorii", name_en: "Accessories" },
  ];

  return (
    <div className="py-8">
      <Hero
        variant="page"
        title={locale === "ro" ? "Magazin" : "Shop"}
        subtitle={
          locale === "ro"
            ? "Echipamente profesionale pentru garderobă și evenimente"
            : "Professional equipment for cloakroom and events"
        }
      />

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
                  key={product.id}
                  product={product}
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
