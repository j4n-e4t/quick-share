import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/"],
};

export default function middleware(req: NextRequest) {
  const jar = req.cookies;
  const verified = jar.get("verified");
  if (verified?.value  === "true") {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL("/verify", req.url));
}
