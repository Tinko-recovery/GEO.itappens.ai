'use client';
import { motion } from 'framer-motion';

const plans = [
    {
        id: 'growth',
        name: 'Growth',
        price: '₹4,999',
        period: '/mo',
        description: 'LinkedIn + Twitter/X content, daily. First post live in 5 minutes.',
        highlight: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '₹9,999',
        period: '/mo',
        description: 'Add Instagram Reels + YouTube Shorts. Full multi-channel automation.',
        highlight: true,
    },
    {
        id: 'geo',
        name: 'Pro + GEO',
        price: '₹19,999',
        period: '/mo',
        description: 'Everything in Pro + we make your brand appear in ChatGPT & Perplexity answers.',
        highlight: false,
    },
];

export default function PackagesSection() {
    return (
        <section id="packages" style={{ padding: '80px 48px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="eyebrow" style={{ marginBottom: '16px' }}>
                    <div className="eyebrow-dot" />
                    <span>Pricing</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}
                >
                    <h2 className="headline-lg" style={{ margin: 0, maxWidth: 480 }}>
                        One platform.<br />
                        <span style={{ color: 'var(--accent)' }}>Three ways to grow.</span>
                    </h2>
                    <a href="/pricing" style={{
                        border: '1px solid var(--border)', padding: '12px 24px',
                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                        color: 'var(--muted)', textDecoration: 'none', whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                    }}>
                        See Full Pricing →
                    </a>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}
                    className="plans-grid">
                    {plans.map((plan, idx) => (
                        <motion.div key={plan.id}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                            style={{
                                background: plan.highlight ? 'var(--accent-dim)' : 'var(--bg)',
                                padding: '40px 36px',
                                position: 'relative',
                                borderTop: plan.highlight ? '2px solid var(--accent)' : '2px solid transparent',
                            }}>
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute', top: '0', left: '0', right: '0',
                                    background: 'var(--accent)', textAlign: 'center',
                                    fontSize: '8px', letterSpacing: '2px', padding: '3px',
                                    color: 'var(--bg)', fontWeight: 700, textTransform: 'uppercase',
                                }}>MOST POPULAR</div>
                            )}

                            <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px', marginTop: plan.highlight ? '16px' : 0 }}>
                                itappens {plan.id === 'geo' ? 'GEO' : 'Content'}
                            </div>

                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{plan.name}</div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '16px' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800 }}>{plan.price}</span>
                                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{plan.period}</span>
                            </div>

                            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '28px' }}>{plan.description}</p>

                            <a href={`/signup?plan=${plan.id}`} style={{
                                display: 'block', textAlign: 'center',
                                background: plan.highlight ? 'var(--accent)' : 'transparent',
                                color: plan.highlight ? 'var(--bg)' : 'var(--accent)',
                                border: `1px solid ${plan.highlight ? 'var(--accent)' : 'var(--accent-border)'}`,
                                padding: '12px', fontSize: '10px', letterSpacing: '2px',
                                textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700,
                            }}>
                                Get Started →
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                    Annual plans save up to ₹40K · Discount codes accepted at checkout · <a href="mailto:founder@tinko.in" style={{ color: 'var(--accent)' }}>founder@tinko.in</a>
                </div>
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .plans-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

