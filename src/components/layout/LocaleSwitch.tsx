"use client";

import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useTransition } from "react";

interface LocaleSwitchProps {
  currentLocale: string;
  variant?: "dropdown" | "toggle";
}

export function LocaleSwitch({
  currentLocale,
  variant = "dropdown",
}: LocaleSwitchProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale: string) => {
    startTransition(() => {
      // Build the new path
      let newPath: string;
      
      if (newLocale === "en") {
        // Switch to English: add /en prefix if not already there
        newPath = pathname.startsWith('/en') ? pathname : `/en${pathname}`;
      } else {
        // Switch to Romanian: remove /en prefix if present
        newPath = pathname.startsWith('/en') 
          ? pathname.substring(3) || '/'
          : pathname;
      }
      
      window.location.href = newPath;
    });
  };

  if (variant === "toggle") {
    return (
      <div className="flex items-center rounded-lg border">
        <button
          onClick={() => handleSwitch("ro")}
          disabled={currentLocale === "ro" || isPending}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLocale === "ro"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          RO
        </button>
        <button
          onClick={() => handleSwitch("en")}
          disabled={currentLocale === "en" || isPending}
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
      onClick={() => handleSwitch(currentLocale === "ro" ? "en" : "ro")}
      disabled={isPending}
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
