import crypto from "node:crypto";

import { env } from "@/lib/env";
import { safeJsonParse } from "@/lib/utils";

type CaptchaPayload = {
  a: number;
  b: number;
  answer: number;
  exp: number;
};

function sign(payload: CaptchaPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", env.CAPTCHA_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function read(token: string): CaptchaPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = crypto.createHmac("sha256", env.CAPTCHA_SECRET).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  return safeJsonParse<CaptchaPayload>(Buffer.from(body, "base64url").toString("utf8"), null as never);
}

export function createCaptchaChallenge() {
  const a = crypto.randomInt(3, 12);
  const b = crypto.randomInt(2, 10);
  const payload: CaptchaPayload = {
    a,
    b,
    answer: a + b,
    exp: Date.now() + 10 * 60 * 1000,
  };

  return {
    question: `What is ${a} + ${b}?`,
    token: sign(payload),
  };
}

export function verifyCaptcha(token: string, answer: string | number) {
  const payload = read(token);
  if (!payload) return false;
  if (Date.now() > payload.exp) return false;
  return Number(answer) === payload.answer;
}
