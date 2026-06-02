import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil' as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_placeholder'
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const email = session.metadata?.email || session.client_reference_id;
    const creditsStr = session.metadata?.credits;
    
    if (email && creditsStr) {
      const creditsToAdd = parseInt(creditsStr, 10);
      
      try {
        await prisma.$transaction(async (tx) => {
          // Add transaction record
          await tx.creditTransaction.create({
            data: {
              userEmail: email,
              amount: creditsToAdd,
              stripeSessionId: session.id
            }
          });

          // Update user balance
          await tx.userCredits.upsert({
            where: { email },
            update: {
              balance: { increment: creditsToAdd }
            },
            create: {
              email,
              balance: creditsToAdd,
              stripeCustomerId: session.customer as string
            }
          });
        });
        
        console.log(`[Stripe Webhook] Successfully added ${creditsToAdd} credits to ${email}`);
      } catch (err) {
        console.error(`[Stripe Webhook] Error updating database for session ${session.id}:`, err);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
