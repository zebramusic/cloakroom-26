"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
}

export function Pagination({
  currentPage,
  totalPages,
  locale,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show max 5 page numbers

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current and surrounding pages
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1">
          {locale === "ro" ? "Anterior" : "Previous"}
        </span>
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="h-9 w-9"
              onClick={() => goToPage(page as number)}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="mr-1">{locale === "ro" ? "Următor" : "Next"}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
