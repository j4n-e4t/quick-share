import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateShareForm } from "@/components/create-share-form";
import { OpenShareForm } from "@/components/open-share-form";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="items- grid h-[calc(100vh-8rem)] w-full gap-4 md:gap-8">
      <div className="flex h-full w-full flex-col items-center justify-end">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Got a code?</CardTitle>
          </CardHeader>
          <CardContent>
            <OpenShareForm />
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
