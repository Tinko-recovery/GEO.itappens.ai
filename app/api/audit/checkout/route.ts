import crypto from "node:crypto";

import { after, NextResponse } from "next/server";
import { AuditPlan, AuditStatus, PaymentProvider, PaymentStatus } from "@prisma/client";
import { z } from "zod";

import { verifyCaptcha } from "@/lib/captcha";
import { prisma } from "@/lib/db";
import { sendInternalLeadAlert } from "@/lib/email";
import { assertRateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { normalizeSiteUrl, sha256 } from "@/lib/utils";
import { getCheckoutUrls, getPlanConfig, getStripeClient, resolvePaymentProvider } from "@/lib/payments/provider";
import { getRazorpayClient } from "@/lib/payments/razorpay";

const requestSchema = z.object({
  siteUrl: z.string().url().or(z.string().min(4)),
  email: z.string().email(),
  targetKeywords: z.array(z.string()).default([]),
  captchaToken: z.string(),
  captchaAnswer: z.string(),
  plan: z.enum(["starter", "growth", "authority"]),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (!verifyCaptcha(parsed.data.captchaToken, parsed.data.captchaAnswer)) {
    return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
  }

  let siteUrl: string;
  try {
    siteUrl = normalizeSiteUrl(parsed.data.siteUrl);
  } catch {
    return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });
  }
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const ipHash = await sha256(ip);
  const limit = await assertRateLimit(`paid:${ipHash}`, 6, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json({ error: "Too many payment attempts from this IP. Try again later." }, { status: 429 });
  }

  const shareToken = crypto.randomBytes(16).toString("base64url");
  const provider = resolvePaymentProvider();
  const planConfig = getPlanConfig(parsed.data.plan);
  const { successUrl, cancelUrl } = getCheckoutUrls(shareToken);

  const audit = await prisma.audit.create({
    data: {
      siteUrl,
      normalizedDomain: new URL(siteUrl).hostname.replace(/^www\./, ""),
      email: parsed.data.email,
      targetKeywords: parsed.data.targetKeywords.slice(0, 10),
      shareToken,
      plan: AuditPlan[parsed.data.plan.toUpperCase() as keyof typeof AuditPlan],
      status: AuditStatus.AWAITING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      paymentProvider: provider === "stripe" ? PaymentProvider.STRIPE : PaymentProvider.RAZORPAY,
      crawlDepth: planConfig.crawlDepth,
      amount: planConfig.amount,
      submittedIpHash: ipHash,
      captchaVerifiedAt: new Date(),
      events: {
        create: {
          type: "audit.checkout_started",
          payload: { plan: parsed.data.plan, provider },
        },
      },
    },
  });

  await sendInternalLeadAlert({
    email: parsed.data.email,
    siteUrl,
    planLabel: planConfig.label,
    targetKeywords: parsed.data.targetKeywords,
  });

  if (provider === "stripe") {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: parsed.data.email,
      metadata: {
        auditId: audit.id,
        shareToken,
        siteUrl,
        plan: parsed.data.plan,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: planConfig.amount,
            product_data: {
              name: planConfig.label,
              description: planConfig.description,
            },
          },
        },
      ],
    });

    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        checkoutSessionId: session.id,
      },
    });

    return NextResponse.json({
      provider: "stripe",
      checkoutUrl: session.url,
      auditId: audit.id,
    });
  }

  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: planConfig.amount,
    currency: "INR",
    receipt: audit.id,
    notes: {
      auditId: audit.id,
      siteUrl,
      email: parsed.data.email,
    },
  });

  await prisma.audit.update({
    where: { id: audit.id },
    data: {
      paymentOrderId: order.id,
    },
  });

  after(async () => {
    if (!env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.warn("Razorpay key missing for audit", audit.id);
    }
  });

  return NextResponse.json({
    provider: "razorpay",
    keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    auditId: audit.id,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      description: planConfig.label,
    },
  });
}
