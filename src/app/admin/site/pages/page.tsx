import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { PageList } from "@/components/admin/site/PageList";

export default async function SitePagesPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const canWrite = hasPermission(session.user.role, "site.write");
  const canPublish = hasPermission(session.user.role, "site.publish");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Pages</h1>
        <p className="text-muted-foreground">Manage page content with blocks</p>
      </div>

      <PageList canWrite={canWrite} canPublish={canPublish} />
    </div>
  );
}
