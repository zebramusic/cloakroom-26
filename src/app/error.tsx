"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">Eroare</h1>
          <p className="text-gray-600">
            A apărut o problemă. Te rugăm să încerci din nou.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="h-5 w-5" />
            Încearcă din nou
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Pagina principală
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
