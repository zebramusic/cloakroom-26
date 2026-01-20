"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  locale: string;
  categories?: Array<{ id: string; name_ro: string; name_en: string }>;
}

export function FilterBar({ locale, categories = [] }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 when filtering
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setPriceMin("");
    setPriceMax("");
  };

  const hasActiveFilters =
    searchParams.get("category") ||
    searchParams.get("price_min") ||
    searchParams.get("price_max") ||
    searchParams.get("sort");

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-semibold">
            {locale === "ro" ? "Filtrează" : "Filters"}
          </h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            {locale === "ro" ? "Resetează" : "Clear"}
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <Label htmlFor="category">
              {locale === "ro" ? "Categorie" : "Category"}
            </Label>
            <Select
              value={searchParams.get("category") || "all"}
              onValueChange={(value) =>
                updateFilter("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={locale === "ro" ? "Toate" : "All"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {locale === "ro" ? "Toate categoriile" : "All categories"}
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {locale === "ro" ? cat.name_ro : cat.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range */}
        <div>
          <Label htmlFor="price_min">
            {locale === "ro" ? "Preț minim" : "Min price"}
          </Label>
          <Input
            id="price_min"
            type="number"
            placeholder="0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={(e) => updateFilter("price_min", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="price_max">
            {locale === "ro" ? "Preț maxim" : "Max price"}
          </Label>
          <Input
            id="price_max"
            type="number"
            placeholder="10000"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={(e) => updateFilter("price_max", e.target.value)}
          />
        </div>

        {/* Sort */}
        <div>
          <Label htmlFor="sort">
            {locale === "ro" ? "Sortează după" : "Sort by"}
          </Label>
          <Select
            value={searchParams.get("sort") || "featured"}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">
                {locale === "ro" ? "Recomandate" : "Featured"}
              </SelectItem>
              <SelectItem value="price_asc">
                {locale === "ro" ? "Preț crescător" : "Price: Low to High"}
              </SelectItem>
              <SelectItem value="price_desc">
                {locale === "ro" ? "Preț descrescător" : "Price: High to Low"}
              </SelectItem>
              <SelectItem value="name_asc">
                {locale === "ro" ? "Nume A-Z" : "Name A-Z"}
              </SelectItem>
              <SelectItem value="newest">
                {locale === "ro" ? "Cele mai noi" : "Newest"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
