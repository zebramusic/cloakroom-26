"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: { url: string; alt?: string }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src="/placeholder-product.jpg"
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={images[selectedIndex]?.url || "/placeholder-product.jpg"}
          alt={
            images[selectedIndex]?.alt ||
            `${productName} - Image ${selectedIndex + 1}`
          }
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-neutral-100 transition-all ${
                selectedIndex === index
                  ? "ring-2 ring-purple-600 ring-offset-2"
                  : "hover:opacity-75"
              }`}
            >
              <Image
                src={img.url || "/placeholder-product.jpg"}
                alt={img.alt || `${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
