"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X, Search } from "lucide-react";
import Image from "next/image";

export function MediaLibrary() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/site/media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const data = await res.json();
        setAssets([data.asset, ...assets]);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/site/media/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAssets(assets.filter((a) => a._id !== id));
        alert("Image deleted successfully!");
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete image");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (loading) {
    return <div className="text-center py-12">Loading media...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </Button>
          <div className="text-sm text-muted-foreground">
            JPG, PNG, WebP, or GIF. Max 10MB.
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by filename or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <Card key={asset._id} className="p-3 space-y-3">
            <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
              <Image
                src={asset.url}
                alt={asset.altText?.ro || asset.filename}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <p
                className="text-sm font-medium truncate"
                title={asset.filename}
              >
                {asset.filename}
              </p>
              <p className="text-xs text-muted-foreground">
                {asset.width} × {asset.height} •{" "}
                {(asset.size / 1024).toFixed(0)}KB
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyUrl(asset.url)}
                  className="flex-1"
                >
                  Copy URL
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(asset._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No images match your search"
              : "No images uploaded yet"}
          </p>
        </div>
      )}
    </div>
  );
}
