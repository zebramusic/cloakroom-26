import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { PageEditor } from "@/components/admin/site/PageEditor";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const { key } = await params;
  const canWrite = hasPermission(session.user.role, "site.write");
  const canPublish = hasPermission(session.user.role, "site.publish");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Page: {key}</h1>
        <p className="text-muted-foreground">
          Manage content blocks for this page
        </p>
      </div>

      <PageEditor pageKey={key} canWrite={canWrite} canPublish={canPublish} />
    </div>
  );
}
