import ShareViewCard from "@/components/share-view-card";
import { Suspense } from "react";
import { ShareViewCardSkeleton } from "@/components/share-view-card";

export const runtime = "edge";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <main className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Suspense fallback={<ShareViewCardSkeleton />}>
        <ShareViewCard id={params.id} />
      </Suspense>
    </main>
  );
}
