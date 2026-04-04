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
            // Internal notification
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

            // Thank-you to customer
            const firstName = name ? name.split(' ')[0] : 'there';
            await transporter.sendMail({
                from: `"itappens.ai" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: `We've received your AI Audit request — itappens.ai`,
                html: `
                    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;">
                      <div style="padding:32px 0 16px;">
                        <span style="font-size:20px;font-weight:800;letter-spacing:-0.03em;">
                          it<span style="color:#6366f1;">appens</span>.ai
                        </span>
                      </div>
                      <h2 style="font-size:22px;font-weight:700;margin:0 0 16px;letter-spacing:-0.03em;">
                        Got it, ${firstName}. Your audit is queued.
                      </h2>
                      <p style="color:#475569;line-height:1.75;margin:0 0 16px;">
                        We've received your Free AI Audit request for <strong>${website}</strong>.
                        We'll run 50+ targeted prompts across ChatGPT, Perplexity, Gemini, and Claude
                        to map exactly where your brand stands — and where your competitors are taking your spot.
                      </p>
                      <p style="color:#475569;line-height:1.75;margin:0 0 32px;">
                        Expect to hear from us within <strong>24 hours</strong>. No sales call. Just the data.
                      </p>
                      <a href="https://www.itappens.ai" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;text-decoration:none;">
                        Learn more about GEO →
                      </a>
                      <hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px;" />
                      <p style="font-size:12px;color:#94a3b8;line-height:1.6;">
                        itappens.ai · The Citation Layer for the AI Web<br/>
                        Reply to this email anytime — it goes straight to the principal.
                      </p>
                    </div>
                `,
            });
            console.log(`[audit-request] thank-you sent to ${email}`);
        } else {
            console.warn('[audit-request] GMAIL_USER / GMAIL_APP_PASSWORD not set — email skipped');
        }
    } catch (emailErr: any) {
        // Log the failure but still tell the user it worked
        console.error('[audit-request] email send failed:', emailErr.message);
    }

    return NextResponse.json({ success: true });
}
