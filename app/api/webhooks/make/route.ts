import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-webhook-secret");

    // 1. Secret verification
    if (!signature || signature !== env.MAKE_WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { event, leadId } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, message: "leadId is required" }, { status: 400 });
    }

    // 2. Event handling
    switch (event) {
      case "lead_scored": {
        const { geoScore, geoReport } = body;
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            geoScore: geoScore ? parseInt(geoScore.toString()) : null,
            geoReport: geoReport || {},
            status: "scored",
            lastContactedAt: new Date(),
          },
        });
        break;
      }

      case "lead_contacted": {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            status: "contacted",
            lastContactedAt: new Date(),
          },
        });
        break;
      }

      case "client_onboarded": {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            status: "client",
          },
        });
        break;
      }

      case "payment_reminder_sent": {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            status: "payment_reminded",
            lastContactedAt: new Date(),
          },
        });
        break;
      }

      default:
        return NextResponse.json({ success: false, message: "Unknown event type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Make webhook callback error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
