import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function makeTransporter() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
}

export async function POST(request: Request) {
    let body: any = {};

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { name, email, website, visibility } = body;

    if (!email || !website) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Always log — visible in Render logs even without email configured
    console.log('[audit-request]', JSON.stringify({ name, email, website, visibility, ts: new Date().toISOString() }));

    // Try to send email but never let it break the response
    try {
        const transporter = makeTransporter();
        if (transporter) {
            await transporter.sendMail({
                from: `"itappens.ai" <${process.env.GMAIL_USER}>`,
                to: 'hello@itappens.ai',
                replyTo: email,
                subject: `New GEO Audit Request → ${website}`,
                html: `
                    <h2>New GEO Audit Request</h2>
                    <p><strong>Name:</strong> ${name || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
                    <p><strong>Current AI Visibility:</strong> ${visibility || 'Not specified'}</p>
                    <p><strong>Submitted:</strong> ${new Date().toISOString()}</p>
                `,
            });
            console.log('[audit-request] email sent to hello@itappens.ai');
        } else {
            console.warn('[audit-request] GMAIL_USER / GMAIL_APP_PASSWORD not set — email skipped');
        }
    } catch (emailErr: any) {
        // Log the failure but still tell the user it worked
        console.error('[audit-request] email send failed:', emailErr.message);
    }

    return NextResponse.json({ success: true });
}
