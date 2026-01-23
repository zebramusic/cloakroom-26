"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { ImageZoomViewer } from "./ImageZoomViewer";
import Link from "next/link";
import Image from "next/image";

interface PortfolioImage {
  _id: string;
  variants: {
    thumbUrl: string;
    mediumUrl: string;
    originalUrl: string;
  };
  width?: number;
  height?: number;
  altText: {
    ro: string;
    en: string;
  };
  caption: {
    ro: string;
    en: string;
  };
}

interface MagnifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PortfolioImage[];
  initialIndex?: number;
  itemTitle: string;
  itemSlug: string;
  itemMeta?: {
    location?: string;
    startsAt?: Date | string;
  };
  locale: string;
}

export function MagnifierModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  itemTitle,
  itemSlug,
  itemMeta,
  locale,
}: MagnifierModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, handlePrevious, handleNext, onClose]);

  // Prefetch next/prev images
  useEffect(() => {
    if (hasMultiple && currentIndex < images.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = images[currentIndex + 1].variants.mediumUrl;
    }
    if (hasMultiple && currentIndex > 0) {
      const prevImg = new window.Image();
      prevImg.src = images[currentIndex - 1].variants.mediumUrl;
    }
  }, [currentIndex, hasMultiple, images]);

  if (!currentImage) return null;

  const altText =
    locale === "en" && currentImage.altText.en
      ? currentImage.altText.en
      : currentImage.altText.ro;

  const caption =
    locale === "en" && currentImage.caption.en
      ? currentImage.caption.en
      : currentImage.caption.ro;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{itemTitle}</DialogTitle>
              {itemMeta && (
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  {itemMeta.location && <span>{itemMeta.location}</span>}
                  {itemMeta.startsAt && (
                    <span>
                      {new Date(itemMeta.startsAt).toLocaleDateString(
                        locale === "ro" ? "ro-RO" : "en-US",
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Link href={`/${locale}/portfolio/${itemSlug}`} target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {locale === "ro" ? "Vezi detalii" : "View details"}
              </Button>
            </Link>
          </div>
        </DialogHeader>

        <div className="flex-1 px-6 py-4 overflow-hidden">
          <ImageZoomViewer
            src={currentImage.variants.mediumUrl}
            alt={altText}
            width={currentImage.width || 1200}
            height={currentImage.height || 800}
          />

          {caption && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              {caption}
            </p>
          )}
        </div>

        {/* Thumbnails Strip */}
        {hasMultiple && (
          <div className="px-6 py-4 border-t">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image._id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                    index === currentIndex
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image.variants.thumbUrl}
                    alt={
                      locale === "en" && image.altText.en
                        ? image.altText.en
                        : image.altText.ro
                    }
                    width={80}
                    height={60}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <Button
              onClick={handlePrevious}
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={handleNext}
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {hasMultiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
