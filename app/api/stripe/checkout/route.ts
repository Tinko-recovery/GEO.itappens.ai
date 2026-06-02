import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil' as any,
});

// Pack prices and credits
const CREDIT_PACKS: Record<string, { credits: number, price: number, name: string }> = {
  starter: { credits: 1000, price: 2900, name: 'Starter Pack (1,000 Credits)' },
  growth: { credits: 2500, price: 6900, name: 'Growth Pack (2,500 Credits)' },
  agency: { credits: 6000, price: 15900, name: 'Agency Pack (6,000 Credits)' },
};

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pack } = await req.json();
    const selectedPack = CREDIT_PACKS[pack];

    if (!selectedPack) {
      return NextResponse.json({ error: 'Invalid pack selected' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPack.name,
              description: 'itappens AEO Credits for autonomous article generation.',
            },
            unit_amount: selectedPack.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=canceled`,
      client_reference_id: session.user.email,
      metadata: {
        email: session.user.email,
        credits: selectedPack.credits.toString()
      }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
