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
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = () => {
    let newPath: string;

    if (currentLocale === "ro") {
      newPath = pathname === "/" ? "/en" : `/en${pathname}`;
    } else {
      if (pathname === "/en") {
        newPath = "/";
      } else if (pathname.startsWith("/en/")) {
        newPath = pathname.substring(3);
      } else {
        newPath = pathname;
      }
    }

    window.location.href = newPath;
  };

  if (variant === "toggle") {
    return (
      <div className="flex items-center rounded-lg border">
        <button
          onClick={() => currentLocale !== "ro" && handleSwitch()}
          disabled={currentLocale === "ro"}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === "ro"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          RO
        </button>
        <button
          onClick={() => currentLocale !== "en" && handleSwitch()}
          disabled={currentLocale === "en"}
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
    <button
      onClick={handleSwitch}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 w-9"
      title={currentLocale === "ro" ? "Switch to English" : "Schimbă în Română"}
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">
        {currentLocale === "ro" ? "Switch to English" : "Schimbă în Română"}
      </span>
    </button>
  );
}
