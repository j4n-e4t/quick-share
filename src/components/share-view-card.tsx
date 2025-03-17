import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyShareContentButton } from "./copy-share-button";
import { api } from "@/trpc/server";
import { Skeleton } from "./ui/skeleton";
import { notFound } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function ShareViewCard({ id }: { id: string }) {
  try {
    const share = await api.share.get({ id });

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{share.title}</CardTitle>
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
              id,
              code: null,
              title: share.title,
              content: share.content,
              created_at: new Date(share.created_at),
              expires_at: new Date(share.expires_at),
            }}
          />
        </CardFooter>
      </Card>
    );
  } catch (error) {
    notFound();
  }
}

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
