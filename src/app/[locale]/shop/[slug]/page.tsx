import { unstable_setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingCart,
  Package,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export default async function ProductDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);

  const supabase = await createClient();

  // Fetch product
  const { data: product, error } = await (supabase.from("products") as any)
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    notFound();
  }

  const name = locale === "ro" ? product.name_ro : product.name_en;
  const description =
    locale === "ro" ? product.description_ro : product.description_en;
  const features = locale === "ro" ? product.features_ro : product.features_en;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-foreground">
            {locale === "ro" ? "Acasă" : "Home"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${locale}/shop`} className="hover:text-foreground">
            {locale === "ro" ? "Magazin" : "Shop"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src="/placeholder-product.jpg"
                alt={name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{name}</h1>
              <p className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {formatPrice(product.base_price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {locale === "ro" ? "+ TVA" : "+ VAT"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {locale === "ro"
                  ? `Preț cu TVA: ${formatPrice(product.base_price * 1.19)}`
                  : `Price with VAT: ${formatPrice(product.base_price * 1.19)}`}
              </p>
            </div>

            <Separator />

            {description && (
              <div>
                <h3 className="mb-2 font-semibold">
                  {locale === "ro" ? "Descriere" : "Description"}
                </h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            )}

            <AddToCartButton
              product={{
                id: product.id,
                name,
                sku: product.sku,
                price: product.base_price,
                imageUrl: "/placeholder-product.jpg",
              }}
              locale={locale}
              disabled={!product.is_active || product.stock_quantity === 0}
            />

            <Separator />

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex gap-3">
                <Package className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {locale === "ro" ? "Stoc" : "Stock"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.stock_quantity > 0
                      ? locale === "ro"
                        ? "Disponibil"
                        : "Available"
                      : locale === "ro"
                        ? "Epuizat"
                        : "Out of stock"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Truck className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {locale === "ro" ? "Livrare" : "Delivery"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ro" ? "2-5 zile" : "2-5 days"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Shield className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {locale === "ro" ? "Garanție" : "Warranty"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ro" ? "24 luni" : "24 months"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">
                {locale === "ro"
                  ? "Descriere Detaliată"
                  : "Detailed Description"}
              </TabsTrigger>
              <TabsTrigger value="features">
                {locale === "ro" ? "Caracteristici" : "Features"}
              </TabsTrigger>
              <TabsTrigger value="specifications">
                {locale === "ro" ? "Specificații" : "Specifications"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="prose max-w-none pt-6 dark:prose-invert">
                  {description || (
                    <p className="text-muted-foreground">
                      {locale === "ro"
                        ? "Descriere indisponibilă"
                        : "Description unavailable"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {features ? (
                    <div
                      className="prose max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: features }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {locale === "ro"
                        ? "Caracteristici indisponibile"
                        : "Features unavailable"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        SKU
                      </dt>
                      <dd className="mt-1 text-sm">{product.sku}</dd>
                    </div>
                    {product.weight_kg && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {locale === "ro" ? "Greutate" : "Weight"}
                        </dt>
                        <dd className="mt-1 text-sm">{product.weight_kg} kg</dd>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {locale === "ro" ? "Dimensiuni" : "Dimensions"}
                        </dt>
                        <dd className="mt-1 text-sm">{product.dimensions}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {locale === "ro" ? "Retur" : "Return"}
                      </dt>
                      <dd className="mt-1 text-sm">
                        {product.is_returnable
                          ? locale === "ro"
                            ? "14 zile"
                            : "14 days"
                          : locale === "ro"
                            ? "Nu se acceptă retur"
                            : "No returns"}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
