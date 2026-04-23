import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

/**
 * Middleware handling:
 * 1. Hostname redirection (itappens.ai -> www.itappens.ai)
 * 2. Admin Basic Auth
 * 3. Auth0 v4 authentication (handling /auth routes)
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // 1. Hostname redirection
  if (host === "itappens.ai") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "www.itappens.ai";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  // 2. Admin Basic Auth
  if (pathname.startsWith("/admin")) {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "change-me";
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="itappens.ai admin"' },
      });
    }

    const decoded = atob(authHeader.replace("Basic ", ""));
    const [providedUser, providedPassword] = decoded.split(":");

    if (providedUser !== username || providedPassword !== password) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="itappens.ai admin"' },
      });
    }
  }

  // 3. Auth0 v4 Middleware
  // This automatically handles the built-in auth routes (/auth/login, /auth/callback, etc.)
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, llms.txt (etc)
     * - images, icons (.png, .svg, .ico)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms.*\\.txt|.*\\.png|.*\\.svg|.*\\.ico).*)",
  ],
};
