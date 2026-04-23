import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
  const keyId = process.env.NODE_ENV === 'production'
    ? process.env.RAZORPAY_KEY_ID_LIVE!
    : process.env.RAZORPAY_KEY_ID_TEST!
  const keySecret = process.env.NODE_ENV === 'production'
    ? process.env.RAZORPAY_KEY_SECRET_LIVE!
    : process.env.RAZORPAY_KEY_SECRET_TEST!

  console.log('SERVICE KEY PREFIX:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20))
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, credits, planId } = await request.json()

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    // 1. Verify signature: HMAC-SHA256 of "order_id|payment_id"
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('verify-payment: Signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 2. Explicitly capture the payment via Razorpay REST API
    const captureRes = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        },
        body: JSON.stringify({
          amount: amount * 100, // paise
          currency: 'INR',
        }),
      }
    )

    const captureData = await captureRes.json()

    if (!captureRes.ok) {
      // Payment may already be captured (e.g. auto-capture race) — treat as success
      if (captureData.error?.code !== 'BAD_REQUEST_ERROR' || captureData.error?.description !== 'This payment has already been captured') {
        console.error('verify-payment: Capture failed', captureData)
        return NextResponse.json({ error: 'Payment capture failed', detail: captureData }, { status: 502 })
      }
      console.log('verify-payment: Payment already captured, continuing credit grant')
    }

    // 3. Add credits to user (idempotent: check transaction table first)
    const { data: existingTx } = await supabaseAdmin
      .from('transactions')
      .select('id, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (existingTx?.status === 'completed') {
      console.log('verify-payment: Transaction already completed, skipping credit grant')
      return NextResponse.json({ status: 'ok' })
    }

    console.log('Looking for userId:', user.id)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30))
    const { data: userRow, error: userError } = await supabaseAdmin
      .from('users')
      .select('credits_remaining')
      .eq('id', user.id)
      .single()
    console.log('Query result:', userRow, 'Error:', userError)

    if (userError || !userRow) {
      console.error('verify-payment: User not found', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newCredits = (userRow.credits_remaining || 0) + credits
    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        credits_remaining: newCredits,
        credits_expire_at: newExpiry.toISOString(),
        plan: planId,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('verify-payment: Credit update failed', updateError)
      return NextResponse.json({ error: 'Credit update failed' }, { status: 500 })
    }

    // 4. Upsert transaction row
    if (existingTx) {
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'completed' })
        .eq('razorpay_order_id', razorpay_order_id)
    } else {
      await supabaseAdmin
        .from('transactions')
        .insert({
          user_id: user.id,
          razorpay_order_id,
          amount: amount * 100,
          credits_added: credits,
          status: 'completed',
        })
    }

    console.log(`verify-payment: Granted ${credits} credits to user ${user.id} for order ${razorpay_order_id}`)
    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('verify-payment: Unhandled error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
