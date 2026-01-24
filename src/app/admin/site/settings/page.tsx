import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { HeroSettingsEditor } from "@/components/admin/site/HeroSettingsEditor";

export const dynamic = "force-dynamic";

export default async function HeroSettingsPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const canWrite = hasPermission(session.user.role, "site.write");

  if (!canWrite) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hero Settings</h1>
          <p className="text-muted-foreground">
            You don't have permission to edit hero settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero Settings</h1>
        <p className="text-muted-foreground">
          Edit hero text and background images for all pages
        </p>
      </div>

      <HeroSettingsEditor />
    </div>
  );
}
