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
import ImageUpload from "@/components/admin/ImageUpload";

interface PartnerFormProps {
  partnerId?: string;
}

export default function PartnerForm({ partnerId }: PartnerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo_url: null as string | null,
    website_url: "",
    description: "",
    display_order: 0,
    is_published: true,
  });

  useEffect(() => {
    if (partnerId) {
      fetchPartner();
    }
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/partners/${partnerId}`);
      const data = await res.json();
      if (data.partner) {
        setFormData(data.partner);
      }
    } catch (error) {
      console.error("Error fetching partner:", error);
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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !partnerId ? generateSlug(name) : prev.slug, // Auto-generate slug only for new partners
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = partnerId ? `/api/partners/${partnerId}` : "/api/partners";
      const method = partnerId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to save partner");
      }

      router.push("/admin/partners");
      router.refresh();
    } catch (error) {
      console.error("Error saving partner:", error);
      alert("Failed to save partner");
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
              {partnerId ? "Edit Partner" : "New Partner"}
            </h1>
            <p className="text-gray-600 mt-1">
              {partnerId
                ? "Update partner information"
                : "Add a new business partner"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="Partner name"
                  />
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
                    placeholder="partner-slug"
                  />
                  <p className="text-xs text-gray-500">
                    Used in URLs. Use lowercase letters, numbers, and hyphens
                    only.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) =>
                      setFormData({ ...formData, website_url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the partner..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.logo_url}
                  onChange={(url) =>
                    setFormData({ ...formData, logo_url: url })
                  }
                  bucket="public"
                  folder="partners"
                  aspectRatio="auto"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        is_published: checked === true,
                      })
                    }
                  />
                  <Label
                    htmlFor="is_published"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Published (visible on website)
                  </Label>
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
                  Save Partner
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
