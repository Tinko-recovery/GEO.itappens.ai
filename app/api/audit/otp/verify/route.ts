import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const record = await prisma.emailOTP.findUnique({
      where: { email: parsed.data.email },
    });

    if (!record) {
      return NextResponse.json({ error: "No OTP requested for this email." }, { status: 400 });
    }

    if (record.otp !== parsed.data.otp) {
      return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired. Request a new one." }, { status: 400 });
    }

    // Mark as verified
    await prisma.emailOTP.update({
      where: { email: parsed.data.email },
      data: { verified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[OTP Verify Error]", error);
    return NextResponse.json({ error: "Failed to verify OTP." }, { status: 500 });
  }
}
