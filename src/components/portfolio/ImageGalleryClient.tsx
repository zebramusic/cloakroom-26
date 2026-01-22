"use client";

import { useState } from "react";
import Image from "next/image";
import { MagnifierModal } from "./MagnifierModal";

interface ImageGalleryClientProps {
  images: any[];
  itemTitle: string;
  itemSlug: string;
  itemMeta?: any;
  locale: string;
}

export function ImageGalleryClient({
  images,
  itemTitle,
  itemSlug,
  itemMeta,
  locale,
}: ImageGalleryClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image._id}
            onClick={() => handleImageClick(index)}
            className="relative aspect-square overflow-hidden rounded-lg bg-muted hover:opacity-90 transition-opacity group"
          >
            <Image
              src={image.variants.thumbUrl}
              alt={
                locale === "en" && image.altText.en
                  ? image.altText.en
                  : image.altText.ro
              }
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                {locale === "ro" ? "Deschide" : "Open"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <MagnifierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        initialIndex={selectedIndex}
        itemTitle={itemTitle}
        itemSlug={itemSlug}
        itemMeta={itemMeta}
        locale={locale}
      />
    </>
  );
}
