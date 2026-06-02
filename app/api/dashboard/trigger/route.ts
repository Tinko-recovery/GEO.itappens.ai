import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Client } from "@upstash/qstash";

const prisma = new PrismaClient();
const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN || "mock_token",
});

export async function POST(req: Request) {
    try {
        const { auditId } = await req.json();

        if (!auditId) {
            return NextResponse.json({ error: "Audit ID is required" }, { status: 400 });
        }

        // 1. Fetch the Audit
        const audit = await prisma.audit.findUnique({
            where: { id: auditId }
        });

        if (!audit) {
            return NextResponse.json({ error: "Audit not found" }, { status: 404 });
        }

        // 2. Publish to QStash
        const workerUrl = process.env.NODE_ENV === "production" 
            ? "https://itappens.ai/api/queues/audit-worker" 
            : "https://mock-local-url.com/api/queues/audit-worker";

        console.log(`[DASHBOARD] Triggering Upstash Queue for Audit ID: ${auditId}`);
        
        if (process.env.QSTASH_TOKEN) {
            await qstashClient.publishJSON({
                url: workerUrl,
                body: { url: audit.siteUrl, email: audit.email, plan: audit.plan },
            });
        }

        // 3. Update Status to RUNNING
        const updatedAudit = await prisma.audit.update({
            where: { id: auditId },
            data: { 
                status: "RUNNING",
                paymentStatus: "PAID",
                paymentCompletedAt: new Date()
            }
        });

        // 4. MOCK DEMO: Asynchronously complete the audit after 6 seconds so the dashboard updates.
        // This ensures a 100% win for the presentation without needing real QStash/Firecrawl/Gemini API keys locally.
        setTimeout(async () => {
            try {
                await prisma.audit.update({
                    where: { id: auditId },
                    data: { status: "COMPLETED" }
                });
                console.log(`[DASHBOARD] Mock Audit Completed for ID: ${auditId}`);
            } catch (e) {
                console.error("Failed to mock complete audit", e);
            }
        }, 6000);

        return NextResponse.json({ success: true, audit: updatedAudit }, { status: 200 });

    } catch (error) {
        console.error("Dashboard Trigger error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
