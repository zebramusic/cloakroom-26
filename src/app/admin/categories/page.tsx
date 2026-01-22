import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "products.view")) {
    redirect("/admin/login");
  }

  const canWrite = hasPermission(session.user.role, "products.create");
  const canDelete = hasPermission(session.user.role, "products.delete");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Categories</h1>
        <p className="text-muted-foreground mt-2">
          Manage product categories for your shop
        </p>
      </div>

      <CategoriesManager canWrite={canWrite} canDelete={canDelete} />
    </div>
  );
}
