import { auth } from "@/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation, FileText, Image, Settings, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SiteDashboardPage() {
  const session = await auth();

  if (!session || !hasPermission(session.user.role, "site.read")) {
    redirect("/admin/login");
  }

  const modules = [
    {
      title: "Hero Settings",
      description: "Edit hero text and background images",
      icon: Settings,
      href: "/admin/site/settings",
      permission: "site.write" as const,
    },
    {
      title: "Company Settings",
      description: "Manage company info, contact details & social networks",
      icon: Building2,
      href: "/admin/site/company-settings",
      permission: "site.write" as const,
    },
    {
      title: "Navigation",
      description: "Manage header and footer navigation",
      icon: Navigation,
      href: "/admin/site/navigation",
      permission: "site.read" as const,
    },
    {
      title: "Pages",
      description: "Edit page content with blocks",
      icon: FileText,
      href: "/admin/site/pages",
      permission: "site.read" as const,
    },
    {
      title: "Media Library",
      description: "Upload and manage images",
      icon: Image,
      href: "/admin/site/media",
      permission: "site.media" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Builder</h1>
        <p className="text-muted-foreground">
          Manage your website content, navigation, and media
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          const hasAccess = hasPermission(session.user.role, module.permission);

          return (
            <Link
              key={module.href}
              href={hasAccess ? module.href : "#"}
              className={!hasAccess ? "pointer-events-none opacity-50" : ""}
            >
              <div className="border rounded-lg p-6 hover:border-primary transition-colors h-full">
                <Icon className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {module.description}
                </p>
                {hasAccess && (
                  <Button variant="ghost" className="mt-4 p-0 h-auto">
                    Manage →
                  </Button>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
