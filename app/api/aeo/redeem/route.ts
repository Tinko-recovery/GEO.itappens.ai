import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, code } = await (req.json() as Promise<{ email: string; code: string }>);

    if (!email || !code) {
      return NextResponse.json({ error: 'Missing email or code' }, { status: 400 });
    }

    if (code !== 'itappenstest') {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    // Check if the user has already redeemed this code
    const existingRedemption = await prisma.creditTransaction.findFirst({
      where: {
        userEmail: email,
        stripeSessionId: `promo_${code}`,
      },
    });

    if (existingRedemption) {
      return NextResponse.json({ error: 'Promo code already redeemed' }, { status: 400 });
    }

    // Find or create user credits
    let userCredits = await prisma.userCredits.findUnique({
      where: { email },
    });

    if (!userCredits) {
      userCredits = await prisma.userCredits.create({
        data: {
          email,
          balance: 0,
        },
      });
    }

    // Grant 10 credits for the test code
    const creditsToGrant = 10;

    // Log the transaction
    await prisma.creditTransaction.create({
      data: {
        userEmail: email,
        amount: creditsToGrant,
        stripeSessionId: `promo_${code}`, // Use this field to track promo redemption
      },
    });

    // Update the balance
    const updatedUser = await prisma.userCredits.update({
      where: { email },
      data: { balance: userCredits.balance + creditsToGrant },
    });

    return NextResponse.json({
      success: true,
      newBalance: updatedUser.balance,
      message: `Successfully redeemed promo code for ${creditsToGrant} credits!`,
    });
  } catch (error) {
    console.error('Error redeeming promo code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
