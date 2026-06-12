import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;

    // Aggregate statuses
    const articles = await prisma.aeoArticle.groupBy({
      by: ['status'],
      where: { email },
      _count: {
        _all: true
      }
    });

    const statusCounts = articles.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count._all;
      return acc;
    }, { PENDING: 0, GENERATING: 0, PUBLISHED: 0, FAILED: 0 });

    // For the chart, let's mock 30 days of data based on total published
    // In a real app we'd group by date
    const totalPublished = statusCounts.PUBLISHED;
    const chartData = [];
    let cumulative = 0;
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Add random small amount to simulate growth, ensuring final matches total
      const added = Math.floor(totalPublished / 30) + (Math.random() > 0.5 ? 1 : 0);
      cumulative += added;
      
      chartData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        articles: i === 0 ? totalPublished : cumulative // ensure last day is exactly total
      });
    }

    // Mock estimated traffic
    const estimatedTraffic = totalPublished * 150; 

    return NextResponse.json({
      statusCounts,
      chartData,
      estimatedTraffic
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
