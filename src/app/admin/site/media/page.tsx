import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { MediaLibrary } from "@/components/admin/site/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function SiteMediaPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.media")) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">
          Upload and manage images for site content
        </p>
      </div>

      <MediaLibrary />
    </div>
  );
}
