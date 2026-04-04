import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter =
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
        ? nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_APP_PASSWORD,
              },
          })
        : null;

export async function POST(request: Request) {
    try {
        const { name, email, website, visibility } = await request.json();

        if (!email || !website) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!transporter) {
            console.warn('Gmail credentials missing. Mocking success.');
            return NextResponse.json({ success: true, mocked: true });
        }

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
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
