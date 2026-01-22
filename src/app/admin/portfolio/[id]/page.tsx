import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PortfolioForm } from "@/components/admin/portfolio/PortfolioForm";
import connectDB from "@/lib/mongodb";
import { PortfolioItem } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "portfolio.update")) {
    redirect("/admin/login");
  }

  // Fetch portfolio item
  await connectDB();
  const item = await PortfolioItem.findById(id).lean();

  if (!item) {
    notFound();
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
        <h1 className="text-3xl font-bold">Edit Portfolio Item</h1>
        <p className="text-muted-foreground">
          Update portfolio item details and manage images
        </p>
      </div>

      <PortfolioForm
        mode="edit"
        itemId={id}
        initialData={JSON.parse(JSON.stringify(item))}
        userRole={session.user.role}
      />
    </div>
  );
}
