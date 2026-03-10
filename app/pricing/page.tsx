'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';

const plans = [
    {
        id: 'growth',
        name: 'Growth',
        tag: 'itappens Content',
        monthly: 4999,
        annual: 49999,
        saving: 10000,
        description: 'Perfect for founders who want consistent, AI-generated content on LinkedIn and Twitter — without lifting a finger.',
        features: [
            'LinkedIn Company Page (daily posts)',
            'Twitter/X (daily posts)',
            'Trend intelligence (HackerNews + Reddit)',
            'AI-generated brand visuals (DALL-E 3)',
            'First post live within 5 minutes of signup',
            'Client dashboard',
        ],
        notIncluded: ['Instagram Reels', 'YouTube Shorts', 'GEO audit'],
        cta: 'Start Growth →',
        href: '/signup?plan=growth',
        accent: false,
        recommended: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        tag: 'itappens Content',
        monthly: 9999,
        annual: 99999,
        saving: 20000,
        description: 'Full multi-channel automation. Daily posts + AI Reels + YouTube Shorts — all channels running on autopilot.',
        features: [
            'Everything in Growth',
            'Instagram Reels (AI video, daily)',
            'YouTube Shorts (same video, auto-posted)',
            'Cinematic 9:16 video with transitions + music',
            'Telegram preview before each post',
            'Priority support',
        ],
        notIncluded: ['GEO audit & strategy'],
        cta: 'Start Pro →',
        href: '/signup?plan=pro',
        accent: true,
        recommended: true,
    },
    {
        id: 'geo',
        name: 'Pro + GEO',
        tag: 'itappens GEO',
        monthly: 19999,
        annual: 199999,
        saving: 40000,
        description: 'Complete AI brand dominance. Everything in Pro + we engineer your brand into ChatGPT, Perplexity, and Gemini answers.',
        features: [
            'Everything in Pro',
            'AI Presence Audit (50+ queries)',
            'GEO strategy & implementation',
            'Monthly AI citation tracking report',
            'Schema + structured data setup',
            'Founder-direct onboarding call',
        ],
        notIncluded: [],
        cta: 'Start Pro + GEO →',
        href: '/signup?plan=geo',
        accent: false,
        recommended: false,
    },
];

export default function PricingPage() {
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

    return (
        <>
            <NavBar />
            <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '120px', paddingBottom: '80px' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', padding: '0 24px 64px' }}>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px' }}>
                            Simple Pricing
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
                            Your brand on autopilot.<br />
                            <span style={{ color: 'var(--accent)' }}>Cancel anytime.</span>
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto 32px' }}>
                            First post goes live within 5 minutes of signup. No long-term commitment on monthly plans.
                        </p>

                        {/* Billing Toggle */}
                        <div style={{ display: 'inline-flex', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                            {(['monthly', 'annual'] as const).map(b => (
                                <button key={b} onClick={() => setBilling(b)} style={{
                                    padding: '10px 24px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                    background: billing === b ? 'var(--accent)' : 'transparent',
                                    color: billing === b ? 'var(--bg)' : 'var(--muted)',
                                    border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700,
                                }}>
                                    {b} {b === 'annual' && <span style={{ fontSize: '8px' }}>SAVE UP TO ₹40K</span>}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Plans Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}
                    className="pricing-grid">
                    {plans.map((plan, idx) => (
                        <motion.div key={plan.id}
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            style={{
                                border: `1px solid ${plan.recommended ? 'var(--accent-border)' : 'var(--border)'}`,
                                background: plan.recommended ? 'var(--accent-dim)' : 'var(--surface)',
                                padding: '36px 32px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px',
                            }}>
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    background: 'var(--accent)', color: 'var(--bg)', fontSize: '8px',
                                    letterSpacing: '2px', padding: '4px 16px', fontWeight: 700, textTransform: 'uppercase',
                                    whiteSpace: 'nowrap',
                                }}>MOST POPULAR</div>
                            )}

                            <div>
                                <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '6px' }}>{plan.tag}</div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '16px' }}>{plan.name}</h2>

                                {/* Price */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>₹</span>
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, lineHeight: 1 }}>
                                            {billing === 'monthly'
                                                ? plan.monthly.toLocaleString('en-IN')
                                                : Math.round(plan.annual / 12).toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>/mo</span>
                                    </div>
                                    {billing === 'annual' && (
                                        <div style={{ fontSize: '10px', color: 'var(--accent)', marginTop: '4px' }}>
                                            Billed ₹{plan.annual.toLocaleString('en-IN')}/yr · Save ₹{plan.saving.toLocaleString('en-IN')}
                                        </div>
                                    )}
                                </div>

                                <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>{plan.description}</p>
                            </div>

                            {/* Features */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: 'var(--text2)' }}>
                                        <span style={{ color: 'var(--accent)', fontSize: '14px', lineHeight: 1.2, flexShrink: 0 }}>✓</span>
                                        {f}
                                    </div>
                                ))}
                                {plan.notIncluded.map(f => (
                                    <div key={f} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: 'var(--muted)', opacity: 0.5 }}>
                                        <span style={{ fontSize: '14px', lineHeight: 1.2, flexShrink: 0 }}>✗</span>
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <a href={`${plan.href}&billing=${billing}`} style={{
                                display: 'block', textAlign: 'center',
                                background: plan.recommended ? 'var(--accent)' : 'transparent',
                                color: plan.recommended ? 'var(--bg)' : 'var(--accent)',
                                border: `1px solid ${plan.recommended ? 'var(--accent)' : 'var(--accent-border)'}`,
                                padding: '14px', fontSize: '10px', letterSpacing: '2px',
                                textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700,
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {plan.cta}
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '12px', color: 'var(--muted)' }}>
                    Have a discount code? Enter it at checkout. · Questions? <a href="mailto:founder@tinko.in" style={{ color: 'var(--accent)' }}>founder@tinko.in</a>
                </div>
            </main>

            <style>{`
                @media (max-width: 900px) {
                    .pricing-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
}
