import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { NavigationManager } from "@/components/admin/site/NavigationManager";

export const dynamic = "force-dynamic";

export default async function SiteNavigationPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const canWrite = hasPermission(session.user.role, "site.write");
  const canPublish = hasPermission(session.user.role, "site.publish");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Navigation</h1>
        <p className="text-muted-foreground">
          Manage header and footer navigation menus
        </p>
      </div>

      <NavigationManager canWrite={canWrite} canPublish={canPublish} />
    </div>
  );
}
