import crypto from "node:crypto";

import { AuditPlan, AuditStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyCaptcha } from "@/lib/captcha";
import { prisma } from "@/lib/db";
import { sendInternalLeadAlert } from "@/lib/email";
import { assertRateLimit } from "@/lib/rate-limit";
import { normalizeSiteUrl, sha256 } from "@/lib/utils";

import { generateAuditReport } from "@/lib/audit/engine";

const requestSchema = z.object({
  siteUrl: z.string().url().or(z.string().min(4)),
  email: z.string().email(),
  targetKeywords: z.array(z.string()).default([]),
  captchaToken: z.string(),
  captchaAnswer: z.string(),
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
  const isBypass = parsed.data.email.toLowerCase().endsWith("@itappens.ai");
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const ipHash = await sha256(ip);
  
  if (!isBypass) {
    const limit = await assertRateLimit(`free:${ipHash}`, 10, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json({ error: "Too many free audits from this IP. Try again later." }, { status: 429 });
    }
  }

  const shareToken = crypto.randomBytes(16).toString("base64url");
  const audit = await prisma.audit.create({
    data: {
      siteUrl,
      normalizedDomain: new URL(siteUrl).hostname.replace(/^www\./, ""),
      email: parsed.data.email,
      targetKeywords: parsed.data.targetKeywords.slice(0, 10),
      shareToken,
      plan: AuditPlan.FREE,
      status: AuditStatus.RUNNING,
      paymentStatus: PaymentStatus.NOT_REQUIRED,
      crawlDepth: 5,
      amount: 0,
      submittedIpHash: ipHash,
      captchaVerifiedAt: new Date(),
      events: {
        create: {
          type: "audit.free_requested",
          payload: { siteUrl, email: parsed.data.email },
        },
      },
    },
  });

  try {
    const { facts, report, html } = await generateAuditReport({
      siteUrl,
      plan: "free",
      targetKeywords: parsed.data.targetKeywords,
      crawlDepth: 5,
    });

    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: AuditStatus.COMPLETED,
        freeScore: report.overallScore,
        summaryJson: facts,
        reportJson: report,
        reportHtml: html,
        events: {
          create: {
            type: "audit.free_completed",
            payload: { overallScore: report.overallScore },
          },
        },
      },
    });

    await sendInternalLeadAlert({
      email: parsed.data.email,
      siteUrl,
      planLabel: "Free Snapshot",
      targetKeywords: parsed.data.targetKeywords,
    });

    return NextResponse.json({ shareToken });
  } catch (error) {
    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: AuditStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Free audit failed",
      },
    });

    return NextResponse.json({ error: "The free audit failed. Please try again." }, { status: 500 });
  }
}
