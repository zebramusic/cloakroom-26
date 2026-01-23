"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import { hasPermission } from "@/lib/auth/permissions";
import type { Role } from "@/lib/auth/permissions";

interface PortfolioDataTableProps {
  userRole?: string;
}

export function PortfolioDataTable({ userRole }: PortfolioDataTableProps) {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const role = userRole as Role | undefined;
  const canUpdate = role ? hasPermission(role, "portfolio.update") : false;
  const canDelete = role ? hasPermission(role, "portfolio.delete") : false;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (search) {
        params.append("search", search);
      }

      const url = `/api/admin/portfolio?${params}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        const errorMessage =
          data.error || `Error ${res.status}: ${res.statusText}`;
        console.error("API Error:", errorMessage);
        alert(`Failed to load portfolio items: ${errorMessage}`);
        setItems([]);
        return;
      }

      // Filter out any undefined or invalid items
      const validItems = (data.items || []).filter(
        (item: any) => item && typeof item === "object",
      );
      setItems(validItems);
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
      alert(
        `Failed to load portfolio items: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this portfolio item? All images will also be deleted.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        fetchItems();
      } else {
        const errorMessage =
          data.error || `Error ${res.status}: ${res.statusText}`;
        console.error("Delete error:", errorMessage);
        alert(`Failed to delete item: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert(
        `Failed to delete item: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (_value: any, item: any) => {
        if (!item || !item.localeContent?.ro) {
          return <div className="font-medium text-gray-400">-</div>;
        }
        return (
          <div>
            <div className="font-medium">
              {item.localeContent.ro.title || "Untitled"}
            </div>
            {item.localeContent?.en?.title && (
              <div className="text-sm text-muted-foreground">
                {item.localeContent.en.title}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "eventType",
      label: "Type",
      render: (_value: any, item: any) => item?.eventMeta?.eventType || "-",
    },
    {
      key: "location",
      label: "Location",
      render: (_value: any, item: any) => item?.eventMeta?.location || "-",
    },
    {
      key: "date",
      label: "Date",
      render: (_value: any, item: any) =>
        item?.eventMeta?.startsAt
          ? new Date(item.eventMeta.startsAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      key: "status",
      label: "Status",
      render: (_value: any, item: any) => {
        if (!item) return <div>-</div>;
        return (
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={
                item.isPublished
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
            >
              {item.isPublished ? "Published" : "Draft"}
            </Badge>
            {item.isFeatured && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Featured
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: any, item: any) => {
        if (!item || !item._id || !item.slug) return <div>-</div>;
        return (
          <div className="flex gap-2">
            <Link href={`/ro/portfolio/${item.slug}`} target="_blank">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {canUpdate && (
              <Link href={`/admin/portfolio/${item._id}`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item._id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search portfolio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchItems()}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchItems}>Search</Button>
      </div>

      {loading ? (
        <div className="rounded-lg border bg-white py-12 text-center text-sm text-muted-foreground">
          Loading portfolio items...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          emptyMessage="No portfolio items found"
        />
      )}
    </div>
  );
}
