import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            formSetup
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return NextResponse.json({ error: "Server missing Razorpay secret configuration." }, { status: 500 });
        }

        // Mathematically verify the payment signature to prevent spoofing
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
        }

        // --- PAYMENT IS VERIFIED AND SECURE HERE ---

        // Note: The actual database provisioning (Supabase) and email notifications (Resend)
        // are now handled securely via the out-of-band webhook at /api/payment/webhook 
        // to guarantee delivery even if the user closes their browser early.

        return NextResponse.json({ success: true, message: "Payment verified synchronously." }, { status: 200 });

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: "Server error during verification." }, { status: 500 });
    }
}
