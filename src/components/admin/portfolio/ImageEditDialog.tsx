"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageEditDialogProps {
  itemId: string;
  image: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImageEditDialog({
  itemId,
  image,
  isOpen,
  onClose,
  onSuccess,
}: ImageEditDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    altText: {
      ro: image.altText.ro || "",
      en: image.altText.en || "",
    },
    caption: {
      ro: image.caption.ro || "",
      en: image.caption.en || "",
    },
  });

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch(
        `/api/admin/portfolio/${itemId}/images/${image._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update image");
      }
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={image.variants.mediumUrl}
              alt={formData.altText.ro}
              fill
              className="object-contain"
            />
          </div>

          {/* Metadata */}
          <Tabs defaultValue="ro" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ro">Romanian</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>

            <TabsContent value="ro" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="altText-ro">Alt Text (RO) *</Label>
                <Input
                  id="altText-ro"
                  value={formData.altText.ro}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altText: { ...formData.altText, ro: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="caption-ro">Caption (RO)</Label>
                <Textarea
                  id="caption-ro"
                  value={formData.caption.ro}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caption: { ...formData.caption, ro: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="altText-en">Alt Text (EN)</Label>
                <Input
                  id="altText-en"
                  value={formData.altText.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altText: { ...formData.altText, en: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="caption-en">Caption (EN)</Label>
                <Textarea
                  id="caption-en"
                  value={formData.caption.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caption: { ...formData.caption, en: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
