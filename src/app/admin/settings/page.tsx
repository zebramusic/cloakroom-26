import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
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
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Settings management functionality will be implemented in Sprint 10.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
