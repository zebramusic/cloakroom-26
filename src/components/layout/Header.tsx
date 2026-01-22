"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, ShoppingCart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LocaleSwitch } from "./LocaleSwitch";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/lib/store/cart.store";
import { useSession } from "next-auth/react";

interface HeaderProps {
  locale: string;
  transparent?: boolean;
}

export function Header({ locale, transparent = false }: HeaderProps) {
  const t = useTranslations("nav");
  const itemCount = useCartStore((state) => state.getItemCount());
  const { data: session } = useSession();
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  // Show admin link if user has admin role
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "manager";

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      setKeySequence((prev) => {
        const newSequence = [...prev, key].slice(-3); // Keep only last 3 keys

        // Check if the sequence is 'adm'
        if (newSequence.join("") === "adm") {
          setShowAdminLink(true);
          // Hide after 10 seconds
          setTimeout(() => setShowAdminLink(false), 10000);
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  const navItems = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/servicii`, label: t("services") },
    { href: `/${locale}/industrii`, label: t("industries") },
    { href: `/${locale}/preturi`, label: t("pricing") },
    { href: `/${locale}/despre`, label: t("about") },
    { href: `/${locale}/parteneri`, label: t("partners") },
    { href: `/${locale}/shop`, label: t("shop") },
    { href: `/${locale}/intrebari`, label: t("faq") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        transparent
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">G</span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            Garderobă Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium lg:flex">
          {navItems.slice(1, 7).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Admin Link - visible when logged in as admin or via ADM keyboard shortcut */}
          {(showAdminLink || isAdmin) && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="animate-in fade-in slide-in-from-top-2 duration-300 border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}

          <LocaleSwitch currentLocale={locale} variant="dropdown" />

          <Link href={`/${locale}/shop/cos`}>
            <Button variant="ghost" size="icon" className="relative">
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Coș</span>
            </Button>
          </Link>

          <Link href="/account" className="hidden sm:block">
            <Button variant="outline">
              {locale === "ro" ? "Contul Meu" : "My Account"}
            </Button>
          </Link>

          <Link href={`/${locale}/cere-oferta`} className="hidden sm:block">
            <Button>{locale === "ro" ? "Cere Ofertă" : "Request Quote"}</Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Meniu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-4" />
                <Link href="/account">
                  <Button variant="outline" className="w-full mb-2">
                    {locale === "ro" ? "Contul Meu" : "My Account"}
                  </Button>
                </Link>
                <Link href={`/${locale}/cere-oferta`}>
                  <Button className="w-full">
                    {locale === "ro" ? "Cere Ofertă" : "Request Quote"}
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
