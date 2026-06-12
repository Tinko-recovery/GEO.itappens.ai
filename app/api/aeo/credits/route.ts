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

    // Fetch or create user credits
    let credits = await prisma.userCredits.findUnique({
      where: { email }
    });

    if (!credits) {
      credits = await prisma.userCredits.create({
        data: {
          email,
          balance: 3 // Give 3 free credits to new users
        }
      });
    }

    return NextResponse.json(credits);
  } catch (error) {
    console.error('Credits API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
