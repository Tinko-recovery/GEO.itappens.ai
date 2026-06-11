import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/**
 * Middleware handling:
 * 1. Hostname redirection (itappens.ai -> www.itappens.ai)
 * 2. NextAuth for /admin
 */
export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // 1. Malicious Bot Blocking (Runs first to prevent serving 308 redirects to bots)
  const blockedPaths = ["/wp-", "/wordpress", "/.env", "/.git"];
  if (blockedPaths.some(p => pathname.startsWith(p))) {
    return new NextResponse("Forbidden - Bot scanning detected", { status: 403 });
  }

  // 2. Hostname redirection
  const forwardedHost = request.headers.get("x-forwarded-host");
  const actualHost = forwardedHost || host;
  
  if (actualHost === "itappens.ai" || actualHost.startsWith("itappens.ai:")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "www.itappens.ai";
    redirectUrl.protocol = "https:";
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 308);
  }

  // 3. NextAuth v5 for /admin
  if (pathname.startsWith("/admin")) {
    const { auth } = require("./lib/auth");
    
    // Auth.js middleware handler
    const authMiddleware = auth((req: any) => {
      // The authorized callback in lib/auth.ts handles the actual redirect logic
      return NextResponse.next();
    });
    
    return authMiddleware(request as any, {} as any);
  }

  return NextResponse.next();
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
