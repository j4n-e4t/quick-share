import { Suspense } from "react";
import {
  ShareViewCard,
  ShareViewCardSkeleton,
} from "@/components/share-view-card";

export default function Page({ params }: { params: { code: string } }) {
  return (
    <main className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Suspense fallback={<ShareViewCardSkeleton />}>
        <ShareViewCard code={params.code} />
      </Suspense>
    </main>
  );
}
