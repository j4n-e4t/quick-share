import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateShareForm } from "@/components/create-share-form";
import { OpenShareForm } from "@/components/open-share-form";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Quick Share",
  description: "Share something quickly",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Quick Share",
    description: "Share something quickly",
    type: "website",
    siteName: "Quick Share",
    url: "https://share.dns64.de",
    images: [{ url: "https://share.dns64.de/api/og" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Share",
    description: "Share something quickly",
    images: [{ url: "https://share.dns64.de/api/og" }],
  },
};

export default async function Page() {
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
