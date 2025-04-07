import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/s/:slug"],
};

export default function middleware(req: NextRequest) {
  const jar = req.cookies;
  const verified = jar.get("verified");
  if (verified?.value  === "true") {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/verify", req.url));
}
