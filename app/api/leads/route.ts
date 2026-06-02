import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.email || !data.name || !data.company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the new lead into the Universal Lead OS
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website || '',
        industry: data.industry || 'Unknown',
        targetQueries: data.targetQueries || [],
        source: data.source || 'organic_search', // Default to organic if not provided
        automationStatus: 'pending',
        enrichedData: data.enrichedData || null,
        competitors: data.competitors || [],
      }
    });

    // In a real scenario, this is where we would trigger the 'Make' webhook for Notion sync
    // fetch('https://hook.make.com/your-webhook-id', {
    //   method: 'POST',
    //   body: JSON.stringify(lead)
    // });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Lead API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
