import Link from "next/link";
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import { SiteNavigation } from "@/lib/models/site";

interface DynamicHeaderProps {
  locale: string;
}

async function getNavigation(locale: string) {
  return unstable_cache(
    async () => {
      await connectDB();
      const nav = await SiteNavigation.findOne({
        key: "main",
        status: "published",
      })
        .sort({ publishedAt: -1 })
        .lean();

      if (!nav) return [];

      const items =
        locale === "en" && nav.localeData.en?.items
          ? nav.localeData.en.items
          : nav.localeData.ro.items;

      return items.filter((item: any) => item.visibility === "public");
    },
    [`nav-${locale}`],
    {
      tags: ["site-navigation", `site-navigation-main`],
      revalidate: 3600,
    },
  )();
}

export async function DynamicHeader({ locale }: DynamicHeaderProps) {
  const navItems = await getNavigation(locale);

  if (!navItems || navItems.length === 0) {
    // Fallback to default navigation
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href={locale === "en" ? "/en" : "/"}
              className="font-bold text-xl"
            >
              Cloakroom Pro
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
