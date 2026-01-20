"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocaleSwitchProps {
  currentLocale: string;
  variant?: "dropdown" | "toggle";
}

export function LocaleSwitch({
  currentLocale,
  variant = "dropdown",
}: LocaleSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = currentLocale === "ro" ? "en" : "ro";
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  if (variant === "toggle") {
    return (
      <div className="flex items-center rounded-lg border">
        <button
          onClick={() => currentLocale !== "ro" && switchLocale()}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === "ro"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          RO
        </button>
        <button
          onClick={() => currentLocale !== "en" && switchLocale()}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === "en"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchLocale}
      title={currentLocale === "ro" ? "Switch to English" : "Schimbă în Română"}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">
        {currentLocale === "ro" ? "Switch to English" : "Schimbă în Română"}
      </span>
    </Button>
  );
}
