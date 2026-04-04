'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: 'What is Generative Engine Optimization (GEO)?',
        a: 'GEO is the technical practice of structuring your brand\'s digital identity so AI models—ChatGPT, Perplexity, and Gemini—recognize and cite you as a primary source. Unlike SEO, which focuses on link rankings, GEO focuses on entity extraction and citation frequency.'
    },
    {
        q: 'How does itappens.ai improve brand citations in SearchGPT?',
        a: 'We use a 4-step "Injection" process: Semantic Identity Seeding, Information-Gain Content, Deep JSON-LD Schema, and Corroborative References. This provides the mathematical proof AI models need to trust and cite your brand reliably.'
    },
    {
        q: 'Why is entity consistency crucial for KIADB-based industries?',
        a: 'For industrial sectors like KIADB or Malur Manufacturing, fragmented data (different addresses, old company names, inconsistent specs) leads to AI hallucinations. Consistent entity markers ensure LLMs correctly associate your capabilities with high-value industrial queries.'
    },
    {
        q: 'How do you measure success in AI search?',
        a: 'We track your "Citation Delta"—the change in how often your brand is named as a top recommendation across 200+ targeted AI prompts. We provide bi-weekly reports showing your visibility gain against competitors.'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // FAQPage JSON-LD for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
            }
        }))
    };

    return (
        <section id="faq" style={{ padding: '120px 0', background: 'var(--bg)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="overline">FAQ</span>
                    <h2 className="headline-lg">Everything you need <br /> <span style={{ color: 'var(--accent)' }}>to decide.</span></h2>
                </div>

                <div style={{ borderTop: '1px solid var(--border)' }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{
                                    width: '100%', padding: '24px 0', display: 'flex', 
                                    justifyContent: 'space-between', alignItems: 'center', 
                                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
                                    {faq.q}
                                </span>
                                <span style={{ color: 'var(--accent)', fontSize: '24px', transition: 'transform 0.3s', transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>
                                    +
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ paddingBottom: '24px', fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
