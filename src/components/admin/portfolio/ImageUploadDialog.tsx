"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploadDialogProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImageUploadDialog({
  itemId,
  isOpen,
  onClose,
  onSuccess,
}: ImageUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [altTextRo, setAltTextRo] = useState("");
  const [altTextEn, setAltTextEn] = useState("");
  const [captionRo, setCaptionRo] = useState("");
  const [captionEn, setCaptionEn] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("altText.ro", altTextRo || file.name);
        formData.append("altText.en", altTextEn || altTextRo || file.name);
        if (captionRo) formData.append("caption.ro", captionRo);
        if (captionEn) formData.append("caption.en", captionEn);

        const res = await fetch(`/api/admin/portfolio/${itemId}/images`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Upload failed");
        }

        setProgress(((i + 1) / selectedFiles.length) * 100);
      }

      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(error.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setProgress(0);
    setAltTextRo("");
    setAltTextEn("");
    setCaptionRo("");
    setCaptionEn("");
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Upload one or more images (max 8MB each, JPEG/PNG/WebP)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div>
            <Input
              id="file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-auto p-0 border-2 border-dashed hover:border-primary"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-full rounded-lg p-8 text-center transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to select images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, or WebP (max 8MB each)
                </p>
              </div>
            </Button>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata (applies to all files) */}
          {selectedFiles.length > 0 && (
            <Tabs defaultValue="ro" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ro">Romanian</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="ro" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="altText-ro">Alt Text (RO)</Label>
                  <Input
                    id="altText-ro"
                    value={altTextRo}
                    onChange={(e) => setAltTextRo(e.target.value)}
                    placeholder="Descriptive text for accessibility"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Applies to all images being uploaded
                  </p>
                </div>

                <div>
                  <Label htmlFor="caption-ro">Caption (RO)</Label>
                  <Textarea
                    id="caption-ro"
                    value={captionRo}
                    onChange={(e) => setCaptionRo(e.target.value)}
                    placeholder="Optional caption text"
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="en" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="altText-en">Alt Text (EN)</Label>
                  <Input
                    id="altText-en"
                    value={altTextEn}
                    onChange={(e) => setAltTextEn(e.target.value)}
                    placeholder="Descriptive text for accessibility"
                  />
                </div>

                <div>
                  <Label htmlFor="caption-en">Caption (EN)</Label>
                  <Textarea
                    id="caption-en"
                    value={captionEn}
                    onChange={(e) => setCaptionEn(e.target.value)}
                    placeholder="Optional caption text"
                    rows={2}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length} Image
                  {selectedFiles.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
