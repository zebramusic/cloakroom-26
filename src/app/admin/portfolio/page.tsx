import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PortfolioDataTable } from "@/components/admin/portfolio/PortfolioDataTable";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    !session.user.role ||
    !hasPermission(session.user.role, "portfolio.view")
  ) {
    redirect("/admin/login");
  }

  const canCreate = hasPermission(session.user.role, "portfolio.create");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage portfolio items and event showcases
          </p>
        </div>
        {canCreate && (
          <Link href="/admin/portfolio/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </Link>
        )}
      </div>

      <PortfolioDataTable userRole={session.user.role} />
    </div>
  );
}
