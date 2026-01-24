"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Globe, Share2, FileText, Loader2 } from "lucide-react";

interface CompanySettings {
  localeData: {
    ro: {
      companyName: string;
      tagline: string;
      description: string;
      address: string;
      phone: string;
      email: string;
      businessHours: string;
    };
    en: {
      companyName: string;
      tagline: string;
      description: string;
      address: string;
      phone: string;
      email: string;
      businessHours: string;
    };
  };
  socialNetworks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    tiktok: string;
  };
  legalInfo: {
    cui: string;
    regCom: string;
    bankName: string;
    iban: string;
    swift: string;
  };
}

export default function CompanySettingsEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    localeData: {
      ro: {
        companyName: "",
        tagline: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        businessHours: "",
      },
      en: {
        companyName: "",
        tagline: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        businessHours: "",
      },
    },
    socialNetworks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      tiktok: "",
    },
    legalInfo: {
      cui: "",
      regCom: "",
      bankName: "",
      iban: "",
      swift: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/site/company-settings");
      const data = await res.json();
      console.log('[CompanySettingsEditor] Fetched settings:', data);
      
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("[CompanySettingsEditor] Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site/company-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert("Settings saved successfully!");
        // Refresh the router to clear any client-side cache
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to save settings: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ro" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ro">
            <Globe className="mr-2 h-4 w-4" />
            Romanian (RO)
          </TabsTrigger>
          <TabsTrigger value="en">
            <Globe className="mr-2 h-4 w-4" />
            English (EN)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information (RO)
              </CardTitle>
              <CardDescription>
                Basic company details in Romanian
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ro-companyName">Company Name *</Label>
                <Input
                  id="ro-companyName"
                  value={settings.localeData.ro.companyName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, companyName: e.target.value },
                      },
                    })
                  }
                  placeholder="Garderobă Pro"
                />
              </div>
              <div>
                <Label htmlFor="ro-tagline">Tagline</Label>
                <Input
                  id="ro-tagline"
                  value={settings.localeData.ro.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, tagline: e.target.value },
                      },
                    })
                  }
                  placeholder="Soluții profesionale de garderobă"
                />
              </div>
              <div>
                <Label htmlFor="ro-description">Description</Label>
                <Textarea
                  id="ro-description"
                  value={settings.localeData.ro.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, description: e.target.value },
                      },
                    })
                  }
                  rows={3}
                  placeholder="Scurtă descriere a companiei..."
                />
              </div>
              <div>
                <Label htmlFor="ro-address">Address *</Label>
                <Input
                  id="ro-address"
                  value={settings.localeData.ro.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, address: e.target.value },
                      },
                    })
                  }
                  placeholder="Cluj-Napoca, România"
                />
              </div>
              <div>
                <Label htmlFor="ro-phone">Phone *</Label>
                <Input
                  id="ro-phone"
                  value={settings.localeData.ro.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, phone: e.target.value },
                      },
                    })
                  }
                  placeholder="+40 123 456 789"
                />
              </div>
              <div>
                <Label htmlFor="ro-email">Email *</Label>
                <Input
                  id="ro-email"
                  type="email"
                  value={settings.localeData.ro.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, email: e.target.value },
                      },
                    })
                  }
                  placeholder="contact@garderobapro.ro"
                />
              </div>
              <div>
                <Label htmlFor="ro-businessHours">Business Hours *</Label>
                <Input
                  id="ro-businessHours"
                  value={settings.localeData.ro.businessHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        ro: { ...settings.localeData.ro, businessHours: e.target.value },
                      },
                    })
                  }
                  placeholder="Luni - Vineri, 9:00 - 18:00"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information (EN)
              </CardTitle>
              <CardDescription>
                Basic company details in English
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="en-companyName">Company Name *</Label>
                <Input
                  id="en-companyName"
                  value={settings.localeData.en.companyName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, companyName: e.target.value },
                      },
                    })
                  }
                  placeholder="Garderobă Pro"
                />
              </div>
              <div>
                <Label htmlFor="en-tagline">Tagline</Label>
                <Input
                  id="en-tagline"
                  value={settings.localeData.en.tagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, tagline: e.target.value },
                      },
                    })
                  }
                  placeholder="Professional cloakroom solutions"
                />
              </div>
              <div>
                <Label htmlFor="en-description">Description</Label>
                <Textarea
                  id="en-description"
                  value={settings.localeData.en.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, description: e.target.value },
                      },
                    })
                  }
                  rows={3}
                  placeholder="Brief company description..."
                />
              </div>
              <div>
                <Label htmlFor="en-address">Address *</Label>
                <Input
                  id="en-address"
                  value={settings.localeData.en.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, address: e.target.value },
                      },
                    })
                  }
                  placeholder="Cluj-Napoca, Romania"
                />
              </div>
              <div>
                <Label htmlFor="en-phone">Phone *</Label>
                <Input
                  id="en-phone"
                  value={settings.localeData.en.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, phone: e.target.value },
                      },
                    })
                  }
                  placeholder="+40 123 456 789"
                />
              </div>
              <div>
                <Label htmlFor="en-email">Email *</Label>
                <Input
                  id="en-email"
                  type="email"
                  value={settings.localeData.en.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, email: e.target.value },
                      },
                    })
                  }
                  placeholder="contact@garderobapro.ro"
                />
              </div>
              <div>
                <Label htmlFor="en-businessHours">Business Hours *</Label>
                <Input
                  id="en-businessHours"
                  value={settings.localeData.en.businessHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      localeData: {
                        ...settings.localeData,
                        en: { ...settings.localeData.en, businessHours: e.target.value },
                      },
                    })
                  }
                  placeholder="Monday - Friday, 9:00 - 18:00"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social Networks - Language Independent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Networks
          </CardTitle>
          <CardDescription>
            Only social networks with URLs will be displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={settings.socialNetworks.facebook}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={settings.socialNetworks.instagram}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={settings.socialNetworks.linkedin}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, linkedin: e.target.value },
                })
              }
              placeholder="https://linkedin.com/company/yourcompany"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={settings.socialNetworks.twitter}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, twitter: e.target.value },
                })
              }
              placeholder="https://twitter.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={settings.socialNetworks.youtube}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, youtube: e.target.value },
                })
              }
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
          <div>
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={settings.socialNetworks.tiktok}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialNetworks: { ...settings.socialNetworks, tiktok: e.target.value },
                })
              }
              placeholder="https://tiktok.com/@yourpage"
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Info - Language Independent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal & Banking Information
          </CardTitle>
          <CardDescription>
            Company registration and banking details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cui">CUI (Tax ID) *</Label>
            <Input
              id="cui"
              value={settings.legalInfo.cui}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  legalInfo: { ...settings.legalInfo, cui: e.target.value },
                })
              }
              placeholder="RO12345678"
            />
          </div>
          <div>
            <Label htmlFor="regCom">Reg. Com. *</Label>
            <Input
              id="regCom"
              value={settings.legalInfo.regCom}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  legalInfo: { ...settings.legalInfo, regCom: e.target.value },
                })
              }
              placeholder="J12/1234/2020"
            />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              value={settings.legalInfo.bankName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  legalInfo: { ...settings.legalInfo, bankName: e.target.value },
                })
              }
              placeholder="BCR"
            />
          </div>
          <div>
            <Label htmlFor="iban">IBAN *</Label>
            <Input
              id="iban"
              value={settings.legalInfo.iban}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  legalInfo: { ...settings.legalInfo, iban: e.target.value },
                })
              }
              placeholder="RO49AAAA1B31007593840000"
            />
          </div>
          <div>
            <Label htmlFor="swift">SWIFT/BIC</Label>
            <Input
              id="swift"
              value={settings.legalInfo.swift}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  legalInfo: { ...settings.legalInfo, swift: e.target.value },
                })
              }
              placeholder="RNCBROBU"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
