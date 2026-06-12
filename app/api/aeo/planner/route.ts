import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60; // Allow more time for AI generation

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Request
    const body = await req.json();
    const { seedKeyword } = body;

    if (!seedKeyword || typeof seedKeyword !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid seedKeyword' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    // 3. Initialize Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `
      You are an expert SEO and Answer Engine Optimization (AEO) strategist.
      The user wants to dominate the topic cluster around: "${seedKeyword}".
      
      Generate a list of 30 highly specific, long-tail blog article topics. 
      Focus on buyer-intent, informational deep-dives, and questions people ask Answer Engines (like Perplexity or ChatGPT).
      
      You MUST return exactly 30 topics.
      You MUST return the output as a RAW JSON array of objects.
      DO NOT wrap the JSON in markdown blocks (e.g. no \`\`\`json). Just return the raw JSON array.
      
      Each object must have:
      - "title": A catchy, SEO-optimized H1 title (e.g. "The Ultimate Guide to X in 2026")
      - "targetQuery": The primary search query this targets (e.g. "how to do X")
      - "estimatedVolume": A string estimate of search volume (e.g. "High", "Medium", "Low")
    `;

    // 4. Generate with Claude Haiku (fast and cheap)
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are a JSON-only API. You output raw JSON arrays without any markdown formatting.",
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    let rawJson = '';

    if (content.type === 'text') {
      rawJson = content.text.trim();
      // Safety cleanup if Claude still outputs markdown blocks
      if (rawJson.startsWith('```json')) {
        rawJson = rawJson.replace(/```json\n?/, '').replace(/```\n?$/, '');
      }
    } else {
      throw new Error('Unexpected response type from Claude');
    }

    let topics = [];
    try {
      topics = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('Failed to parse Claude JSON output:', rawJson);
      return NextResponse.json({ error: 'AI generated invalid JSON' }, { status: 500 });
    }

    return NextResponse.json({ topics }, { status: 200 });

  } catch (error: any) {
    console.error('Planner API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
