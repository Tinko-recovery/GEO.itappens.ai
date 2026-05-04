import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await context.params;

  const audit = await prisma.audit.findUnique({
    where: { shareToken },
    select: {
      status: true,
      reportJson: true,
      reportHtml: true,
      siteUrl: true,
    },
  });

  if (!audit || !audit.reportJson || !audit.reportHtml) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  return NextResponse.json({
    status: audit.status,
    report: audit.reportJson,
    html: audit.reportHtml,
    siteUrl: audit.siteUrl,
  });
}
