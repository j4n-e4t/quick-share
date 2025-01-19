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
        <CardFooter className="flex justify-end">
          <CopyShareContentButton share={share} />
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
