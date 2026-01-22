"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Product {
  id: string;
  name_ro: string;
  name_en: string;
  slug: string;
  sku: string;
  base_price: number;
  stock_quantity: number;
  has_variants: boolean;
  is_active: boolean;
  is_featured: boolean;
  category: {
    id: string;
    name_ro: string;
    name_en: string;
    slug: string;
  } | null;
  created_at: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      // Map MongoDB fields to expected format
      const mappedProducts = (data.products || []).map((p: any) => ({
        ...p,
        id: p._id || p.id,
        base_price: p.basePrice || p.base_price,
        stock_quantity: p.stock || p.stock_quantity,
        is_active: p.isActive ?? p.is_active,
        is_featured: p.isFeatured ?? p.is_featured,
        has_variants: p.variants && p.variants.length > 0,
        name_ro: p.name || p.name_ro,
        name_en: p.name || p.name_en,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  const columns = [
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "name_ro",
      label: "Name",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      render: (value: Product["category"]) =>
        value ? (
          <span className="text-sm">{value.name_ro}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "base_price",
      label: "Price",
      sortable: true,
      render: (value: number) => formatPrice(value),
    },
    {
      key: "stock_quantity",
      label: "Stock",
      sortable: true,
      render: (value: number, product: Product) => (
        <span
          className={
            value === 0
              ? "text-red-600 font-medium"
              : value < 10
                ? "text-orange-600 font-medium"
                : ""
          }
        >
          {value}
          {product.has_variants && (
            <span className="text-gray-400 ml-1">(+variants)</span>
          )}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean, product: Product) => (
        <div className="flex gap-1">
          {value ? (
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          {product.is_featured && (
            <Badge variant="default" className="bg-purple-500">
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, product: Product) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(product.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
      />
    </div>
  );
}
