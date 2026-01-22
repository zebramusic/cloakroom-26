"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  Mail,
  CreditCard,
  Building2,
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // Company Information
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Garderobă Pro",
    companyEmail: process.env.EMAIL_FROM || "",
    companyPhone: process.env.COMPANY_PHONE || "",
    companyAddress: process.env.COMPANY_ADDRESS || "",
    companyCUI: process.env.COMPANY_CUI || "",
    companyRegCom: process.env.COMPANY_REG_COM || "",

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

    // Bank Transfer
    bankName: process.env.BANK_NAME || "",
    bankIBAN: process.env.BANK_IBAN || "",
    bankSwift: process.env.BANK_SWIFT || "",

    // Notifications
    emailOnNewOrder: true,
    emailOnNewQuote: true,
    emailOnNewMessage: true,

    // Security
    sessionTimeout: "24",
    requireEmailVerification: true,
    enableRateLimiting: true,
  });

  const handleSave = () => {
    // Note: These settings are read from .env.local
    // This page is for viewing/documentation only
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details displayed on invoices and emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) =>
                  setSettings({ ...settings, companyEmail: e.target.value })
                }
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone Number</Label>
              <Input
                id="companyPhone"
                value={settings.companyPhone}
                onChange={(e) =>
                  setSettings({ ...settings, companyPhone: e.target.value })
                }
                placeholder="+40 XXX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCUI">CUI (Tax ID)</Label>
              <Input
                id="companyCUI"
                value={settings.companyCUI}
                onChange={(e) =>
                  setSettings({ ...settings, companyCUI: e.target.value })
                }
                placeholder="ROXXXXXXXX"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyAddress}
              onChange={(e) =>
                setSettings({ ...settings, companyAddress: e.target.value })
              }
              placeholder="Street, City, County, Postal Code"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            SMTP settings for sending emails. Configured in .env.local
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
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
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>New Quote Requests</Label>
              <p className="text-sm text-gray-500">
                Get notified when a customer requests a quote
              </p>
            </div>
            <Switch
              checked={settings.emailOnNewQuote}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, emailOnNewQuote: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label>New Support Messages</Label>
              <p className="text-sm text-gray-500">
                Get notified when customers send support messages
              </p>
            </div>
            <Switch
              checked={settings.emailOnNewMessage}
              onCheckedChange={(checked: boolean) =>
                setSettings({ ...settings, emailOnNewMessage: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security and authentication options
          </CardDescription>
        </CardHeader>
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
