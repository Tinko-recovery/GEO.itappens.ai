import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text(); // Raw body needed for HMAC verification
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret || !signature) {
            console.error("Webhook missing secret or signature");
            return NextResponse.json({ error: "Missing secret or signature" }, { status: 400 });
        }

        // Mathematically verify the payload guarantees it came exactly from Razorpay
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(bodyText)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error("Invalid webhook signature.");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(bodyText);

        // We only care about successful payment captures
        if (event.event === 'order.paid' || event.event === 'payment.captured') {
            const paymentEntity = event.payload.payment.entity;
            const order_id = paymentEntity.order_id;
            const payment_id = paymentEntity.id;

            if (!order_id) return NextResponse.json({ success: true });

            // Calculate tomorrow's date for content_start_date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Update the 'pending' Supabase record created by create-order to 'active'
            const { data: updatedClient, error: dbError } = await supabase
                .from('clients')
                .update({
                    status: 'active',
                    payment_id: payment_id,
                    content_start_date: tomorrow.toISOString(),
                    // Ayrshare generation will go here later
                })
                .eq('order_id', order_id)
                .select('*')
                .single();

            if (dbError) {
                console.error("Supabase Update Error inside Webhook:", dbError);
                return NextResponse.json({ error: "DB update failed" }, { status: 500 });
            }

            // Send confirmation email to Founder
            const RESEND_API_KEY = process.env.RESEND_API_KEY;
            const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'founder@tinko.in';
            if (RESEND_API_KEY && updatedClient) {
                const emailBody = `
✅ SUCCESS: NEW PAID SUBSCRIPTION (WEBHOOK)

Client: ${updatedClient.company} (${updatedClient.website})
Contact: ${updatedClient.name} <${updatedClient.email}>
Package Selected: ${updatedClient.package_id}
Payment ID: ${payment_id}

=== SETUP DATA FOR PYTHON ENGINE ===
Industry: ${updatedClient.industry}
Target Audience: ${updatedClient.audience}
Goals: ${(updatedClient.goals || []).join(', ')}

Please check Supabase for the full client record.
          `.trim();

                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        from: 'itappens.ai <onboarding@resend.dev>',
                        to: [CONTACT_EMAIL],
                        subject: `💰 Paid Onboarding: ${updatedClient.company} [${updatedClient.package_id}]`,
                        text: emailBody,
                    }),
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: "Server err" }, { status: 500 });
    }
}
