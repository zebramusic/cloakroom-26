import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PortfolioForm } from "@/components/admin/portfolio/PortfolioForm";

export default async function NewPortfolioPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "portfolio.create")) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/portfolio">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create Portfolio Item</h1>
        <p className="text-muted-foreground">
          Add a new event or project to your portfolio showcase
        </p>
      </div>

      <PortfolioForm mode="create" userRole={session.user.role} />
    </div>
  );
}
