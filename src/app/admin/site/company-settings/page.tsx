import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import CompanySettingsEditor from "@/components/admin/site/CompanySettingsEditor";

export default async function CompanySettingsPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const canEdit = hasPermission(session.user.role, "site.write");

  if (!canEdit) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            You don't have permission to edit company settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">
          Manage company information displayed throughout the website
        </p>
      </div>

      <CompanySettingsEditor />
    </div>
  );
}
