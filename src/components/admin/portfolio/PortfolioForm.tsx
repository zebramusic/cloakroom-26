"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { ImageManager } from "./ImageManager";
import { hasPermission } from "@/lib/auth/permissions";

interface PortfolioFormProps {
  mode: "create" | "edit";
  itemId?: string;
  initialData?: any;
  userRole: string;
}

const EVENT_TYPES = [
  "conference",
  "concert",
  "festival",
  "corporate",
  "wedding",
  "sports",
  "exhibition",
  "gala",
];

export function PortfolioForm({
  mode,
  itemId,
  initialData,
  userRole,
}: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    localeContent: {
      ro: {
        title: initialData?.localeContent?.ro?.title || "",
        excerpt: initialData?.localeContent?.ro?.excerpt || "",
        body: initialData?.localeContent?.ro?.body || "",
      },
      en: {
        title: initialData?.localeContent?.en?.title || "",
        excerpt: initialData?.localeContent?.en?.excerpt || "",
        body: initialData?.localeContent?.en?.body || "",
      },
    },
    eventMeta: {
      eventType: initialData?.eventMeta?.eventType || "",
      location: initialData?.eventMeta?.location || "",
      startsAt: initialData?.eventMeta?.startsAt
        ? new Date(initialData.eventMeta.startsAt).toISOString().split("T")[0]
        : "",
      endsAt: initialData?.eventMeta?.endsAt
        ? new Date(initialData.eventMeta.endsAt).toISOString().split("T")[0]
        : "",
    },
    tags: initialData?.tags?.join(", ") || "",
    isPublished: initialData?.isPublished || false,
    isFeatured: initialData?.isFeatured || false,
  });

  const canPublish = hasPermission(userRole, "portfolio.publish");
  const canUpdate = hasPermission(userRole, "portfolio.update");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        eventMeta: {
          ...formData.eventMeta,
          startsAt: formData.eventMeta.startsAt || undefined,
          endsAt: formData.eventMeta.endsAt || undefined,
        },
      };

      const url =
        mode === "create"
          ? "/api/admin/portfolio"
          : `/api/admin/portfolio/${itemId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (mode === "create") {
          router.push(`/admin/portfolio/${data.item._id}`);
        } else {
          router.refresh();
        }
      } else {
        alert(data.error || "Failed to save portfolio item");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save portfolio item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="my-event-2024"
              required
              disabled={mode === "edit"}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "create"
                ? "URL-friendly identifier (lowercase, hyphens only)"
                : "Slug cannot be changed after creation"}
            </p>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="corporate, 2024, bucharest"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated tags for filtering
            </p>
          </div>
        </div>
      </div>

      {/* Event Metadata */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Event Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Select
              value={formData.eventMeta.eventType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  eventMeta: { ...formData.eventMeta, eventType: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.eventMeta.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: {
                    ...formData.eventMeta,
                    location: e.target.value,
                  },
                })
              }
              placeholder="Bucharest, Romania"
            />
          </div>

          <div>
            <Label htmlFor="startsAt">Start Date</Label>
            <Input
              id="startsAt"
              type="date"
              value={formData.eventMeta.startsAt}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: {
                    ...formData.eventMeta,
                    startsAt: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="endsAt">End Date</Label>
            <Input
              id="endsAt"
              type="date"
              value={formData.eventMeta.endsAt}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: { ...formData.eventMeta, endsAt: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Content (Bilingual) */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Content</h2>

        <Tabs defaultValue="ro" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ro">Romanian (RO)</TabsTrigger>
            <TabsTrigger value="en">English (EN)</TabsTrigger>
          </TabsList>

          <TabsContent value="ro" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="title-ro">Title (Romanian) *</Label>
              <Input
                id="title-ro"
                value={formData.localeContent.ro.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      ro: {
                        ...formData.localeContent.ro,
                        title: e.target.value,
                      },
                    },
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt-ro">Excerpt (Romanian) *</Label>
              <Textarea
                id="excerpt-ro"
                value={formData.localeContent.ro.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      ro: {
                        ...formData.localeContent.ro,
                        excerpt: e.target.value,
                      },
                    },
                  })
                }
                rows={3}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Short description (1-2 sentences)
              </p>
            </div>

            <div>
              <Label htmlFor="body-ro">Body (Romanian)</Label>
              <Textarea
                id="body-ro"
                value={formData.localeContent.ro.body}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      ro: {
                        ...formData.localeContent.ro,
                        body: e.target.value,
                      },
                    },
                  })
                }
                rows={10}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Markdown supported (optional)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="title-en">Title (English)</Label>
              <Input
                id="title-en"
                value={formData.localeContent.en.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      en: {
                        ...formData.localeContent.en,
                        title: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="excerpt-en">Excerpt (English)</Label>
              <Textarea
                id="excerpt-en"
                value={formData.localeContent.en.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      en: {
                        ...formData.localeContent.en,
                        excerpt: e.target.value,
                      },
                    },
                  })
                }
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="body-en">Body (English)</Label>
              <Textarea
                id="body-en"
                value={formData.localeContent.en.body}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localeContent: {
                      ...formData.localeContent,
                      en: {
                        ...formData.localeContent.en,
                        body: e.target.value,
                      },
                    },
                  })
                }
                rows={10}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publishing Options */}
      {canPublish && (
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold">Publishing</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublished">Published</Label>
                <p className="text-sm text-muted-foreground">
                  Make this item visible on the public website
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublished: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show on homepage and at the top of portfolio listing
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFeatured: checked })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      {mode === "edit" && itemId && (
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold">Images</h2>
          <ImageManager itemId={itemId} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading || !canUpdate}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Portfolio Item
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/portfolio")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
