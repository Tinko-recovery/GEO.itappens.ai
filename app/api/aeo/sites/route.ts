import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/encryption';

export async function GET(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sites = await prisma.wordPressSite.findMany({
      where: { email: session.user.email },
      select: {
        id: true,
        url: true,
        appUser: true,
        createdAt: true,
        // We do NOT return the encrypted appToken to the frontend
      }
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error('Sites API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, appUser, appToken } = await req.json();

    if (!url || !appUser || !appToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Clean URL
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Encrypt token
    const encryptedToken = encrypt(appToken);

    const site = await prisma.wordPressSite.create({
      data: {
        email: session.user.email,
        url: cleanUrl,
        appUser,
        appToken: encryptedToken
      }
    });

    return NextResponse.json({ 
      id: site.id, 
      url: site.url, 
      appUser: site.appUser 
    }, { status: 201 });
  } catch (error) {
    console.error('Sites API POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
