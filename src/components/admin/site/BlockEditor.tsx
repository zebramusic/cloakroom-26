"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, X } from "lucide-react";

interface BlockEditorProps {
  block: any;
  onChange: (data: any) => void;
  canEdit: boolean;
}

export function BlockEditor({ block, onChange, canEdit }: BlockEditorProps) {
  const { type, data } = block;

  switch (type) {
    case "hero":
      return (
        <HeroBlockEditor data={data} onChange={onChange} canEdit={canEdit} />
      );
    case "featureGrid":
      return (
        <FeatureGridBlockEditor
          data={data}
          onChange={onChange}
          canEdit={canEdit}
        />
      );
    case "cta":
      return (
        <CTABlockEditor data={data} onChange={onChange} canEdit={canEdit} />
      );
    default:
      return (
        <div className="text-muted-foreground">Unknown block type: {type}</div>
      );
  }
}

function HeroBlockEditor({ data, onChange, canEdit }: any) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");

      const res = await fetch("/api/admin/site/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        onChange({ ...data, backgroundImage: result.asset.url });
        alert("Image uploaded successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Headline</Label>
        <Input
          value={data.headline || ""}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label>Subheadline</Label>
        <Textarea
          value={data.subheadline || ""}
          onChange={(e) => onChange({ ...data, subheadline: e.target.value })}
          disabled={!canEdit}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Primary CTA Text</Label>
          <Input
            value={data.primaryCta?.text || ""}
            onChange={(e) =>
              onChange({
                ...data,
                primaryCta: { ...data.primaryCta, text: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
        <div>
          <Label>Primary CTA Link</Label>
          <Input
            value={data.primaryCta?.href || ""}
            onChange={(e) =>
              onChange({
                ...data,
                primaryCta: { ...data.primaryCta, href: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Secondary CTA Text (optional)</Label>
          <Input
            value={data.secondaryCta?.text || ""}
            onChange={(e) =>
              onChange({
                ...data,
                secondaryCta: { ...data.secondaryCta, text: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
        <div>
          <Label>Secondary CTA Link (optional)</Label>
          <Input
            value={data.secondaryCta?.href || ""}
            onChange={(e) =>
              onChange({
                ...data,
                secondaryCta: { ...data.secondaryCta, href: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
      </div>
      <div>
        <Label>Alignment</Label>
        <Select
          value={data.alignment || "center"}
          onValueChange={(value) => onChange({ ...data, alignment: value })}
          disabled={!canEdit}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Background Image (optional)</Label>
        <div className="flex gap-2">
          <Input
            value={data.backgroundImage || ""}
            onChange={(e) =>
              onChange({ ...data, backgroundImage: e.target.value })
            }
            placeholder="/uploads/site/hero-bg.jpg"
            disabled={!canEdit}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canEdit || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          {data.backgroundImage && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onChange({ ...data, backgroundImage: "" })}
              disabled={!canEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {data.backgroundImage && (
          <div className="mt-2">
            <img
              src={data.backgroundImage}
              alt="Background preview"
              className="h-20 w-auto rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureGridBlockEditor({ data, onChange, canEdit }: any) {
  const features = data.features || [];

  const addFeature = () => {
    onChange({
      ...data,
      features: [
        ...features,
        {
          id: `feat-${Date.now()}`,
          icon: "check",
          title: "New Feature",
          description: "Description",
        },
      ],
    });
  };

  const updateFeature = (index: number, updates: any) => {
    const updated = [...features];
    updated[index] = { ...updated[index], ...updates };
    onChange({ ...data, features: updated });
  };

  const deleteFeature = (index: number) => {
    onChange({
      ...data,
      features: features.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label>Subtitle (optional)</Label>
        <Input
          value={data.subtitle || ""}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label>Columns</Label>
        <Select
          value={String(data.columns || 3)}
          onValueChange={(value) =>
            onChange({ ...data, columns: Number(value) })
          }
          disabled={!canEdit}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Features ({features.length})</Label>
          <button
            type="button"
            onClick={addFeature}
            disabled={!canEdit}
            className="text-sm text-primary hover:underline"
          >
            + Add Feature
          </button>
        </div>
        {features.map((feat: any, index: number) => (
          <div key={feat.id} className="border rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Feature {index + 1}</span>
              <button
                type="button"
                onClick={() => deleteFeature(index)}
                disabled={!canEdit}
                className="text-sm text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
            <Input
              placeholder="Title"
              value={feat.title || ""}
              onChange={(e) => updateFeature(index, { title: e.target.value })}
              disabled={!canEdit}
            />
            <Textarea
              placeholder="Description"
              value={feat.description || ""}
              onChange={(e) =>
                updateFeature(index, { description: e.target.value })
              }
              disabled={!canEdit}
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABlockEditor({ data, onChange, canEdit }: any) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Headline</Label>
        <Input
          value={data.headline || ""}
          onChange={(e) => onChange({ ...data, headline: e.target.value })}
          disabled={!canEdit}
        />
      </div>
      <div>
        <Label>Description (optional)</Label>
        <Textarea
          value={data.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          disabled={!canEdit}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Primary CTA Text</Label>
          <Input
            value={data.primaryCta?.text || ""}
            onChange={(e) =>
              onChange({
                ...data,
                primaryCta: { ...data.primaryCta, text: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
        <div>
          <Label>Primary CTA Link</Label>
          <Input
            value={data.primaryCta?.href || ""}
            onChange={(e) =>
              onChange({
                ...data,
                primaryCta: { ...data.primaryCta, href: e.target.value },
              })
            }
            disabled={!canEdit}
          />
        </div>
      </div>
      <div>
        <Label>Background Color (optional)</Label>
        <Input
          value={data.backgroundColor || ""}
          onChange={(e) =>
            onChange({ ...data, backgroundColor: e.target.value })
          }
          placeholder="gray, primary, secondary"
          disabled={!canEdit}
        />
      </div>
    </div>
  );
}
