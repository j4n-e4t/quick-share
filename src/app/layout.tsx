import NavBar from "@/components/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head></head>
      <body className="bg-background h-screen">
        <div className="mx-auto h-full max-w-5xl">
          <NavBar />
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
