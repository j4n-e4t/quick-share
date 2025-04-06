import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateShareForm } from "@/components/create-share-form";
import { hashCode } from "@/lib/crypto";
import { redis } from "@/server/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon } from "lucide-react";

export const dynamic = "force-static";

export default function Page() {
  async function handleOpenShare(formData: FormData) {
    "use server";
    const code = formData.get("code") as string;
    if (!code || code.length !== 4) {
      return;
    }
    const id = (await redis.get(
      `codeHashToId:${await hashCode(code.toUpperCase())}`,
    )) as string;
    if (!id) {
      return;
    }
    redirect(`/s/${id}`);
  }
  return (
    <main className="items- grid h-[calc(100vh-8rem)] w-full gap-4 md:gap-8">
      <div className="flex h-full w-full flex-col items-center justify-end">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Got a code?</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={handleOpenShare}>
              <Input
                name="code"
                type="text"
                required
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                className="uppercase"
                placeholder="ABCD"
                minLength={4}
                maxLength={4}
              />

              <Button type="submit" className="flex w-full items-center gap-2">
                <ArrowRightIcon className="h-4 w-4" />
                Open share
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-start">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Share something</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateShareForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
