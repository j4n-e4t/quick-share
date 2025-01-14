import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreateShareForm } from "@/components/create-share-form";
import { OpenShareForm } from "@/components/open-share-form";

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-4 p-4 md:justify-center md:gap-10">
      <div className="flex w-full flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Share something</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateShareForm />
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md items-center justify-center gap-2">
          <Separator className="w-full" />
          <p className="whitespace-nowrap text-sm text-muted-foreground">or</p>
          <Separator className="w-full" />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Got a code?</CardTitle>
          </CardHeader>
          <CardContent>
            <OpenShareForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
