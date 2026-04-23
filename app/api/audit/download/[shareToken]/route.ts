import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { renderPdfFromHtml } from "@/lib/pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(_: Request, context: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await context.params;

  const audit = await prisma.audit.findUnique({
    where: { shareToken },
    select: {
      normalizedDomain: true,
      reportHtml: true,
    },
  });

  if (!audit?.reportHtml) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const pdf = await renderPdfFromHtml(audit.reportHtml);

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${audit.normalizedDomain}-geo-audit.pdf"`,
    },
  });
}
