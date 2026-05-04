import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { razorpay } from '@/utils/razorpay'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, credits, planId, type } = await request.json()

    const options = {
      amount: amount * 100, // Amount is in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: user.id,
        credits: credits.toString(),
        planId,
        type,
      }
    }

    const order = await razorpay.orders.create(options)

    // Log transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      razorpay_order_id: order.id,
      amount: options.amount,
      credits_added: credits,
      status: 'pending'
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (error: any) {
    console.error('Razorpay Order Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
