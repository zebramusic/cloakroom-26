"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2, X, Save } from "lucide-react";

const PAGES = [
  { key: 'home', label: 'Home Page' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'industries', label: 'Industries' },
];

interface HeroSettings {
  pageKey: string;
  localeData: {
    ro: {
      title: string;
      subtitle?: string;
      primaryCtaText?: string;
      primaryCtaLink?: string;
      secondaryCtaText?: string;
      secondaryCtaLink?: string;
    };
    en: {
      title: string;
      subtitle?: string;
      primaryCtaText?: string;
      primaryCtaLink?: string;
      secondaryCtaText?: string;
      secondaryCtaLink?: string;
    };
  };
  backgroundImage?: string;
}

export function HeroSettingsEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings(selectedPage);
  }, [selectedPage]);

  const loadSettings = async (pageKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/site/settings/${pageKey}`);
      const data = await res.json();
      
      if (data.settings) {
        setSettings(data.settings);
      } else {
        // Initialize with empty data
        setSettings({
          pageKey,
          localeData: {
            ro: { title: '', subtitle: '' },
            en: { title: '', subtitle: '' },
          },
          backgroundImage: '',
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");

      const res = await fetch("/api/admin/site/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setSettings(prev => prev ? { ...prev, backgroundImage: result.asset.url } : null);
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

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/site/settings/${selectedPage}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          localeData: settings.localeData,
          backgroundImage: settings.backgroundImage,
        }),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!settings) {
    return <div className="text-center py-8 text-muted-foreground">No settings found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <div>
        <Label>Select Page</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {PAGES.map(page => (
            <Button
              key={page.key}
              variant={selectedPage === page.key ? 'default' : 'outline'}
              onClick={() => setSelectedPage(page.key)}
            >
              {page.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Background Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Background Image</CardTitle>
          <CardDescription>Upload a background image for the hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={settings.backgroundImage || ''}
              onChange={(e) => setSettings({ ...settings, backgroundImage: e.target.value })}
              placeholder="/uploads/site/hero/image.jpg"
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
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
            {settings.backgroundImage && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSettings({ ...settings, backgroundImage: '' })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {settings.backgroundImage && (
            <img
              src={settings.backgroundImage}
              alt="Background preview"
              className="h-32 w-auto rounded border"
            />
          )}
        </CardContent>
      </Card>

      {/* Content by Language */}
      <Tabs defaultValue="ro">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ro">Romanian (RO)</TabsTrigger>
          <TabsTrigger value="en">English (EN)</TabsTrigger>
        </TabsList>

        <TabsContent value="ro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content (Romanian)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={settings.localeData.ro.title}
                  onChange={(e) => setSettings({
                    ...settings,
                    localeData: {
                      ...settings.localeData,
                      ro: { ...settings.localeData.ro, title: e.target.value }
                    }
                  })}
                  placeholder="Garderobă Profesională pentru Evenimente"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={settings.localeData.ro.subtitle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    localeData: {
                      ...settings.localeData,
                      ro: { ...settings.localeData.ro, subtitle: e.target.value }
                    }
                  })}
                  placeholder="Soluții complete de garderobă pentru evenimente..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={settings.localeData.ro.primaryCtaText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, primaryCtaText: e.target.value }
                      }
                    })}
                    placeholder="Cere Ofertă"
                  />
                </div>
                <div>
                  <Label>Primary CTA Link</Label>
                  <Input
                    value={settings.localeData.ro.primaryCtaLink || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, primaryCtaLink: e.target.value }
                      }
                    })}
                    placeholder="/ro/cere-oferta"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={settings.localeData.ro.secondaryCtaText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, secondaryCtaText: e.target.value }
                      }
                    })}
                    placeholder="Explorează Shop-ul"
                  />
                </div>
                <div>
                  <Label>Secondary CTA Link</Label>
                  <Input
                    value={settings.localeData.ro.secondaryCtaLink || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, secondaryCtaLink: e.target.value }
                      }
                    })}
                    placeholder="/ro/shop"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content (English)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={settings.localeData.en.title}
                  onChange={(e) => setSettings({
                    ...settings,
                    localeData: {
                      ...settings.localeData,
                      en: { ...settings.localeData.en, title: e.target.value }
                    }
                  })}
                  placeholder="Professional Cloakroom for Events"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea
                  value={settings.localeData.en.subtitle || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    localeData: {
                      ...settings.localeData,
                      en: { ...settings.localeData.en, subtitle: e.target.value }
                    }
                  })}
                  placeholder="Complete cloakroom solutions for events..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={settings.localeData.en.primaryCtaText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, primaryCtaText: e.target.value }
                      }
                    })}
                    placeholder="Get Quote"
                  />
                </div>
                <div>
                  <Label>Primary CTA Link</Label>
                  <Input
                    value={settings.localeData.en.primaryCtaLink || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, primaryCtaLink: e.target.value }
                      }
                    })}
                    placeholder="/en/quote"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={settings.localeData.en.secondaryCtaText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, secondaryCtaText: e.target.value }
                      }
                    })}
                    placeholder="Explore Shop"
                  />
                </div>
                <div>
                  <Label>Secondary CTA Link</Label>
                  <Input
                    value={settings.localeData.en.secondaryCtaLink || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, secondaryCtaLink: e.target.value }
                      }
                    })}
                    placeholder="/en/shop"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
