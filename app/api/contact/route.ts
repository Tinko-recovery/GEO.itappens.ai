import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { name, email, website, competitor } = await req.json();
        if (!email || !website) {
            return NextResponse.json({ error: 'Email and website are required.' }, { status: 400 });
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'founder@tinko.in';

        if (!RESEND_API_KEY) {
            // Fallback: log and return success (so form doesn't break during setup)
            console.log(`[CONTACT FORM] No RESEND_API_KEY set. Email: ${email}, Website: ${website}, Competitor: ${competitor}`);
            return NextResponse.json({ success: true });
        }

        const emailBody = `
New AI Audit Request from itappens.ai

Name: ${name || 'Not provided'}
Email: ${email}
Website: ${website}
Competitor: ${competitor || 'Not provided'}

Submitted at: ${new Date().toISOString()}
        `.trim();

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'itappens.ai <onboarding@resend.dev>',
                to: [CONTACT_EMAIL],
                reply_to: email,
                subject: `New AI Audit Request — ${website}`,
                text: emailBody,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('Resend error:', err);
            return NextResponse.json({ error: 'Email send failed.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Contact API error:', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
