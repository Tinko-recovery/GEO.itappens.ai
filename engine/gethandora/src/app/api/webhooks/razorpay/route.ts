import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
  const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

  const body = await request.text()
  console.log('WEBHOOK HIT', body)
  const signature = request.headers.get('x-razorpay-signature')

  if (!WEBHOOK_SECRET) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Config error' }, { status: 500 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    console.warn('Webhook: Invalid signature received')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload.payment.entity
    const orderId = payment.order_id
    // Nodes can be in payment or order depending on the flow
    const notes = payment.notes || event.payload.order?.entity?.notes

    if (!notes || !notes.userId || !notes.credits) {
      console.error('Webhook: Missing metadata in notes', notes)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const userId = notes.userId
    const creditsToAdd = parseInt(notes.credits)

    // 1. Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('credits_remaining')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Webhook: User profile not found', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. Update credits and extend expiry
    const newCredits = (userProfile.credits_remaining || 0) + creditsToAdd
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        credits_remaining: newCredits,
        credits_expire_at: newExpiry.toISOString(),
        plan: notes.planId || 'paid'
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Webhook: Failed to update user credits', updateError)
      return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }

    // 3. Update transaction record
    await supabaseAdmin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('razorpay_order_id', orderId)

    console.log(`Webhook: Successfully fulfilled order ${orderId}. Added ${creditsToAdd} credits to ${userId}`)
  }

  return NextResponse.json({ status: 'ok' })
}
