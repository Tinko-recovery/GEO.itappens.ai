import crypto from "node:crypto";

import Razorpay from "razorpay";

import { env } from "@/lib/env";

export function getRazorpayClient() {
  if (!env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured.");
  }

  return new Razorpay({
    key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export function verifyRazorpaySignature(payload: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  if (!env.RAZORPAY_KEY_SECRET) return false;
  const digest = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${payload.orderId}|${payload.paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(payload.signature));
}

export function verifyRazorpayWebhook(rawBody: string, signature: string) {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
  const digest = crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
