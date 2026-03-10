import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { company, niche, audience, platforms = [] } = await req.json();
        if (!company || !niche) {
            return NextResponse.json({ error: 'Company and niche are required.' }, { status: 400 });
        }

        const prompt = `You are generating sample social media content for a brand that uses itappens Content automation.

Brand: ${company}
Niche / Industry: ${niche}
Target Audience: ${audience || 'business professionals'}
Platforms requested: ${platforms.join(', ')}

Generate real, high-quality sample content for this brand. Write as if you ARE their brand voice. Confident, insight-led, no fluff.

Format EXACTLY as:
---LINKEDIN---
[A punchy, insight-led LinkedIn post. Max 1000 characters. End with a relevant CTA.]
---TWITTER---
[A punchy tweet. Max 220 characters. No hashtags.]
---INSTAGRAM---
[An Instagram caption. Hook in first line. 3-4 value sentences. 5 hashtags at end.]`;

        const response = await client.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';

        const linkedin = text.match(/---LINKEDIN---\s*([\s\S]*?)(?=---TWITTER---|---INSTAGRAM---|$)/)?.[1]?.trim() ?? '';
        const twitter = text.match(/---TWITTER---\s*([\s\S]*?)(?=---INSTAGRAM---|$)/)?.[1]?.trim() ?? '';
        const instagram = text.match(/---INSTAGRAM---\s*([\s\S]*?)$/)?.[1]?.trim() ?? '';

        return NextResponse.json({ linkedin, twitter, instagram });
    } catch (err: any) {
        console.error('Generate API error:', err);
        return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
    }
}
