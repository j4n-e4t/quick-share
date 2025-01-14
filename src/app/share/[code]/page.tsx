import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;
  try {
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
              {share?.createdAt.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-md bg-muted p-4">
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
        </Card>
      </main>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    redirect("/");
  }
}
