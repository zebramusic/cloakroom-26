"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Menu,
  LogOut,
  User,
  Shield,
  MessageSquare,
  Image,
  Globe,
  FolderTree,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    permission: undefined, // Available to all
  },
  {
    name: "Quotes",
    href: "/admin/quotes",
    icon: FileText,
    permission: "quotes.view" as const,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: "orders.view" as const,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    permission: "products.view" as const,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    permission: "products.view" as const,
  },
  {
    name: "Portfolio",
    href: "/admin/portfolio",
    icon: Image,
    permission: "portfolio.view" as const,
  },
  {
    name: "Partners",
    href: "/admin/partners",
    icon: Users,
    permission: "partners.view" as const,
  },
  {
    name: "Site Builder",
    href: "/admin/site",
    icon: Globe,
    permission: "site.read" as const,
  },
  {
    name: "Support",
    href: "/admin/support",
    icon: MessageSquare,
    permission: "support.view" as const,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Shield,
    permission: "users.manage" as const,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User,
    permission: undefined, // Available to all
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: "settings.update" as const,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, signOut } = useAuth();
  const { hasPermission } = usePermissions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "editor":
        return "secondary";
      case "support":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition">
            Garderobă
          </h1>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-purple-700">
                {getInitials(user.name || "")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || "User"}
              </p>
              <Badge
                variant={getRoleBadgeVariant(role || "")}
                className="text-xs mt-1"
              >
                <Shield className="h-3 w-3 mr-1" />
                {role}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation
          .filter((item) => !item.permission || hasPermission(item.permission))
          .map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Profile & Logout */}
      {user && (
        <div className="p-4 border-t space-y-1">
          <Button
            onClick={() => router.push("/admin/profile")}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
