import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '@/lib/supabase';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
    try {
        const { formSetup } = await req.json();
        const { packageId } = formSetup;

        // Map packages to INR values (in paise — multiply by 100)
        let amount = 0;
        if (packageId === 'content-growth') amount = 499900;
        else if (packageId === 'content-pro') amount = 999900;
        else if (packageId === 'geo') amount = 1999900;
        else if (packageId === 'bundle') amount = 2999900; // Custom placeholder amount for bundle
        else {
            return NextResponse.json({ error: 'Invalid package selection.' }, { status: 400 });
        }

        const options = {
            amount,
            currency: "INR",
            receipt: `rcpt_${Math.random().toString(36).substring(7)}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        // 2. Save pending PENDING order to Supabase
        const { error: dbError } = await supabase
            .from('clients')
            .insert([{
                name: formSetup.name,
                email: formSetup.email,
                company: formSetup.company,
                website: formSetup.website,
                industry: formSetup.industry,
                audience: formSetup.audience,
                goals: formSetup.goals,
                package_id: formSetup.packageId,
                order_id: order.id,
                status: 'pending' // Will set to 'active' on webhook success
            }]);

        if (dbError) {
            console.error("Supabase Save Error (Pending):", dbError);
        }

        return NextResponse.json({ id: order.id, amount: order.amount }, { status: 200 });

    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json(
            { error: "Failed to create payment order. Check if RAZORPAY_KEY_SECRET is correctly set in environment." },
            { status: 500 }
        );
    }
}
