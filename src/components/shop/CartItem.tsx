"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore, type CartItem } from "@/lib/store/cart.store";

interface CartItemProps {
  item: CartItem;
  locale: string;
}

export function CartItemComponent({ item, locale }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemId = item.variant_id
    ? `variant:${item.variant_id}`
    : `product:${item.product_id}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-US", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 999) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(itemId);
  };

  return (
    <div className="flex gap-4 rounded-lg border p-4">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-neutral-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          {item.variant_name && (
            <p className="text-sm text-muted-foreground">{item.variant_name}</p>
          )}
          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            min="1"
            max="999"
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="h-8 w-16 text-center"
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= 999}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="ml-2 h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="font-semibold">
            {formatPrice(item.price * item.quantity)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPrice(item.price)} {locale === "ro" ? "/ buc" : "/ pc"}
          </p>
        </div>
      </div>
    </div>
  );
}
