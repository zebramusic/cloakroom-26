"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart.store";

interface OrderSummaryProps {
  locale: string;
}

export function OrderSummary({ locale }: OrderSummaryProps) {
  const subtotal = useCartStore((state) => state.getSubtotal());
  const tax = useCartStore((state) => state.getTax());
  const total = useCartStore((state) => state.getTotal());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ro" ? "Sumar Comandă" : "Order Summary"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {locale === "ro" ? "Subtotal" : "Subtotal"}
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {locale === "ro" ? "TVA" : "VAT"}
          </span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg">
          <span className="font-semibold">
            {locale === "ro" ? "Total" : "Total"}
          </span>
          <span className="font-bold">{formatPrice(total)}</span>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          {locale === "ro"
            ? "Transportul va fi calculat la checkout"
            : "Shipping will be calculated at checkout"}
        </div>
      </CardContent>
    </Card>
  );
}
