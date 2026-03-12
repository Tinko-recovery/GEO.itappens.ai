import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Ensure the API key exists
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

export async function POST(request: Request) {
    try {
        const { email, website, competitor } = await request.json();

        if (!email || !website || !competitor) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!resend) {
            console.warn('RESEND_API_KEY is missing. Mocking success for the form submission.');
            // Fallback/mock if the key is not set so the UI doesn't break
            return NextResponse.json({ success: true, mocked: true });
        }

        const { data, error } = await resend.emails.send({
            from: 'itappens.ai <onboarding@resend.dev>', // Resend's default testing domain or use a verified one
            to: 'founder@tinko.in',
            replyTo: email,
            subject: `New AI Audit Request -> ${website}`,
            text: `New Request for Free AI Audit:\n\nContact Email: ${email}\nWebsite URL: ${website}\nCompetitor URL: ${competitor}`,
            html: `
        <h2>New Request for Free AI Audit</h2>
        <p><strong>Contact Email:</strong> ${email}</p>
        <p><strong>Website URL:</strong> <a href="${website}">${website}</a></p>
        <p><strong>Competitor URL:</strong> <a href="${competitor}">${competitor}</a></p>
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
