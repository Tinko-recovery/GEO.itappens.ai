import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Ensure the API key exists
const sendgridKey = process.env.SENDGRID_API_KEY;

if (sendgridKey) {
    sgMail.setApiKey(sendgridKey);
}

export async function POST(request: Request) {
    try {
        const { email, website, competitor } = await request.json();

        if (!email || !website || !competitor) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!sendgridKey) {
            console.warn('SENDGRID_API_KEY is missing. Mocking success for the form submission.');
            // Fallback/mock if the key is not set so the UI doesn't break
            return NextResponse.json({ success: true, mocked: true });
        }

        const msg = {
            to: 'founder@tinko.in', // The recipient
            from: 'founder@tinko.in', // Your verified sender address on SendGrid
            replyTo: email,
            subject: `New AI Audit Request -> ${website}`,
            text: `New Request for Free AI Audit:\n\nContact Email: ${email}\nWebsite URL: ${website}\nCompetitor URL: ${competitor}`,
            html: `
        <h2>New Request for Free AI Audit</h2>
        <p><strong>Contact Email:</strong> ${email}</p>
        <p><strong>Website URL:</strong> <a href="${website}">${website}</a></p>
        <p><strong>Competitor URL:</strong> <a href="${competitor}">${competitor}</a></p>
      `,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('SendGrid Error:', error?.response?.body || error.message);
        return NextResponse.json(
            { error: 'Failed to send email via SendGrid' },
            { status: 500 }
        );
    }
}
