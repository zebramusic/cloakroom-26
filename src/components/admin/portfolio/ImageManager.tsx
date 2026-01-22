"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Star, Edit2 } from "lucide-react";
import { ImageUploadDialog } from "./ImageUploadDialog";
import { ImageEditDialog } from "./ImageEditDialog";

interface ImageManagerProps {
  itemId: string;
}

export function ImageManager({ itemId }: ImageManagerProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);

  useEffect(() => {
    fetchImages();
  }, [itemId]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`/api/admin/portfolio/${itemId}/images`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/portfolio/${itemId}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        fetchImages();
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete image");
    }
  };

  const handleUploadSuccess = () => {
    fetchImages();
    setUploadDialogOpen(false);
  };

  const handleEditSuccess = () => {
    fetchImages();
    setEditingImage(null);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading images...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} (max 20)
        </p>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          disabled={images.length >= 20}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No images yet</p>
          <Button onClick={() => setUploadDialogOpen(true)}>
            Upload Your First Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="relative group border rounded-lg overflow-hidden bg-muted"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.variants.thumbUrl}
                  alt={image.altText.ro || "Portfolio image"}
                  fill
                  className="object-cover"
                />
                {image.isCover && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Cover
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingImage(image)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {image.caption.ro && (
                <div className="p-2 bg-card">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {image.caption.ro}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ImageUploadDialog
        itemId={itemId}
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {editingImage && (
        <ImageEditDialog
          itemId={itemId}
          image={editingImage}
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
