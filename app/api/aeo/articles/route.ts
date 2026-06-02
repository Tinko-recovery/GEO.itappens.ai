import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await prisma.aeoArticle.findMany({
      where: { email: session.user.email },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Articles API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const { topic, siteId } = await req.json();

    if (!topic || !siteId) {
      return NextResponse.json({ error: 'Topic and Site ID are required' }, { status: 400 });
    }

    // Use a transaction to safely deduct credit and create article
    const result = await prisma.$transaction(async (tx) => {
      const credits = await tx.userCredits.findUnique({ where: { email } });
      
      if (!credits || credits.balance < 1) {
        throw new Error('INSUFFICIENT_CREDITS');
      }

      // Deduct 1 credit
      await tx.userCredits.update({
        where: { email },
        data: { balance: credits.balance - 1 }
      });

      // Create article in PENDING state
      const article = await tx.aeoArticle.create({
        data: {
          email,
          siteId,
          topic,
          targetQuery: topic, // Default to topic, can be refined by AI later
          status: 'PENDING',
        }
      });

      return article;
    });

    // Here we would typically trigger the QStash background worker
    // fetch('https://qstash.upstash.io/v2/publish/...', { ... })

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Articles API POST Error:', error);
    if (error.message === 'INSUFFICIENT_CREDITS') {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
