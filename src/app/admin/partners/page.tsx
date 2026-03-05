"use client";

import { useState, useEffect } from "react";
import type { DragEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  ExternalLink,
  Pencil,
  Trash2,
  GripVertical,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [draggedPartnerId, setDraggedPartnerId] = useState<string | null>(null);
  const [dragOverPartnerId, setDragOverPartnerId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partners");
      const data = await res.json();
      const orderedPartners = [...(data.partners || [])].sort(
        (a: Partner, b: Partner) => a.orderNumber - b.orderNumber,
      );
      setPartners(orderedPartners);
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

  const persistOrder = async (orderedPartners: Partner[]) => {
    try {
      setIsSavingOrder(true);

      await Promise.all(
        orderedPartners.map(async (partner, index) => {
          const response = await fetch(`/api/partners/${partner._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: index }),
          });

          if (!response.ok) {
            throw new Error("Failed to persist partner order");
          }
        }),
      );
    } catch (error) {
      console.error("Error persisting partners order:", error);
      alert("Failed to save partner order");
      fetchPartners();
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDrop = (targetPartnerId: string) => {
    if (!draggedPartnerId || draggedPartnerId === targetPartnerId) {
      setDraggedPartnerId(null);
      setDragOverPartnerId(null);
      return;
    }

    const sourceIndex = partners.findIndex((p) => p._id === draggedPartnerId);
    const targetIndex = partners.findIndex((p) => p._id === targetPartnerId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedPartnerId(null);
      setDragOverPartnerId(null);
      return;
    }

    const reorderedPartners = [...partners];
    const [movedPartner] = reorderedPartners.splice(sourceIndex, 1);
    reorderedPartners.splice(targetIndex, 0, movedPartner);

    const normalizedPartners = reorderedPartners.map((partner, index) => ({
      ...partner,
      orderNumber: index,
    }));

    setPartners(normalizedPartners);
    setDraggedPartnerId(null);
    setDragOverPartnerId(null);
    persistOrder(normalizedPartners);
  };

  const handleDragStart = (
    e: DragEvent<HTMLTableRowElement>,
    partnerId: string,
  ) => {
    if (searchQuery) return;
    setDraggedPartnerId(partnerId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", partnerId);
  };

  const handleRowDrop = (
    e: DragEvent<HTMLTableRowElement>,
    targetPartnerId: string,
  ) => {
    if (searchQuery) return;
    e.preventDefault();
    e.stopPropagation();

    const sourcePartnerId =
      draggedPartnerId || e.dataTransfer.getData("text/plain");
    if (!sourcePartnerId) return;

    setDraggedPartnerId(sourcePartnerId);
    handleDrop(targetPartnerId);
  };

  const filteredPartners = searchQuery
    ? partners.filter((partner) => {
        const query = searchQuery.toLowerCase();
        return (
          partner.name.toLowerCase().includes(query) ||
          partner.slug.toLowerCase().includes(query) ||
          (partner.website || "").toLowerCase().includes(query)
        );
      })
    : partners;

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

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partners..."
            className="pl-10"
          />
        </div>
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Drag rows to reorder • Auto-save on drop
        </p>
      </div>

      {isSavingOrder && (
        <p className="text-sm text-muted-foreground">Saving partner order...</p>
      )}

      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Reordering is disabled while searching. Clear search to drag partners.
        </p>
      )}

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-gray-500"
                >
                  No partners found
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => (
                <TableRow
                  key={partner._id}
                  draggable={!searchQuery}
                  onDragStart={(e) => handleDragStart(e, partner._id)}
                  onDragOver={(e) => {
                    if (!searchQuery) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverPartnerId !== partner._id) {
                        setDragOverPartnerId(partner._id);
                      }
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverPartnerId === partner._id) {
                      setDragOverPartnerId(null);
                    }
                  }}
                  onDrop={(e) => handleRowDrop(e, partner._id)}
                  onDragEnd={() => {
                    setDraggedPartnerId(null);
                    setDragOverPartnerId(null);
                  }}
                  className={`${!searchQuery ? "cursor-grab" : ""} ${
                    draggedPartnerId === partner._id ? "opacity-60" : ""
                  } ${
                    dragOverPartnerId === partner._id
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    {partner.logo ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={partner.logo}
                          alt="Partner logo"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{partner.orderNumber}</TableCell>
                  <TableCell>
                    {partner.isActive ? (
                      <Badge variant="default" className="bg-green-500">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/partners/${partner._id}/edit`)
                        }
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
