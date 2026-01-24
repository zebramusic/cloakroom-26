"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  CreditCard,
  Building2,
  Bell,
  Shield,
  ArrowRight,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Email Settings
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: process.env.SMTP_PORT || "587",
    smtpUser: process.env.SMTP_USER || "",
    smtpSecure: process.env.SMTP_SECURE === "true",
    emailAdmin: process.env.EMAIL_ADMIN || "",

    // Payment Settings
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    stripeCurrency: "RON",
    vatRate: "19",

    // Notifications
    emailOnNewOrder: true,
    emailOnNewQuote: true,
    emailOnNewMessage: true,

    // Security
    sessionTimeout: "24",
    requireEmailVerification: true,
    enableRateLimiting: true,
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your application settings
          </p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Settings saved successfully! Note: Most settings require .env.local
            changes and server restart.
          </AlertDescription>
        </Alert>
      )}

      {/* Company Information */}
      <Car>
        <h1 className="text-3xl font-bold">Technical Settings</h1>
        <p className="text-gray-600 mt-1">
          View technical configuration (environment variables)
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          These settings are configured via environment variables in{" "}
          <code className="bg-blue-100 px-1 py-0.5 rounded">.env.local</code>.
          This page is read-only for reference. Update .env.local and restart the server to apply changes.
        </AlertDescription>
      </Alert>

      {/* Company Settings Link */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Information
          </CardTitle>
          <CardDescription>
            Manage company details, contact info, social networks, and legal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Company information is now managed through the new Company Settings system, 
            which serves as the single source of truth for all company data displayed throughout the website.
          </p>
          <Link href="/admin/site/company-settings">
            <Button className="group">
              Go to Company Settings
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link value={settings.smtpHost}
                onChange={(e) =>
                  setSettings({ ...settings, smtpHost: e.target.value })
                }
                placeholder="smtp.gmail.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) =>
                  setSettings({ ...settings, smtpPort: e.target.value })
                }
                placeholder="587"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                value={settings.smtpUser}
                onChange={(e) =>
                  setSettings({ ...settings, smtpUser: e.target.value })
                }
                placeholder="your-email@gmail.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAdmin">Admin Email</Label>
              <Input
                id="emailAdmin"
                type="email"
                value={settings.emailAdmin}
                onChange={(e) =>
                  setSettings({ ...settings, emailAdmin: e.target.value })
                }
                placeholder="admin@company.com"
                disabled
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Use TLS/SSL</Label>
              <p className="text-sm text-gray-500">Secure SMTP connection</p>
            </div>
            <Switch
              checked={settings.smtpSecure}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, smtpSecure: checked })
              }
              disabled
            />
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              Email settings are configured via environment variables
              (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS). Update .env.local
              and restart the server to apply changes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure payment processors and tax rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
              <Input
                id="stripeKey"
                value={settings.stripePublishableKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    stripePublishableKey: e.target.value,
                  })
                }
                placeholder="pk_test_..."
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripeCurrency">Currency</Label>
              <Input
                id="stripeCurrency"
                value={settings.stripeCurrency}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatRate">VAT Rate (%)</Label>
              <Input
                id="vatRate"
                value={settings.vatRate}
                onChange={(e) =>
                  setSettings({ ...settings, vatRate: e.target.value })
                }
                placeholder="19"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Bank Transfer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={settings.bankName}
                  onChange={(e) =>
                    setSettings({ ...settings, bankName: e.target.value })
                  }
                  placeholder="Bank Name"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankIBAN">IBAN</Label>
                <Input
                  id="bankIBAN"
                  value={settings.bankIBAN}
                  onChange={(e) =>
                    setSettings({ ...settings, bankIBAN: e.target.value })
                  }
                  placeholder="RO00 BANK 0000 0000 0000 0000"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankSwift">SWIFT/BIC</Label>
                <Input
                  id="bankSwift"
                  value={settings.bankSwift}
                  onChange={(e) =>
                    setSettings({ ...settings, bankSwift: e.target.value })
                  }
                  placeholder="BANKROBU"
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure when to receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>New Order Notifications</Label>
              <p className="text-sm text-gray-500">
                Get notified when a customer places an order
              </p>
            </div>
            <Switch
              checked={settings.emailOnNewOrder}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, emailOnNewOrder: checked })
              }
            />
          </div>
          <Separator />
          <Alert>
            <AlertDescription className="text-sm">
              Stripe keys are configured via NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY.
              Bank transfer details are managed in Company Settings.
            </AlertDescription>
          </Alerteader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: e.target.value })
                }
                placeholder="24"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-gray-500">
                Customers must verify email before accessing their account
              </p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, requireEmailVerification: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>Enable Rate Limiting</Label>
              <p className="text-sm text-gray-500">
                Protect against brute force attacks
              </p>
            </div>
            <Switch
              checked={settings.enableRateLimiting}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, enableRateLimiting: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Important:</strong> Most settings (email, payment, bank
          details) are configured via environment variables in{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code>.
          Changes here are for reference only. Update the .env.local file and
          restart the server to apply changes.
        </AlertDescription>
      </Alert>
    </div>
  );
}
