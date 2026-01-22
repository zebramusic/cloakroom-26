"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Save,
  Eye,
  Globe,
  Trash2,
  MoveUp,
  MoveDown,
  Loader2,
} from "lucide-react";
import { NavigationItemEditor } from "./NavigationItemEditor";

interface NavigationItem {
  id: string;
  type: "link" | "dropdown";
  label: string;
  href?: string;
  visibility: "public" | "logged_in_customer" | "hidden";
  orderIndex: number;
  children?: NavigationItem[];
}

interface NavigationManagerProps {
  canWrite: boolean;
  canPublish: boolean;
}

export function NavigationManager({
  canWrite,
  canPublish,
}: NavigationManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [roItems, setRoItems] = useState<NavigationItem[]>([]);
  const [enItems, setEnItems] = useState<NavigationItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ro" | "en">("ro");

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/admin/site/navigation?key=main&status=draft",
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const latest = data.items[0];
        setCurrentId(latest._id);
        setCurrentVersion(latest.version);
        setStatus(latest.status);
        setRoItems(latest.localeData.ro.items || []);
        setEnItems(latest.localeData.en.items || []);
      } else {
        // Check for published version
        const pubRes = await fetch(
          "/api/admin/site/navigation?key=main&status=published",
        );
        const pubData = await pubRes.json();

        if (pubData.items && pubData.items.length > 0) {
          const published = pubData.items[0];
          setCurrentVersion(published.version);
          setStatus("published");
          setRoItems(published.localeData.ro.items || []);
          setEnItems(published.localeData.en.items || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!canWrite) return;

    setSaving(true);
    try {
      const payload = {
        key: "main",
        localeData: {
          ro: { items: roItems },
          en: { items: enItems },
        },
      };

      let res;
      if (currentId && status === "draft") {
        // Update existing draft
        res = await fetch(`/api/admin/site/navigation/${currentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new draft
        res = await fetch("/api/admin/site/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setCurrentId(data.navigation._id);
        setCurrentVersion(data.navigation.version);
        setStatus(data.navigation.status);
        alert("Navigation saved successfully!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save navigation");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save navigation");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!canPublish || !currentId) return;

    if (
      !confirm(
        "Publish this navigation version? It will become live on the public site.",
      )
    ) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/admin/site/navigation/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentId, key: "main" }),
      });

      if (res.ok) {
        setStatus("published");
        alert("Navigation published successfully!");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to publish navigation");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish navigation");
    } finally {
      setPublishing(false);
    }
  };

  const addItem = (locale: "ro" | "en") => {
    const items = locale === "ro" ? roItems : enItems;
    const newItem: NavigationItem = {
      id: `item-${Date.now()}`,
      type: "link",
      label: locale === "ro" ? "Item Nou" : "New Item",
      href: "/",
      visibility: "public",
      orderIndex: items.length,
    };

    if (locale === "ro") {
      setRoItems([...items, newItem]);
    } else {
      setEnItems([...items, newItem]);
    }
  };

  const updateItem = (
    locale: "ro" | "en",
    index: number,
    updates: Partial<NavigationItem>,
  ) => {
    const items = locale === "ro" ? roItems : enItems;
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };

    if (locale === "ro") {
      setRoItems(updated);
    } else {
      setEnItems(updated);
    }
  };

  const deleteItem = (locale: "ro" | "en", index: number) => {
    if (!confirm("Delete this navigation item?")) return;

    const items = locale === "ro" ? roItems : enItems;
    const updated = items.filter((_, i) => i !== index);

    if (locale === "ro") {
      setRoItems(updated);
    } else {
      setEnItems(updated);
    }
  };

  const moveItem = (
    locale: "ro" | "en",
    index: number,
    direction: "up" | "down",
  ) => {
    const items = locale === "ro" ? roItems : enItems;
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((item, i) => (item.orderIndex = i));

    if (locale === "ro") {
      setRoItems(updated);
    } else {
      setEnItems(updated);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading navigation...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? "Published" : "Draft"} - v{currentVersion}
          </Badge>
        </div>
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
          {canPublish && currentId && (
            <Button
              onClick={handlePublish}
              disabled={publishing || status === "published"}
              variant="default"
            >
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
              Navigation Items ({roItems.length})
            </h3>
            {canWrite && (
              <Button onClick={() => addItem("ro")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {roItems.map((item, index) => (
              <Card key={item.id} className="p-4">
                <NavigationItemEditor
                  item={item}
                  onUpdate={(updates) => updateItem("ro", index, updates)}
                  onDelete={() => deleteItem("ro", index)}
                  onMoveUp={
                    index > 0 ? () => moveItem("ro", index, "up") : undefined
                  }
                  onMoveDown={
                    index < roItems.length - 1
                      ? () => moveItem("ro", index, "down")
                      : undefined
                  }
                  canEdit={canWrite}
                />
              </Card>
            ))}
            {roItems.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No navigation items yet
                </p>
                {canWrite && (
                  <Button onClick={() => addItem("ro")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Navigation Items ({enItems.length})
            </h3>
            {canWrite && (
              <Button onClick={() => addItem("en")} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {enItems.map((item, index) => (
              <Card key={item.id} className="p-4">
                <NavigationItemEditor
                  item={item}
                  onUpdate={(updates) => updateItem("en", index, updates)}
                  onDelete={() => deleteItem("en", index)}
                  onMoveUp={
                    index > 0 ? () => moveItem("en", index, "up") : undefined
                  }
                  onMoveDown={
                    index < enItems.length - 1
                      ? () => moveItem("en", index, "down")
                      : undefined
                  }
                  canEdit={canWrite}
                />
              </Card>
            ))}
            {enItems.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No navigation items yet
                </p>
                {canWrite && (
                  <Button onClick={() => addItem("en")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
