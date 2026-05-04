import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, website, industry, targetQueries } = body;

    // 1. Basic validation
    if (!name || !email || !company || !website || !industry || !Array.isArray(targetQueries)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Save lead to local DB
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        website,
        industry,
        targetQueries: targetQueries,
        status: "new",
      },
    });

    // 3. Fire to Make.com (non-blocking)
    if (env.MAKE_WEBHOOK_URL) {
      void fetch(env.MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": env.MAKE_WEBHOOK_SECRET,
        },
        body: JSON.stringify({
          leadId: lead.id,
          name,
          email,
          company,
          website,
          industry,
          targetQueries,
        }),
      }).catch((err) => {
        console.warn("Make.com webhook failed:", err);
      });
    } else {
      console.warn("MAKE_WEBHOOK_URL is not configured.");
    }

    // 4. Success response
    return NextResponse.json({ success: true, message: "Audit queued" });
  } catch (error) {
    console.error("Audit submission error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to process audit submission" 
      },
      { status: 200 }
    );
  }
}
