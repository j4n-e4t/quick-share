import { NextRequest, NextResponse } from "next/server";
import { env } from "./env";

export const config = {
  matcher: ["/", "/s/:slug"],
};

export default function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  if (!basicAuth) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="User Visible Realm"',
      },
    });
  }
  const authValue = basicAuth.split(" ")[1];
  if (authValue) {
    const [user, pwd] = atob(authValue).split(":");
    if (user === env.BASIC_AUTH_USERNAME && pwd === env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="User Visible Realm"',
    },
  });
}
