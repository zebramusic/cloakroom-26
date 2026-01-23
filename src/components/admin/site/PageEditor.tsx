"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Save,
  Globe,
  Loader2,
  MoveUp,
  MoveDown,
  Trash2,
} from "lucide-react";
import { BlockEditor } from "./BlockEditor";

interface PageEditorProps {
  pageKey: string;
  canWrite: boolean;
  canPublish: boolean;
}

export function PageEditor({ pageKey, canWrite, canPublish }: PageEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [version, setVersion] = useState(1);
  const [activeTab, setActiveTab] = useState<"ro" | "en">("ro");

  const [roBlocks, setRoBlocks] = useState<any[]>([]);
  const [enBlocks, setEnBlocks] = useState<any[]>([]);

  const fetchPage = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/site/pages/${pageKey}?status=draft`);

      if (res.ok) {
        const data = await res.json();
        setStatus(data.page.status);
        setVersion(data.page.version);
        setRoBlocks(data.page.localeData.ro.blocks || []);
        setEnBlocks(data.page.localeData.en.blocks || []);
      } else {
        // No draft exists, try published
        const pubRes = await fetch(
          `/api/admin/site/pages/${pageKey}?status=published`,
        );
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          setStatus("published");
          setVersion(pubData.page.version);
          setRoBlocks(pubData.page.localeData.ro.blocks || []);
          setEnBlocks(pubData.page.localeData.en.blocks || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch page:", error);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const handleSave = async () => {
    if (!canWrite) return;

    setSaving(true);
    try {
      const payload = {
        localeData: {
          ro: { blocks: roBlocks },
          en: { blocks: enBlocks },
        },
      };

      let res;
      if (status === "draft") {
        // Update existing draft
        res = await fetch(`/api/admin/site/pages/${pageKey}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new draft from published
        res = await fetch("/api/admin/site/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: pageKey,
            slug: `/${pageKey}`,
            ...payload,
          }),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setStatus(data.page.status);
        setVersion(data.page.version);
        alert("Page saved successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save page");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!canPublish) return;

    if (
      !confirm("Publish this page? It will become live on the public site.")
    ) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch(`/api/admin/site/pages/${pageKey}/publish`, {
        method: "POST",
      });

      if (res.ok) {
        setStatus("published");
        alert("Page published successfully!");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to publish page");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish page");
    } finally {
      setPublishing(false);
    }
  };

  const addBlock = (
    locale: "ro" | "en",
    type: "hero" | "featureGrid" | "cta",
  ) => {
    const blocks = locale === "ro" ? roBlocks : enBlocks;
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type),
      visibility: "public" as const,
      orderIndex: blocks.length,
    };

    if (locale === "ro") {
      setRoBlocks([...blocks, newBlock]);
    } else {
      setEnBlocks([...blocks, newBlock]);
    }
  };

  const updateBlock = (locale: "ro" | "en", index: number, updates: any) => {
    const blocks = locale === "ro" ? roBlocks : enBlocks;
    const updated = [...blocks];
    updated[index] = { ...updated[index], ...updates };

    if (locale === "ro") {
      setRoBlocks(updated);
    } else {
      setEnBlocks(updated);
    }
  };

  const deleteBlock = (locale: "ro" | "en", index: number) => {
    if (!confirm("Delete this block?")) return;

    const blocks = locale === "ro" ? roBlocks : enBlocks;
    const updated = blocks.filter((_, i) => i !== index);

    if (locale === "ro") {
      setRoBlocks(updated);
    } else {
      setEnBlocks(updated);
    }
  };

  const moveBlock = (
    locale: "ro" | "en",
    index: number,
    direction: "up" | "down",
  ) => {
    const blocks = locale === "ro" ? roBlocks : enBlocks;
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= blocks.length) return;

    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((block, i) => (block.orderIndex = i));

    if (locale === "ro") {
      setRoBlocks(updated);
    } else {
      setEnBlocks(updated);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading page...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant={status === "published" ? "default" : "secondary"}>
          {status === "published" ? "Published" : "Draft"} - v{version}
        </Badge>
        <div className="flex gap-2">
          {canWrite && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          )}
          {canPublish && status === "draft" && (
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "ro" | "en")}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ro">Romanian (RO)</TabsTrigger>
          <TabsTrigger value="en">English (EN)</TabsTrigger>
        </TabsList>

        <TabsContent value="ro" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Content Blocks ({roBlocks.length})
            </h3>
            {canWrite && (
              <div className="flex gap-2">
                <Button
                  onClick={() => addBlock("ro", "hero")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Hero
                </Button>
                <Button
                  onClick={() => addBlock("ro", "featureGrid")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Features
                </Button>
                <Button
                  onClick={() => addBlock("ro", "cta")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  CTA
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {roBlocks.map((block, index) => (
              <Card key={block.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge>{block.type}</Badge>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveBlock("ro", index, "up")}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < roBlocks.length - 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveBlock("ro", index, "down")}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteBlock("ro", index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <BlockEditor
                  block={block}
                  onChange={(data: any) => updateBlock("ro", index, { data })}
                  canEdit={canWrite}
                />
              </Card>
            ))}
            {roBlocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No blocks yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Content Blocks ({enBlocks.length})
            </h3>
            {canWrite && (
              <div className="flex gap-2">
                <Button
                  onClick={() => addBlock("en", "hero")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Hero
                </Button>
                <Button
                  onClick={() => addBlock("en", "featureGrid")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Features
                </Button>
                <Button
                  onClick={() => addBlock("en", "cta")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  CTA
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {enBlocks.map((block, index) => (
              <Card key={block.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge>{block.type}</Badge>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveBlock("en", index, "up")}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < enBlocks.length - 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveBlock("en", index, "down")}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteBlock("en", index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <BlockEditor
                  block={block}
                  onChange={(data: any) => updateBlock("en", index, { data })}
                  canEdit={canWrite}
                />
              </Card>
            ))}
            {enBlocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No blocks yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getDefaultBlockData(type: string) {
  switch (type) {
    case "hero":
      return {
        headline: "Hero Headline",
        subheadline: "Hero subheadline text",
        primaryCta: {
          text: "Get Started",
          href: "/contact",
          variant: "default",
        },
        alignment: "center",
      };
    case "featureGrid":
      return {
        title: "Features",
        features: [
          {
            id: "1",
            icon: "check",
            title: "Feature 1",
            description: "Description",
          },
        ],
        columns: 3,
      };
    case "cta":
      return {
        headline: "Call to Action",
        description: "Compelling description",
        primaryCta: {
          text: "Contact Us",
          href: "/contact",
          variant: "default",
        },
      };
    default:
      return {};
  }
}
