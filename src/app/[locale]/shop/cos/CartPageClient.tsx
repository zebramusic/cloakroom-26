"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartItemComponent } from "@/components/shop/CartItem";
import { OrderSummary } from "@/components/shop/OrderSummary";
import { Hero } from "@/components/sections/Hero";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store/cart.store";

export function CartPageClient({ locale }: { locale: string }) {
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <div className="py-8">
      <Hero
        variant="page"
        title={locale === "ro" ? "Coșul Meu" : "My Cart"}
        subtitle={
          locale === "ro"
            ? `${itemCount} ${itemCount === 1 ? "produs" : "produse"} în coș`
            : `${itemCount} ${itemCount === 1 ? "item" : "items"} in cart`
        }
      />

      <div className="container mx-auto px-4">
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {locale === "ro" ? "Produse" : "Products"}
                </h2>
                <Link href={`/${locale}/shop`}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {locale === "ro"
                      ? "Continuă cumpărăturile"
                      : "Continue shopping"}
                  </Button>
                </Link>
              </div>

              {items.map((item) => (
                <CartItemComponent
                  key={
                    item.variant_id
                      ? `variant:${item.variant_id}`
                      : `product:${item.product_id}`
                  }
                  item={item}
                  locale={locale}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <OrderSummary locale={locale} />

                <Link href={`/${locale}/shop/comanda`} className="block">
                  <Button size="lg" className="w-full">
                    {locale === "ro"
                      ? "Finalizează Comanda"
                      : "Proceed to Checkout"}
                  </Button>
                </Link>

                <Link href={`/${locale}/shop`} className="block">
                  <Button variant="outline" className="w-full">
                    {locale === "ro"
                      ? "Continuă cumpărăturile"
                      : "Continue shopping"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">
              {locale === "ro" ? "Coșul este gol" : "Your cart is empty"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {locale === "ro"
                ? "Adaugă produse în coș pentru a continua"
                : "Add products to your cart to continue"}
            </p>
            <Link href={`/${locale}/shop`}>
              <Button size="lg">
                {locale === "ro" ? "Explorează Magazinul" : "Browse Shop"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
