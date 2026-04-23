import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: 'Privacy Policy | itappens.ai',
    description: 'Privacy Policy for itappens.ai, detailing how we handle data and respect your privacy in the AI-first era.',
};

export default function PrivacyPage() {
    const sections = [
        {
            title: '1. Who We Are',
            content: `itappens.ai is a Generative Engine Optimization (GEO) practice. We help brands become reliably cited by AI models such as ChatGPT, Perplexity, Gemini, and Claude.

Email: hello@itappens.ai`,
        },
        {
            title: '2. Information We Collect',
            content: `We collect only the minimum information required to operate our service:

• **Contact information** — your email address when you submit the contact form on our website.
• **Usage data** — anonymised interaction data collected by standard analytics tools (page views, session duration). No personally identifiable information is stored in analytics.
• **Communications** — any information you voluntarily share when corresponding with us via email.

We do not use cookies beyond those strictly necessary for site function. We do not deploy advertising trackers or third-party data brokers.`,
        },
        {
            title: '3. How We Use Your Information',
            content: `We use the information exclusively for:

• Responding to your enquiry or request for our services.
• Sending service-related communications you have explicitly requested.
• Improving our website and services based on anonymised aggregate data.

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
        },
        {
            title: '4. AI Crawlers & Visibility',
            content: `itappens.ai maintains a structured data file (/llms.txt) designed to help AI language models understand our services. This file is publicly accessible so AI systems, humans, and search engines can inspect the same canonical source.

This file contains only business information about itappens.ai and does not include any personal data about visitors or clients.`,
        },
        {
            title: '5. Data Retention',
            content: `Email addresses submitted through our contact form are retained only for the duration necessary to respond to your enquiry. If you enter into a service engagement, records are retained for the period required by applicable business standards.

You may request deletion of your personal data at any time by writing to hello@itappens.ai.`,
        },
        {
            title: '6. Your Rights',
            content: `You have the right to:

• Access the personal data we hold about you.
• Correct inaccurate personal data.
• Request deletion of your personal data.
• Withdraw consent for any processing based on consent.

To exercise any of these rights, contact us at hello@itappens.ai.`,
        },
        {
            title: '7. Data Security',
            content: `We implement industry-standard technical measures to protect your personal data against unauthorised access. Our services are hosted on infrastructure with modern security standards and encryption.`,
        },
    ];

    return (
        <div className="page-shell">
            <NavBar />
            <main>
                <header className="section" style={{ padding: '160px 0 60px', backgroundColor: 'var(--bg)' }}>
                    <div className="container-narrow">
                        <a href="/" className="overline" style={{ textDecoration: 'none', marginBottom: '32px', display: 'inline-block' }}>
                            ← Back to home
                        </a>
                        <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
                            Privacy <br />
                            <span style={{ color: 'var(--accent)' }}>Policy.</span>
                        </h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                            Last updated: April 7, 2026
                        </p>
                    </div>
                </header>

                <section className="section" style={{ padding: '0 0 120px' }}>
                    <div className="container-narrow">
                        <div style={{ 
                            padding: '32px', 
                            backgroundColor: 'var(--accent-soft)', 
                            borderLeft: '4px solid var(--accent)', 
                            borderRadius: '0 24px 24px 0',
                            marginBottom: '64px'
                        }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>Summary</p>
                            <p style={{ fontSize: '17px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                                Your privacy matters to us. We collect only what we need, we do not sell your data, and we give you full control.
                            </p>
                        </div>

                        <article className="article-body">
                            {sections.map((s, i) => (
                                <div key={i} style={{ marginBottom: '56px', paddingBottom: '56px', borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                    <h2 className="headline-sm" style={{ marginBottom: '24px', color: 'var(--text)' }}>
                                        {s.title}
                                    </h2>
                                    <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-dim)', whiteSpace: 'pre-line' }}>
                                        {s.content}
                                    </div>
                                </div>
                            ))}
                        </article>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
