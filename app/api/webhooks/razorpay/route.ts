import { after, NextResponse } from "next/server";
import { AuditStatus, PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { verifyRazorpayWebhook } from "@/lib/payments/razorpay";

import { runAuditJob } from "@/lib/audit/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
        };
      };
    };
  };

  if (payload.event === "payment.captured") {
    const orderId = payload.payload?.payment?.entity?.order_id;
    const paymentId = payload.payload?.payment?.entity?.id;

    if (orderId) {
      const audit = await prisma.audit.update({
        where: { paymentOrderId: orderId },
        data: {
          status: AuditStatus.PAYMENT_CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          paymentId,
        },
      });

      after(async () => {
        await runAuditJob(audit.id);
      });
    }
  }

  return NextResponse.json({ received: true });
}
