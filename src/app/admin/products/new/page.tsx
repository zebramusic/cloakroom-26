"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VariantManager, {
  ProductVariant,
} from "@/components/admin/VariantManager";

interface ProductFormProps {
  productId?: string;
}

interface Category {
  id: string;
  name_ro: string;
  name_en: string;
  slug: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name_ro: "",
    name_en: "",
    slug: "",
    sku: "",
    description_ro: "",
    description_en: "",
    features_ro: "",
    features_en: "",
    base_price: 0,
    tax_rate: 19.0,
    has_variants: false,
    track_inventory: true,
    stock_quantity: 0,
    low_stock_threshold: 5,
    is_active: true,
    is_featured: false,
    is_returnable: true,
    weight_kg: 0,
    dimensions: "",
  });

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (data.product) {
        setFormData({
          category_id: data.product.category_id || "",
          name_ro: data.product.name_ro || "",
          name_en: data.product.name_en || "",
          slug: data.product.slug || "",
          sku: data.product.sku || "",
          description_ro: data.product.description_ro || "",
          description_en: data.product.description_en || "",
          features_ro: data.product.features_ro || "",
          features_en: data.product.features_en || "",
          base_price: data.product.base_price || 0,
          tax_rate: data.product.tax_rate || 19.0,
          has_variants: data.product.has_variants || false,
          track_inventory: data.product.track_inventory ?? true,
          stock_quantity: data.product.stock_quantity || 0,
          low_stock_threshold: data.product.low_stock_threshold || 5,
          is_active: data.product.is_active ?? true,
          is_featured: data.product.is_featured || false,
          is_returnable: data.product.is_returnable ?? true,
          weight_kg: data.product.weight_kg || 0,
          dimensions: data.product.dimensions || "",
        });
        if (data.product.variants) {
          setVariants(data.product.variants);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string, lang: "ro" | "en") => {
    if (lang === "ro") {
      setFormData((prev) => ({
        ...prev,
        name_ro: name,
        slug: !productId ? generateSlug(name) : prev.slug,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name_en: name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PATCH" : "POST";

      const payload = {
        ...formData,
        variants: !productId && formData.has_variants ? variants : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {productId ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-gray-600 mt-1">
              {productId
                ? "Update product information"
                : "Add a new product to catalog"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name_ro">
                          Name (Romanian){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name_ro"
                          value={formData.name_ro}
                          onChange={(e) =>
                            handleNameChange(e.target.value, "ro")
                          }
                          required
                          placeholder="Nume produs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name_en">
                          Name (English) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name_en"
                          value={formData.name_en}
                          onChange={(e) =>
                            handleNameChange(e.target.value, "en")
                          }
                          required
                          placeholder="Product name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">
                        Slug <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        required
                        placeholder="product-slug"
                      />
                      <p className="text-xs text-gray-500">
                        Used in URLs. Use lowercase letters, numbers, and
                        hyphens only.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sku"
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          required
                          placeholder="PROD-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category_id">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name_ro}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="base_price">
                          Base Price (RON){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="base_price"
                          type="number"
                          step="0.01"
                          value={formData.base_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              base_price: parseFloat(e.target.value) || 0,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                        <Input
                          id="tax_rate"
                          type="number"
                          step="0.01"
                          value={formData.tax_rate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tax_rate: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock_quantity">Stock</Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stock_quantity: parseInt(e.target.value) || 0,
                            })
                          }
                          disabled={formData.has_variants}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description_ro">
                        Description (Romanian)
                      </Label>
                      <Textarea
                        id="description_ro"
                        value={formData.description_ro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description_ro: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_en">
                        Description (English)
                      </Label>
                      <Textarea
                        id="description_en"
                        value={formData.description_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description_en: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="features_ro">Features (Romanian)</Label>
                      <Textarea
                        id="features_ro"
                        value={formData.features_ro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            features_ro: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="One feature per line"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="features_en">Features (English)</Label>
                      <Textarea
                        id="features_en"
                        value={formData.features_en}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            features_en: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="One feature per line"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight_kg">Weight (kg)</Label>
                        <Input
                          id="weight_kg"
                          type="number"
                          step="0.01"
                          value={formData.weight_kg}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              weight_kg: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dimensions: e.target.value,
                            })
                          }
                          placeholder="L x W x H cm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants" className="space-y-6 mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="has_variants"
                    checked={formData.has_variants}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        has_variants: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="has_variants" className="cursor-pointer">
                    This product has variants (sizes, colors, etc.)
                  </Label>
                </div>

                {formData.has_variants && (
                  <VariantManager variants={variants} onChange={setVariants} />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        low_stock_threshold: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          is_active: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active (visible in shop)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          is_featured: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                      Featured product
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track_inventory"
                      checked={formData.track_inventory}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          track_inventory: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="track_inventory" className="cursor-pointer">
                      Track inventory
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_returnable"
                      checked={formData.is_returnable}
                      onCheckedChange={(checked: boolean) =>
                        setFormData({
                          ...formData,
                          is_returnable: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="is_returnable" className="cursor-pointer">
                      Returnable
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
