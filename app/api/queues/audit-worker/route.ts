import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Prevent static pre-rendering — this route must run dynamically
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * Background Worker for handling GEO Audits asynchronously.
 * This endpoint is ONLY called by Upstash QStash.
 * Completely refactored to Native TypeScript for Vercel deployment.
 */
async function handler(req: Request) {
    console.log("[WORKER] Received background audit task from Upstash");
    
    let auditId: string | undefined;

    try {
        const body = await req.json();
        auditId = body.auditId;
        const { url, email, plan } = body;

        if (!url || !auditId) {
            console.error("[WORKER] Missing URL or Audit ID in payload");
            return NextResponse.json({ error: "URL and Audit ID are required" }, { status: 400 });
        }

        console.log(`[WORKER] Initiating Weaponized GEO Audit for: ${url}`);

        // 1. Scrape the URL using Firecrawl
        const firecrawlKey = process.env.FIRECRAWL_API_KEY;
        if (!firecrawlKey) {
             throw new Error("FIRECRAWL_API_KEY is not set. Cannot scrape target URL.");
        }

        console.log(`[WORKER] Scraping URL via Firecrawl...`);
        const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${firecrawlKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url, formats: ["markdown"] })
        });

        if (!scrapeRes.ok) {
            const err = await scrapeRes.text();
            throw new Error(`Firecrawl failed: ${err}`);
        }

        const scrapeData = await scrapeRes.json();
        const content = scrapeData.data?.markdown || "No content found.";

        // 2. Analyze with Google Gemini (Vercel Native Fetch)
        const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            throw new Error("GOOGLE_API_KEY is not set. Cannot synthesize report.");
        }

        console.log(`[WORKER] Generating GEO Battlecard via Gemini...`);
        
        const prompt = `
Role: Senior AI Systems Architect & GEO Specialist.
Project: itappens.ai GEO Foundry.

TARGET URL: ${url}
CONTENT PREVIEW:
${content.substring(0, 15000)}

TASK:
Perform a competitive audit between the target site and the top 2 semantic rivals. Identify specific 'Token Gaps'—terms the rivals are using that trigger AI citations (e.g., structured 'How-to' data vs. prose).

INSTRUCTIONS:
1. Generate a 'GEO Battlecard' comparing the user's site to 1-2 autonomously identified competitors.
2. Calculate 'Token Relevance Score' and 'Citation Gravity'.
3. Identify 1-2 industry competitors and explain why they currently win AI citations in ChatGPT/Perplexity over the user.
4. Provide 3 'Semantic Hooks' (exact phrases or headers) the user must add to displace the rival in an LLM's latent space.
5. BENCHMARK LOGIC: If you identify 'itappens.ai' as a competitor, highlight it as the 'Benchmark' for GEO excellence.

FORMAT: Output a high-premium, professional Markdown report. Use sections like: 
- [GEO EXECUTIVE SUMMARY]
- [THE BATTLECARD: RIVAL DISPLACEMENT]
- [THE TOKEN GAP ANALYSIS]
- [THE 3 SEMANTIC HOOKS]
- [CIT_GRAVITY SCORE]

STRICT STEALTH: Replace all references to human names or personal emails with 'The Principal' or 'Brand Authority'.
`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4 }
            })
        });

        if (!geminiRes.ok) {
            const err = await geminiRes.text();
            throw new Error(`Gemini failed: ${err}`);
        }

        const geminiData = await geminiRes.json();
        const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate report.";

        console.log(`[WORKER] Successfully completed audit for ${url}`);
        
        // 3. Update Supabase status to COMPLETED and save 'report'
        await prisma.audit.update({
            where: { id: auditId },
            data: { 
                status: "COMPLETED",
                reportHtml: report
            }
        });

        return NextResponse.json({ success: true, report_length: report.length });

    } catch (error: any) {
        console.error("[WORKER] Fatal error:", error.message);
        
        // If we fail, try to update the audit to FAILED
        if (auditId) {
            try {
                await prisma.audit.update({
                    where: { id: auditId },
                    data: { status: "FAILED", errorMessage: error.message }
                });
            } catch (e) {}
        }

        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Export handler directly — QStash signature verification via env keys at runtime
export async function POST(req: Request) {
    // Only verify signature if QStash keys are configured
    const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
    const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;
    if (currentKey && nextKey) {
        const { verifySignatureAppRouter } = await import("@upstash/qstash/dist/nextjs");
        return verifySignatureAppRouter(handler)(req);
    }
    return handler(req);
}
