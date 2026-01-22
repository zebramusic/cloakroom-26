"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit } from "lucide-react";

interface PageListProps {
  canWrite: boolean;
  canPublish: boolean;
}

const PAGE_KEYS = [
  { key: "home", label: "Home Page", slug: "/" },
  { key: "services", label: "Services", slug: "/servicii" },
  { key: "about", label: "About", slug: "/despre" },
  { key: "contact", label: "Contact", slug: "/contact" },
];

export function PageList({ canWrite, canPublish }: PageListProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/site/pages");
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPageStatus = (key: string) => {
    const published = pages.find(
      (p) => p.key === key && p.status === "published",
    );
    const draft = pages.find((p) => p.key === key && p.status === "draft");

    if (published && draft) {
      return { status: "Has draft", variant: "secondary" as const };
    } else if (published) {
      return { status: "Published", variant: "default" as const };
    } else if (draft) {
      return { status: "Draft only", variant: "outline" as const };
    }
    return { status: "Not created", variant: "outline" as const };
  };

  if (loading) {
    return <div className="text-center py-12">Loading pages...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PAGE_KEYS.map((pageInfo) => {
        const statusInfo = getPageStatus(pageInfo.key);

        return (
          <Card key={pageInfo.key} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{pageInfo.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {pageInfo.slug}
                </p>
                <Badge variant={statusInfo.variant}>{statusInfo.status}</Badge>
              </div>
              <Link href={`/admin/site/pages/${pageInfo.key}`}>
                <Button size="sm" disabled={!canWrite}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
