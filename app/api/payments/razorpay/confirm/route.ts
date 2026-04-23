import { after, NextResponse } from "next/server";
import { AuditStatus, PaymentStatus } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { sendAuditReceiptEmail } from "@/lib/email";
import { getPlanConfig } from "@/lib/payments/provider";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

import { runAuditJob } from "@/lib/audit/engine";

const requestSchema = z.object({
  auditId: z.string(),
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid confirmation payload." }, { status: 400 });
  }

  const verified = verifyRazorpaySignature({
    orderId: parsed.data.orderId,
    paymentId: parsed.data.paymentId,
    signature: parsed.data.signature,
  });

  if (!verified) {
    return NextResponse.json({ error: "Razorpay signature verification failed." }, { status: 400 });
  }

  const audit = await prisma.audit.update({
    where: { id: parsed.data.auditId },
    data: {
      status: AuditStatus.PAYMENT_CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      paymentOrderId: parsed.data.orderId,
      paymentId: parsed.data.paymentId,
      paymentCompletedAt: new Date(),
      events: {
        create: {
          type: "payment.razorpay_confirmed",
          payload: { orderId: parsed.data.orderId, paymentId: parsed.data.paymentId },
        },
      },
    },
  });

  const planConfig = getPlanConfig(audit.plan.toLowerCase() as "starter" | "growth" | "authority");
  await sendAuditReceiptEmail({
    email: audit.email,
    siteUrl: audit.siteUrl,
    planLabel: planConfig.label,
    amount: audit.amount,
  });

  after(async () => {
    await runAuditJob(audit.id);
  });

  return NextResponse.json({ ok: true, shareToken: audit.shareToken });
}
