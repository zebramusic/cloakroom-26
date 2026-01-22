"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PortfolioCardProps {
  item: {
    _id: string;
    slug: string;
    localeContent: {
      ro: { title: string; excerpt: string };
      en: { title: string; excerpt: string };
    };
    eventMeta?: {
      location?: string;
      startsAt?: Date | string;
    };
    tags: string[];
    coverImage?: {
      variants: {
        thumbUrl: string;
      };
      altText: {
        ro: string;
        en: string;
      };
    };
  };
  locale: string;
  onClick?: () => void;
}

export function PortfolioCard({ item, locale, onClick }: PortfolioCardProps) {
  const [imageError, setImageError] = useState(false);

  const content =
    locale === "en" && item.localeContent.en.title
      ? item.localeContent.en
      : item.localeContent.ro;

  const altText = item.coverImage
    ? locale === "en" && item.coverImage.altText.en
      ? item.coverImage.altText.en
      : item.coverImage.altText.ro
    : content.title;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.coverImage && !imageError ? (
          <Image
            src={item.coverImage.variants.thumbUrl}
            alt={altText}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-4xl">📷</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {content.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {content.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {item.eventMeta?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{item.eventMeta.location}</span>
            </div>
          )}
          {item.eventMeta?.startsAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(item.eventMeta.startsAt).toLocaleDateString(
                  locale === "ro" ? "ro-RO" : "en-US",
                )}
              </span>
            </div>
          )}
        </div>

        {item.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-xs bg-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
