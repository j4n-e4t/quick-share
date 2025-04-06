import { Suspense } from "react";
import { ShareViewCardSkeleton } from "@/components/share-view-card";
import { CopyShareContentButton } from "@/components/copy-share-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { decrypt } from "@/lib/crypto";
import { Share } from "@/server/api/routers/share";
import { redis } from "@/server/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const runtime = "edge";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  let share = (await redis.get(`share:${params.id}`)) as Share | null;
  if (!share) {
    notFound();
  }

  share.content = await decrypt(share.content);
  share.title = share.title ? await decrypt(share.title) : null;

  return (
    <main className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Suspense fallback={<ShareViewCardSkeleton />}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {share.title ? (
                share.title
              ) : (
                <span className="text-muted-foreground">Untitled</span>
              )}
            </CardTitle>
            <CardDescription>
              {new Date(share.created_at).toLocaleDateString("en-US", {
                dateStyle: "long",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap break-words rounded-md bg-muted p-4">
              {share.content.startsWith("http") ? (
                <a
                  href={share.content}
                  target="blank"
                  className="text-primary underline"
                >
                  {share.content}
                </a>
              ) : (
                share.content
              )}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
            </Link>
            <CopyShareContentButton
              share={{
                id: share.id,
                code: null,
                title: share.title,
                content: share.content,
                created_at: new Date(share.created_at),
                expires_at: new Date(share.expires_at),
              }}
            />
          </CardFooter>
        </Card>
      </Suspense>
    </main>
  );
}
