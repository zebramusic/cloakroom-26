"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/lib/store/cart.store";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name_ro: string;
    name_en: string;
    sku: string;
    base_price: number;
    description_ro?: string;
    description_en?: string;
    is_active: boolean;
    is_featured: boolean;
    images?: { url: string }[];
  };
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const name = locale === "ro" ? product.name_ro : product.name_en;
  const description =
    locale === "ro" ? product.description_ro : product.description_en;
  const imageUrl = product.images?.[0]?.url || "/placeholder-product.jpg";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addItem({
      product_id: product.id,
      variant_id: null,
      name,
      variant_name: null,
      image_url: imageUrl,
      sku: product.sku,
      price: product.base_price,
      tax_rate: product.tax_rate || 0.21, // Use product's tax rate
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/${locale}/shop/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.is_featured && (
            <div className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {locale === "ro" ? "Popular" : "Featured"}
            </div>
          )}
        </div>
      </Link>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">
          <Link
            href={`/${locale}/shop/${product.slug}`}
            className="hover:text-primary"
          >
            {name}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          SKU: {product.sku}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">
            {formatPrice(product.base_price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {locale === "ro" ? "+ TVA" : "+ VAT"}
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.is_active || isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding
            ? locale === "ro"
              ? "Adăugat!"
              : "Added!"
            : locale === "ro"
              ? "Adaugă"
              : "Add"}
        </Button>
      </CardFooter>
    </Card>
  );
}
