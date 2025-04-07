import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyShareContentButton } from "./copy-share-button";
import { Skeleton } from "./ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export function ShareViewCardSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <CopyShareContentButton share={null} />
      </CardFooter>
    </Card>
  );
}

export async function ShareViewCard({ code }: { code: string }) {
  const share = await api.share.get({ code });
  if (!share) {
    redirect("/");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {share?.title ? (
            share.title
          ) : (
            <span className="text-muted-foreground">Untitled</span>
          )}
        </CardTitle>
        <CardDescription>
          {share?.created_at &&
            new Date(share.created_at).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="bg-secondary-background rounded-md p-4 break-words whitespace-pre-wrap">
          {share?.content.startsWith("http") ? (
            <a
              href={share.content}
              target="blank"
              className="text-primary underline"
            >
              {share.content}
            </a>
          ) : (
            share?.content
          )}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/">
          <Button>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        {share && (
          <CopyShareContentButton
            share={{
              id: share?.id ?? "",
              code: null,
              title: share?.title ?? "",
              content: share?.content ?? "",
              created_at: new Date(share?.created_at ?? ""),
              expires_at: new Date(share?.created_at ?? ""),
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
}
