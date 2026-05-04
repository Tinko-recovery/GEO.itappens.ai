import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Prevent static pre-rendering — this route must run dynamically
export const dynamic = 'force-dynamic';

/**
 * DAILY CONTENT ENGINE
 * This route is called every morning by Upstash QStash.
 * It iterates through all ACTIVE clients and generates content.
 */
async function handler(req: Request) {
    console.log("[SCHEDULER] Starting Daily Content Engine...");

    try {
        // 1. Fetch all ACTIVE clients
        const activeClients = await prisma.clientProfile.findMany({
            where: { status: "ACTIVE" }
        });

        if (activeClients.length === 0) {
            console.log("[SCHEDULER] No active clients found. Powering down.");
            return NextResponse.json({ message: "No active clients" });
        }

        const results = [];

        // 2. Loop through each client and generate content
        for (const client of activeClients) {
            console.log(`[SCHEDULER] Processing mission for: ${client.businessName}`);
            
            try {
                // Generate content using Gemini
                const content = await generateContentForClient(client);
                
                // Publish to Buffer (LinkedIn & Twitter)
                const publishResults = await publishToBuffer(client, content);
                
                results.push({
                    client: client.businessName,
                    success: true,
                    platforms: Object.keys(publishResults)
                });

            } catch (err: any) {
                console.error(`[SCHEDULER] Failed for ${client.businessName}:`, err.message);
                results.push({
                    client: client.businessName,
                    success: false,
                    error: err.message
                });
            }
        }

        return NextResponse.json({ success: true, processed: results });

    } catch (error: any) {
        console.error("[SCHEDULER] Fatal error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Uses Gemini 1.5 Pro to generate social content based on client niche.
 */
async function generateContentForClient(client: any) {
    const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error("Missing Gemini API Key");

    const prompt = `
Role: Expert AI Content Strategist.
Client: ${client.businessName} (${client.websiteUrl})
Niche: ${client.niche}
Industry: ${client.industry}
Target Audience: ${client.targetAudience}
Tone: ${client.toneOfVoice}

TASK:
Generate 2 pieces of high-conversion social media content for today.
1. A LinkedIn Post (Professional, insightful, with 3 relevant hashtags).
2. A Twitter/X Post (Hook-driven, concise, under 280 chars).

Format your response as a JSON object with keys "linkedin" and "twitter". 
Do not include any markdown formatting like \`\`\`json. Just the raw JSON.
`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                temperature: 0.7,
                response_mime_type: "application/json" 
            }
        })
    });

    if (!res.ok) throw new Error(`Gemini API failed: ${await res.text()}`);
    
    const data = await res.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
}

/**
 * Pushes the generated content to the client's Buffer account.
 */
async function publishToBuffer(client: any, content: { linkedin: string, twitter: string }) {
    // If client has their own token, use it. Otherwise use our master token.
    const token = client.bufferAccessToken || process.env.BUFFER_ACCESS_TOKEN;
    if (!token) throw new Error("No Buffer access token available.");

    const publishResults: any = {};

    // LinkedIn
    if (client.linkedinProfileId) {
        publishResults.linkedin = await sendToBuffer(token, client.linkedinProfileId, content.linkedin);
        await logPost(client.id, "linkedin", content.linkedin, publishResults.linkedin);
    }

    // Twitter
    if (client.twitterProfileId) {
        publishResults.twitter = await sendToBuffer(token, client.twitterProfileId, content.twitter);
        await logPost(client.id, "twitter", content.twitter, publishResults.twitter);
    }

    return publishResults;
}

async function sendToBuffer(token: string, profileId: string, text: string) {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("profile_ids[]", profileId);
    params.append("shorten", "true");
    params.append("now", "true");

    const res = await fetch("https://api.bufferapp.com/1/updates/create.json", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Buffer failed: ${JSON.stringify(data)}`);
    return data;
}

async function logPost(clientId: string, platform: string, content: string, bufferData: any) {
    await prisma.clientPost.create({
        data: {
            clientId,
            platform,
            content,
            status: "published",
            publishedAt: new Date(),
            bufferId: bufferData.updates?.[0]?.id || null
        }
    });
}

// Export with lazy QStash signature check at runtime
export async function POST(req: Request) {
    const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
    const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;
    if (currentKey && nextKey) {
        const { verifySignatureAppRouter } = await import("@upstash/qstash/dist/nextjs");
        return verifySignatureAppRouter(handler)(req);
    }
    return handler(req);
}
export const GET = handler; // Allow manual testing during dev
