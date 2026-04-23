import { after, NextResponse } from "next/server";
import Stripe from "stripe";
import { AuditStatus, PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendAuditReceiptEmail } from "@/lib/email";
import { getPlanConfig, getStripeClient } from "@/lib/payments/provider";

import { runAuditJob } from "@/lib/audit/engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret is missing." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const auditId = session.metadata?.auditId;

    if (auditId) {
      const audit = await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: AuditStatus.PAYMENT_CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          checkoutSessionId: session.id,
          paymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          paymentCompletedAt: new Date(),
          events: {
            create: {
              type: "payment.stripe_confirmed",
              payload: {
                sessionId: session.id,
                paymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : null,
              },
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
    }
  }

  return NextResponse.json({ received: true });
}
