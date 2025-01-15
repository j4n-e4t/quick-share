import { CopyShareLinkButton } from "@/components/copy-share-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Share } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { CopyIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;
  const share = await api.share.get({
    code: params.code,
    is_viewed: true,
  });
  if (!share) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{share?.title}</CardTitle>
          <CardDescription>
            {new Date(share?.createdAt).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap break-words rounded-md bg-muted p-4">
            {share?.content?.startsWith("http") ? (
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
        <CardFooter className="flex justify-end">
          <CopyShareLinkButton share={share} />
        </CardFooter>
      </Card>
    </main>
  );
}
