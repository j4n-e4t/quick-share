import ShareViewCard from "@/components/share-view-card";
import { Suspense } from "react";
import { ShareViewCardSkeleton } from "@/components/share-view-card";
export default async function Page(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<ShareViewCardSkeleton />}>
        <ShareViewCard code={params.code} />
      </Suspense>
    </main>
  );
}
