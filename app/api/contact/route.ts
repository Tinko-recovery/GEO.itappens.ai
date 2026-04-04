import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Ensure the API key exists
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

export async function POST(request: Request) {
    try {
        const { name, email, website, visibility } = await request.json();

        if (!email || !website) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!resend) {
            console.warn('RESEND_API_KEY is missing. Mocking success for the form submission.');
            return NextResponse.json({ success: true, mocked: true });
        }

        const { data, error } = await resend.emails.send({
            from: 'itappens.ai <onboarding@resend.dev>',
            to: 'hello@itappens.ai',
            replyTo: email,
            subject: `New GEO Audit Request → ${website}`,
            html: `
        <h2>New GEO Audit Request</h2>
        <p><strong>Name:</strong> ${name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
        <p><strong>Current AI Visibility:</strong> ${visibility || 'Not specified'}</p>
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json(
                { error: 'Failed to send email via Resend' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
