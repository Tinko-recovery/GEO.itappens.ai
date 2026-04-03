'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: 'What exactly is Generative Engine Optimisation (GEO)?',
        a: 'GEO is the practice of structuring your brand\'s digital presence so AI models — ChatGPT, Perplexity, Gemini, Claude — recognise, trust, and cite your business when answering relevant queries. Unlike traditional SEO which chases Google rankings, GEO engineers your brand to appear in AI-generated answers. In 2026, when your customer asks "who should I trust for X in India?" — GEO determines whether your name appears or your competitor\'s does.'
    },
    {
        q: 'How does itappens.ai get my brand cited in ChatGPT and Perplexity?',
        a: 'Through four systematic steps: (1) We build your semantic entity — the structured data that tells AI models exactly who you are and what you do. (2) We create information-dense content that AI models extract when answering questions in your category. (3) We deploy comprehensive JSON-LD schema so AI crawlers can verify your authority. (4) We build a corroboration network of third-party references that confirm your entity claims. AI models cite brands they can verify from multiple authoritative sources — we build that verification layer.'
    },
    {
        q: 'How long before I start appearing in AI responses?',
        a: 'Perplexity indexes live web content — most clients see Perplexity citations within 2–4 weeks of deploying the technical layer. ChatGPT and Gemini citations take longer as they depend on training cycles and web crawl schedules — typically 8–12 weeks for consistent citations in our experience. We measure your citation rate with 200+ prompts every two weeks so you can see the progress clearly, not just take our word for it.'
    },
    {
        q: 'What is the ROI compared to traditional SEO or paid ads?',
        a: 'Traditional SEO takes 6–12 months to show results and those rankings disappear the moment you stop. Paid ads stop the instant your budget runs out. GEO citations compound — the more AI models cite you, the more authoritative you become to AI, which drives more citations. A brand that becomes the default AI answer for their category captures high-intent buyers at the moment of decision, before they even click a link. The conversion rate from AI recommendations is significantly higher than from organic search listings.'
    },
    {
        q: 'Do you work with all types of businesses?',
        a: 'We work best with B2B companies, professional service providers (doctors, lawyers, CAs, consultants), real estate developers, SaaS products, and D2C brands with clear category positioning. GEO works for any business where customers research before buying — which is almost every business. We take a small number of clients per quarter to ensure deep, founder-direct engagement. If you\'re looking for a volume agency — we\'re not the right fit.'
    },
    {
        q: 'How do I get started?',
        a: 'Start with a Free AI Presence Audit. We run your brand through 50 targeted AI prompts and send you a report showing exactly where you appear (or don\'t appear) in AI responses today — and where your competitors appear instead. From there, if you\'d like to move forward, we scope a 90-day GEO engagement. No sales call required. You\'ll speak directly with the founder.'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div style={{ padding: '0 48px', display: 'flex', alignItems: 'flex-start', gap: '48px', marginBottom: '48px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--muted2)', paddingTop: '4px', minWidth: '32px' }}>
                    04
                </div>
                <div>
                    <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                        Common Questions
                    </div>
                    <h2 className="headline-lg">
                        Everything you need
                        <span style={{ display: 'block', paddingLeft: '56px', color: 'var(--text2)' }}>
                            to <span style={{ color: 'var(--accent)' }}>decide.</span>
                        </span>
                    </h2>
                </div>
            </div>

            <div style={{ margin: '0 48px', border: '1px solid var(--border2)' }}>
                {faqs.map((faq, idx) => (
                    <div key={idx} style={{ borderBottom: idx === faqs.length - 1 ? 'none' : '1px solid var(--border)' }}>
                        <div
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            style={{
                                padding: '22px 28px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', gap: '24px', transition: 'background 0.2s',
                                background: openIndex === idx ? 'var(--surface)' : 'transparent'
                            }}
                            onMouseEnter={(e) => !openIndex && (e.currentTarget.style.background = 'var(--surface)')}
                            onMouseLeave={(e) => openIndex !== idx && (e.currentTarget.style.background = 'transparent')}
                        >
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--text)', lineHeight: 1.3 }}>
                                {faq.q}
                            </div>
                            <div style={{
                                fontSize: '18px', color: 'var(--accent)', flexShrink: 0,
                                transform: openIndex === idx ? 'rotate(45deg)' : 'none',
                                transition: 'transform 0.3s', fontFamily: 'var(--font-body)'
                            }}>
                                +
                            </div>
                        </div>
                        <AnimatePresence>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{
                                        padding: '0 28px 22px 28px', fontSize: '12px', color: 'var(--text2)',
                                        lineHeight: 1.9, borderTop: '1px solid var(--border)', paddingTop: '18px'
                                    }}>
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
