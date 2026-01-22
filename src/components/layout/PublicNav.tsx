import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicNav() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/ro" className="text-xl font-bold text-primary">
              Garderobă Pro
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/ro/shop"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/ro/despre"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/ro/contact"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Contact
            </Link>
            <Link href="/account/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
