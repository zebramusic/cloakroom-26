"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Partner {
  _id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  orderNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPartners(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (value: string | null) =>
        value ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={value}
              alt="Partner logo"
              fill
              className="object-contain p-1"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            No logo
          </div>
        ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "website",
      label: "Website",
      render: (value: string | null) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "orderNumber",
      label: "Order Number",
      sortable: true,
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) =>
        value ? (
          <Badge variant="default" className="bg-green-500">
            Published
          </Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, partner: Partner) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/partners/${partner._id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(partner._id)}
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
          <h1 className="text-3xl font-bold">Partners</h1>
          <p className="text-gray-600 mt-1">
            Manage your business partners and client logos
          </p>
        </div>
        <Button onClick={() => router.push("/admin/partners/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Partners Table */}
      <DataTable
        columns={columns}
        data={partners}
        searchPlaceholder="Search partners..."
      />
    </div>
  );
}
