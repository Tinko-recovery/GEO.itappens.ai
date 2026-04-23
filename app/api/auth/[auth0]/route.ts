import { auth0 } from "@/lib/auth0";

export const dynamic = 'force-dynamic';

export const GET = (req: any, ctx: any) => (auth0 as any).handleAuth()(req, ctx);
export const POST = (req: any, ctx: any) => (auth0 as any).handleAuth()(req, ctx);
