"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export interface ProductVariant {
  id?: string;
  sku: string;
  name_ro: string;
  name_en: string;
  attributes: Record<string, string>;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export default function VariantManager({
  variants,
  onChange,
}: VariantManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductVariant>({
    sku: "",
    name_ro: "",
    name_en: "",
    attributes: {},
    price: 0,
    stock_quantity: 0,
    is_active: true,
  });

  const handleAdd = () => {
    setEditingIndex(null);
    setFormData({
      sku: "",
      name_ro: "",
      name_en: "",
      attributes: {},
      price: 0,
      stock_quantity: 0,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...variants[index] });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Update existing variant
      const updated = [...variants];
      updated[editingIndex] = formData;
      onChange(updated);
    } else {
      // Add new variant
      onChange([...variants, formData]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      const updated = variants.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit Variant" : "Add Variant"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="PROD-VAR-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (RON) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_ro">Name (Romanian) *</Label>
                  <Input
                    id="name_ro"
                    value={formData.name_ro}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ro: e.target.value })
                    }
                    placeholder="Variantă Română"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_en">Name (English) *</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    placeholder="English Variant"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Attributes (Key-Value pairs)</Label>
                <div className="text-sm text-gray-500 mb-2">
                  e.g., Size: Large, Color: Red
                </div>
                {Object.entries(formData.attributes).map(
                  ([key, value], idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const newAttrs = { ...formData.attributes };
                          delete newAttrs[key];
                          newAttrs[e.target.value] = value;
                          setFormData({ ...formData, attributes: newAttrs });
                        }}
                        placeholder="Key"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            attributes: {
                              ...formData.attributes,
                              [key]: e.target.value,
                            },
                          });
                        }}
                        placeholder="Value"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newAttrs = { ...formData.attributes };
                          delete newAttrs[key];
                          setFormData({ ...formData, attributes: newAttrs });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ),
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      attributes: {
                        ...formData.attributes,
                        "": "",
                      },
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Attribute
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Variant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No variants added yet. Click "Add Variant" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {variant.sku}
                  </TableCell>
                  <TableCell>{variant.name_ro}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(variant.attributes).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                          >
                            {key}: {value}
                          </span>
                        ),
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(variant.price)}</TableCell>
                  <TableCell>{variant.stock_quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
