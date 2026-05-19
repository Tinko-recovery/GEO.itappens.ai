import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCaptcha } from "@/lib/captcha";
import { sendContactAlert } from "@/lib/email";
import { assertRateLimit } from "@/lib/rate-limit";
import { sha256 } from "@/lib/utils";

const requestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  siteUrl: z.string().min(4),
  industry: z.string().min(2),
  message: z.string().optional(),
  captchaToken: z.string(),
  captchaAnswer: z.string(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parsed = requestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    if (!verifyCaptcha(parsed.data.captchaToken, parsed.data.captchaAnswer)) {
      return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const ipHash = await sha256(ip);
    
    try {
      const limit = await assertRateLimit(`contact:${ipHash}`, 5, 60 * 60 * 1000);
      if (!limit.ok) {
        return NextResponse.json({ error: "Too many messages from this IP. Try again later." }, { status: 429 });
      }
    } catch {
      // gracefully bypass if redis connection fails
    }

    await sendContactAlert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      siteUrl: parsed.data.siteUrl,
      industry: parsed.data.industry,
      message: parsed.data.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
