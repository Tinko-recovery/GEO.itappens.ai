import { env } from "@/lib/env";
import { buildAbsoluteUrl, formatInr } from "@/lib/utils";

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!env.RESEND_API_KEY) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });
}

type ReceiptEmailInput = {
  email: string;
  siteUrl: string;
  planLabel: string;
  amount: number;
};

export async function sendInternalLeadAlert(input: {
  email: string;
  siteUrl: string;
  planLabel: string;
  targetKeywords: string[];
}) {
  await sendEmail({
    to: env.NOTIFY_TO_EMAIL,
    subject: `New ${input.planLabel} audit lead for ${input.siteUrl}`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:640px">
        <h2 style="margin-bottom:16px">New audit lead</h2>
        <p><strong>Website:</strong> ${input.siteUrl}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Plan:</strong> ${input.planLabel}</p>
        <p><strong>Keywords:</strong> ${input.targetKeywords.length ? input.targetKeywords.join(", ") : "Not provided"}</p>
      </div>
    `,
  });
}

export async function sendAuditReceiptEmail(input: ReceiptEmailInput) {
  await sendEmail({
    to: input.email,
    subject: `Audit confirmed for ${input.siteUrl}`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:640px;color:#0f172a">
        <p style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#4f46e5">itappens.ai audit</p>
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">Your ${input.planLabel} is confirmed.</h1>
        <p style="color:#475569;line-height:1.7;margin:0 0 12px">
          We have queued the paid GEO + SEO deep audit for <strong>${input.siteUrl}</strong>.
          The system is now crawling the site, pulling SERP and competitor data, and generating the branded report.
        </p>
        <p style="color:#475569;line-height:1.7;margin:0 0 24px">
          Charge captured: <strong>${formatInr(input.amount)}</strong>.
        </p>
        <a href="${buildAbsoluteUrl("/audit")}" style="display:inline-block;background:#111827;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">
          Track audit status
        </a>
      </div>
    `,
  });
}

export async function sendAuditReadyEmail(input: {
  email: string;
  siteUrl: string;
  shareToken: string;
}) {
  const reportUrl = buildAbsoluteUrl(`/audit/report/${input.shareToken}`);

  await sendEmail({
    to: input.email,
    subject: `Your itappens.ai GEO audit is ready`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;max-width:640px;color:#0f172a">
        <p style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#4f46e5">Report ready</p>
        <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px">The audit for ${input.siteUrl} is live.</h1>
        <p style="color:#475569;line-height:1.7;margin:0 0 24px">
          Your branded report now includes the technical score, SERP benchmark, competitor gap analysis, GEO opportunities,
          and a 30/60/90-day roadmap.
        </p>
        <a href="${reportUrl}" style="display:inline-block;background:#111827;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;margin-right:10px">
          Open report
        </a>
        <a href="${buildAbsoluteUrl(`/api/audit/download/${input.shareToken}`)}" style="display:inline-block;background:#eef2ff;color:#312e81;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">
          Download PDF
        </a>
      </div>
    `,
  });
}
