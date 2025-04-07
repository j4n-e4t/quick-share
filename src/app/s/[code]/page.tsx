import { Suspense } from "react";
import {
  ShareViewCard,
  ShareViewCardSkeleton,
} from "@/components/share-view-card";

export default async function Page({ params }: { params: { code: string } }) {
  const { code } = await params;
  return (
    <main className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Suspense fallback={<ShareViewCardSkeleton />}>
        <ShareViewCard code={code} />
      </Suspense>
    </main>
  );
}
