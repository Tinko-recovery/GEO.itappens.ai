import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === "itappens.ai") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "www.itappens.ai";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}
