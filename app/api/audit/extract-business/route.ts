import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

function extractMetaTags(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "";

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const description = descMatch ? descMatch[1] : "";

  return { title, description };
}

export async function POST(req: Request) {
  try {
    const { siteUrl, companyName } = await req.json();

    if (!siteUrl) {
      return NextResponse.json({ error: "Missing siteUrl" }, { status: 400 });
    }

    // 1. Fetch the homepage HTML
    let html = "";
    try {
      const targetUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
      const response = await fetch(targetUrl, { 
        headers: { "User-Agent": "Mozilla/5.0 (compatible; itappensBot/1.0)" },
        signal: AbortSignal.timeout(4000) 
      });
      if (response.ok) {
        html = await response.text();
      }
    } catch (e) {
      console.warn("Could not fetch target domain:", e);
      // Proceed without HTML, rely on just the URL and company name
    }

    const { title, description } = extractMetaTags(html);

    // 2. Ask Anthropic to summarize
    const prompt = `
You are an expert business analyst. Based on the following website information, describe what the business does in exactly 3 to 8 words. 
Format your response as a simple noun phrase that completes the sentence: "This business is a..." or "This business provides...". Do NOT include the intro words, just the phrase.
Example: "project management software for teams"
Example: "B2B SaaS marketing agency"
Example: "multi-specialty hospital network"

Company Name: ${companyName || 'Unknown'}
URL: ${siteUrl}
Website Title: ${title}
Website Description: ${description}

Output ONLY the 3-8 word phrase. Nothing else.
`;

    const msg = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 20,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
    });

    // @ts-ignore
    const summary = msg.content[0]?.text?.trim() || "business services";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Extract Business Error:", error);
    return NextResponse.json(
      { error: "Failed to extract business info", summary: "business services" },
      { status: 500 }
    );
  }
}
