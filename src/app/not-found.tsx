import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <div className="mt-4 animate-bounce text-7xl">🔍</div>
      <Link href="/">
        <Button>Go back to home</Button>
      </Link>
    </div>
  );
}
