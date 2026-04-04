import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
    title: 'Privacy Policy â€” itappens.ai',
    description: 'Privacy Policy for itappens.ai, operated by Blocks and Loops Technologies Pvt Ltd.',
};

export default function PrivacyPage() {
    const sections = [
        {
            title: '1. Who We Are',
            content: `itappens.ai is a Generative Engine Optimization (GEO) practice operated by Blocks and Loops Technologies Pvt Ltd, registered in India. We help brands become reliably cited by AI models such as ChatGPT, Perplexity, Gemini, and Claude.

Contact: hello@itappens.ai`,
        },
        {
            title: '2. Information We Collect',
            content: `We collect only the minimum information required to operate our service:

â€¢ **Contact information** â€” your email address when you submit the contact form on our website.
â€¢ **Usage data** â€” anonymised interaction data collected by standard analytics tools (page views, session duration). No personally identifiable information is stored in analytics.
â€¢ **Communications** â€” any information you voluntarily share when corresponding with us via email.

We do not use cookies beyond those strictly necessary for site function. We do not deploy advertising trackers or third-party data brokers.`,
        },
        {
            title: '3. How We Use Your Information',
            content: `We use the information exclusively for:

â€¢ Responding to your enquiry or request for our services.
â€¢ Sending service-related communications you have explicitly requested.
â€¢ Improving our website and services based on anonymised aggregate data.

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
        },
        {
            title: '4. AI Crawlers & the /llms.txt File',
            content: `itappens.ai maintains a structured data file (/llms.txt) designed to help AI language models understand our services. This file is publicly accessible as plain text so AI systems, humans, and validators can all inspect the same canonical source.

This file contains only business information about itappens.ai and does not include any personal data about visitors or clients.`,
        },
        {
            title: '5. Data Retention',
            content: `Email addresses submitted through our contact form are retained only for the duration necessary to respond to your enquiry. If you enter into a service engagement, records are retained for the period required by applicable Indian law (typically 7 years for business records).

You may request deletion of your personal data at any time by writing to hello@itappens.ai.`,
        },
        {
            title: '6. Your Rights',
            content: `Under the Information Technology Act, 2000 (India) and applicable data protection regulations, you have the right to:

â€¢ Access the personal data we hold about you.
â€¢ Correct inaccurate personal data.
â€¢ Request deletion of your personal data.
â€¢ Withdraw consent for any processing based on consent.
â€¢ Lodge a complaint with the relevant data protection authority.

To exercise any of these rights, contact us at hello@itappens.ai.`,
        },
        {
            title: '7. Data Security',
            content: `We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Our services are hosted on infrastructure with modern security standards and encryption.`,
        },
        {
            title: '8. Third-Party Services',
            content: `Our website may use:

â€¢ **Google Fonts** â€” fonts are loaded from Google's CDN. Google's privacy policy applies.
â€¢ **Vercel** â€” our hosting provider. Vercel's privacy policy applies to infrastructure-level data.

We do not embed third-party social media widgets, advertising networks, or tracking pixels.`,
        },
        {
            title: '9. Children\'s Privacy',
            content: `Our services are intended for business clients. We do not knowingly collect personal data from individuals under 18 years of age.`,
        },
        {
            title: '10. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. The date of the most recent revision is shown at the top of this page. We encourage you to review this policy periodically.`,
        },
        {
            title: '11. Contact',
            content: `For any privacy-related enquiries:

Blocks and Loops Technologies Pvt Ltd
Email: hello@itappens.ai
Website: itappens.ai`,
        },
    ];

    return (
        <main style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '120px 40px 80px', color: 'var(--text-h)' }}>
            <div style={{ maxWidth: 740, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 64 }}>
                    <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 48, fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
                        â† Back to itappens.ai
                    </a>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--indigo)', marginBottom: 16 }}>
                        Legal
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '0.06em', lineHeight: 1.1, color: 'var(--text-h)', marginBottom: 16 }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                        Last updated: March 4, 2026 &nbsp;Â·&nbsp; Blocks and Loops Technologies Pvt Ltd
                    </p>
                </div>

                {/* Intro */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.02rem', lineHeight: 1.85, color: 'var(--text-body)', marginBottom: 52, padding: '20px 20px 20px 20px', borderLeft: '2px solid var(--indigo)', background: 'var(--indigo-dim)', borderRadius: '0 6px 6px 0' }}>
                    Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it. We keep this simple: we collect only what we need, we do not sell your data, and we give you control.
                </p>

                {/* Sections */}
                {sections.map((s, i) => (
                    <div key={i} style={{ marginBottom: 44, paddingBottom: 44, borderBottom: i < sections.length - 1 ? '1px solid var(--border-lo)' : 'none' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.3rem', color: 'var(--text-h)', marginBottom: 16, letterSpacing: '0.03em' }}>
                            {s.title}
                        </h2>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.94rem', lineHeight: 1.85, color: 'var(--text-body)', whiteSpace: 'pre-line' }}>
                            {s.content.split('**').map((seg, j) =>
                                j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-h)', fontWeight: 600 }}>{seg}</strong> : seg
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
