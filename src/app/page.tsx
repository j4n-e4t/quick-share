import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateShareForm } from "@/components/create-share-form";
import { OpenShareForm } from "@/components/open-share-form";
export default async function Page() {
  return (
    <main className="grid h-[calc(100vh-8rem)] w-full grid-cols-1 items-center gap-4 p-4 md:grid-cols-2 md:justify-center md:gap-10">
      <div className="flex h-full w-full flex-col items-center justify-start md:justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Got a code?</CardTitle>
          </CardHeader>
          <CardContent>
            <OpenShareForm />
          </CardContent>
        </Card>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-start md:justify-center">
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
