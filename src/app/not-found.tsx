import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-purple-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Pagină negăsită
          </h2>
          <p className="text-gray-600">Pagina pe care o cauți nu există.</p>
        </div>

        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-5 w-5" />
            Înapoi la pagina principală
          </Link>
        </Button>
      </div>
    </div>
  );
}
