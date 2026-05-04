import { NextResponse } from "next/server";
import { Client } from "@upstash/qstash";

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN || "mock_token",
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, email, plan = "Starter" } = body;

        if (!url || !email) {
            return NextResponse.json({ error: "URL and Email are required" }, { status: 400 });
        }

        // --- CONCIERGE PAYMENT GATE LOGIC ---
        // If the user selects a paid plan, we don't trigger the audit yet.
        // We set status to AWAITING_PAYMENT and notify the founder.
        if (plan !== "Free") {
            // 1. Notify Founder (Resend/Telegram logic goes here)
            const founderEmail = process.env.NOTIFY_TO_EMAIL || "hello@itappens.ai";
            console.log(`[CONCIERGE ALERT] Lead requested PAID plan: ${plan}. Email: ${email}, URL: ${url}`);
            console.log(`Sending payment link instructions to ${founderEmail}...`);
            
            // 2. Return Awaiting Payment status
            return NextResponse.json({ 
                status: "AWAITING_PAYMENT", 
                message: "Audit request received! Check your email for the payment link to unlock this audit.",
                url,
                plan
            }, { status: 200 });
        }

        // --- FREE PLAN LOGIC (Trigger Upstash Queue) ---
        console.log(`[QUEUE] Publishing free audit task to Upstash for URL: ${url}`);
        
        // In production, this URL should be your deployed Vercel domain (e.g., https://itappens.ai/api/queues/audit-worker)
        const workerUrl = process.env.NODE_ENV === "production" 
            ? "https://itappens.ai/api/queues/audit-worker" 
            : "https://mock-local-url.com/api/queues/audit-worker";

        // Only attempt to publish if we have a real token
        if (process.env.QSTASH_TOKEN) {
            await qstashClient.publishJSON({
                url: workerUrl,
                body: { url, email, plan },
            });
        } else {
            console.warn("No QSTASH_TOKEN found in .env. Mocking queue publish for local development.");
        }

        return NextResponse.json({ 
            status: "QUEUED",
            message: "Audit successfully queued. Our agents are working on it!" 
        }, { status: 200 });

    } catch (error) {
        console.error("API Route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
