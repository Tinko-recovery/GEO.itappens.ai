import Stripe from "stripe";

import { env } from "@/lib/env";
import { buildAbsoluteUrl } from "@/lib/utils";

import type { AuditPlanKey, CheckoutProvider } from "@/lib/audit/types";

export const AUDIT_PRODUCTS: Record<
  Exclude<AuditPlanKey, "free">,
  { label: string; description: string; amount: number; crawlDepth: number }
> = {
  starter: {
    label: "Starter Deep Audit",
    description: "Commercial GEO + SEO audit with competitor, technical, and citation baseline.",
    amount: 299900,
    crawlDepth: 20,
  },
  growth: {
    label: "Growth Deep Audit",
    description: "Expanded crawl, keyword universe, competitor benchmark, and monetization roadmap.",
    amount: 499900,
    crawlDepth: 50,
  },
  authority: {
    label: "Authority Deep Audit",
    description: "Full premium branded report with deep crawl, backlink summary, and retainership roadmap.",
    amount: 799900,
    crawlDepth: 100,
  },
};

export function resolvePaymentProvider(): CheckoutProvider {
  return env.PAYMENT_PROVIDER;
}

export function getPlanConfig(plan: Exclude<AuditPlanKey, "free">) {
  return AUDIT_PRODUCTS[plan];
}

export function getCheckoutUrls(shareToken: string) {
  return {
    successUrl: buildAbsoluteUrl(`/audit/success?token=${shareToken}`),
    cancelUrl: buildAbsoluteUrl("/audit?checkout=cancelled"),
  };
}

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(env.STRIPE_SECRET_KEY);
}
