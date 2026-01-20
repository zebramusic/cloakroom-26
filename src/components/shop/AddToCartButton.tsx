"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart.store";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl: string;
  };
  locale: string;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  locale,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      product_id: product.id,
      variant_id: null,
      name: product.name,
      variant_name: null,
      image_url: product.imageUrl,
      sku: product.sku,
      price: product.price,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isAdding
        ? locale === "ro"
          ? "Adăugat în Coș!"
          : "Added to Cart!"
        : locale === "ro"
          ? "Adaugă în Coș"
          : "Add to Cart"}
    </Button>
  );
}
