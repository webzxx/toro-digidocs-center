import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
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

