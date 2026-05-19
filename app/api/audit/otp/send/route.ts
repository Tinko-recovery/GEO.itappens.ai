import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOTPEmail } from "@/lib/email";
import crypto from "node:crypto";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Generate a 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert the OTP in the database
    await prisma.emailOTP.upsert({
      where: { email: parsed.data.email },
      update: {
        otp,
        expiresAt,
        verified: false,
      },
      create: {
        email: parsed.data.email,
        otp,
        expiresAt,
        verified: false,
      },
    });

    // Send the OTP via email
    await sendOTPEmail({ email: parsed.data.email, otp });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[OTP Send Error]", error);
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 });
  }
}
