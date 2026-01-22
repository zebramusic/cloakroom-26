import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-purple-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-gray-600">This admin page doesn't exist.</p>
        </div>

        <Button asChild size="lg" className="gap-2">
          <Link href="/admin">
            <LayoutDashboard className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
