import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Page() {
    const jar = await cookies();
    const verified = jar.get("verified");
    if (verified?.value === "true") {
        return redirect("/");
    }

    async function handleVerification(formData: FormData) {
        "use server";
        const password = formData.get("password") as string;
        if (!password || password !== env.BASIC_AUTH_PASSWORD) {
            return;
        }
        const jar = await cookies();
        jar.set({
            name: 'verified',
            value: 'true',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        })    
        redirect("/")
    }
    return (
        <div className="flex h-full w-full flex-col items-center justify-end">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter the password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={handleVerification}>
              <Input
                name="password"
                type="password"
                required
                autoComplete="off"
                spellCheck="false"
              />

              <Button type="submit" className="flex w-full items-center gap-2">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
}