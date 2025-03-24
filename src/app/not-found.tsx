import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
        We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>
        <Button asChild className="px-6 py-5">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

