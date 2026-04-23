import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { razorpay } from '@/utils/razorpay'

// Define pricing maps
const PACKS: Record<string, { amount: number; credits: number }> = {
  starter: { amount: 499, credits: 90 },
  growth: { amount: 999, credits: 180 },
  pro: { amount: 1999, credits: 360 },
}

const SUBS: Record<string, { amount: number; credits: number }> = {
  starter_sub: { amount: 399, credits: 90 },
  growth_sub: { amount: 799, credits: 180 },
  pro_sub: { amount: 1599, credits: 360 },
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId, type } = await request.json()
    const plan = type === 'subscription' ? SUBS[planId] : PACKS[planId]

    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Razorpay amount is in paise (INR * 100)
    const options = {
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        credits: plan.credits.toString(),
        planId,
        type,
      }
    }

    const order = await razorpay.orders.create(options)

    // Log the transaction attempt in Supabase
    await supabase.from('transactions').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: options.amount,
      credits_added: plan.credits,
      status: 'pending'
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (error: any) {
    console.error('Razorpay Order Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
