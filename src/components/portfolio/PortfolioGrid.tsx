"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PortfolioCard } from "./PortfolioCard";
import { MagnifierModal } from "./MagnifierModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface PortfolioGridProps {
  locale: string;
  initialItems?: any[];
}

export function PortfolioGrid({
  locale,
  initialItems = [],
}: PortfolioGridProps) {
  const t = useTranslations("portfolio");
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalImages, setModalImages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  // Extract unique values for filters
  const years = Array.from(
    new Set(
      items
        .filter((item) => item.eventMeta?.startsAt)
        .map((item) => new Date(item.eventMeta.startsAt).getFullYear()),
    ),
  ).sort((a, b) => b - a);

  const eventTypes = Array.from(
    new Set(
      items
        .filter((item) => item.eventMeta?.eventType)
        .map((item) => item.eventMeta.eventType),
    ),
  ).sort();

  const allTags = Array.from(
    new Set(items.flatMap((item) => item.tags || [])),
  ).sort();

  // Filtered items
  const filteredItems = items.filter((item) => {
    const content =
      locale === "en" && item.localeContent.en.title
        ? item.localeContent.en
        : item.localeContent.ro;

    const matchesSearch =
      !search ||
      content.title.toLowerCase().includes(search.toLowerCase()) ||
      content.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesYear =
      yearFilter === "all" ||
      (item.eventMeta?.startsAt &&
        new Date(item.eventMeta.startsAt).getFullYear() ===
          parseInt(yearFilter));

    const matchesType =
      eventTypeFilter === "all" ||
      item.eventMeta?.eventType === eventTypeFilter;

    const matchesTag =
      tagFilter === "all" || (item.tags && item.tags.includes(tagFilter));

    return matchesSearch && matchesYear && matchesType && matchesTag;
  });

  const handleCardClick = async (item: any) => {
    try {
      const res = await fetch(`/api/portfolio/${item.slug}`);
      const data = await res.json();
      setSelectedItem(data.item);
      setModalImages(data.images || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load portfolio details:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("filters.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.year")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filters.eventType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`eventTypes.${type}`, { defaultValue: type })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("tags")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredItems.length} {locale === "ro" ? "evenimente" : "events"}
        {filteredItems.length !== items.length &&
          ` (${items.length} ${locale === "ro" ? "total" : "total"})`}
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard
              key={item._id}
              item={item}
              locale={locale}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("noResults")}</h3>
          <p className="text-muted-foreground">{t("noResultsDesc")}</p>
        </div>
      )}

      {/* Modal */}
      {selectedItem && modalImages.length > 0 && (
        <MagnifierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={modalImages}
          initialIndex={0}
          itemTitle={
            locale === "en" && selectedItem.localeContent.en.title
              ? selectedItem.localeContent.en.title
              : selectedItem.localeContent.ro.title
          }
          itemSlug={selectedItem.slug}
          itemMeta={selectedItem.eventMeta}
          locale={locale}
        />
      )}
    </div>
  );
}
