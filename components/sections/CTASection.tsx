'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shield, Globe2, Users } from 'lucide-react';

export default function CTASection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    return (
        <>
            <section id="contact" className="section-padding-lg layer-top section-base" ref={ref} style={{ position: 'relative', textAlign: 'center' }}>
                {/* Ambient indigo glow */}
                <div style={{
                    position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 700, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)',
                    filter: 'blur(70px)', pointerEvents: 'none',
                }} />

                <div className="container-wide" style={{ position: 'relative' }}>
                    <motion.div
                        initial={{ opacity: 0.01, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.9 }}
                    >

                        <h2
                            style={{
                                fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300,
                                fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', letterSpacing: '0.06em', lineHeight: 1.1,
                                color: 'var(--text-h)', maxWidth: 820, margin: '0 auto 26px',
                            }}
                        >
                            Your competitors are invisible to AI.
                            <br />
                            <span style={{ color: 'var(--indigo)' }}>You don&apos;t have to be.</span>
                        </h2>

                        <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto 48px', color: 'var(--text-body)' }}>
                            itappens.ai — under Blocks and Loops Technologies Pvt Ltd — works with a small number of
                            founders each quarter on direct, strategy-first GEO engagements. No templates. No junior teams.
                        </p>

                        {/* Form */}
                        {!submitted ? (
                            <form
                                onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
                                style={{ display: 'flex', gap: 12, maxWidth: 460, margin: '0 auto 18px', flexWrap: 'wrap', justifyContent: 'center' }}
                            >
                                <input
                                    type="email" required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={{
                                        flex: 1, minWidth: 220, padding: '13px 20px', borderRadius: 8,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--indigo-border)',
                                        color: 'var(--text-h)',
                                        fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--indigo)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--indigo-border)')}
                                />
                                <button type="submit" className="btn-primary">
                                    Start the conversation <ArrowRight size={14} />
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 10,
                                    padding: '13px 28px', borderRadius: 8,
                                    background: 'var(--indigo-dim)', border: '1px solid var(--indigo-border)',
                                    fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--indigo)',
                                    fontSize: '0.88rem', marginBottom: 18, letterSpacing: '0.04em',
                                }}
                            >
                                ✓ &nbsp; Received — we&apos;ll be in touch within 24 hours.
                            </motion.div>
                        )}

                        <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: 72, letterSpacing: '0.06em', fontFamily: 'var(--font-sans)' }}>
                            Founder-to-founder. No sales calls. No obligations.
                        </p>

                        {/* Trust signals */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 52, flexWrap: 'wrap' }}>
                            {[
                                { icon: Globe2, label: 'India-focused GEO practice' },
                                { icon: Shield, label: '90-day citation milestone' },
                                { icon: Users, label: 'Direct strategy engagement' },
                            ].map(b => (
                                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                    <b.icon size={15} color="var(--indigo)" strokeWidth={1.5} />
                                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-body)', letterSpacing: '0.02em' }}>
                                        {b.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-lo)', padding: '36px 40px', background: 'var(--bg-base)', position: 'relative', zIndex: 10 }}>
                <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src="/logo.png" alt="itappens.ai" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', background: '#0D1B3E' }} />
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text-body)', fontSize: '0.84rem' }}>
                            itappens<span style={{ color: 'var(--indigo)' }}>.ai</span>
                            <span style={{ opacity: 0.3, margin: '0 8px' }}>·</span>
                            Blocks &amp; Loops Technologies Pvt Ltd
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {[{ label: 'Privacy', href: '/privacy' }, { label: 'Contact', href: '#contact' }].map(l => (
                            <a
                                key={l.label}
                                href={l.href}
                                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-dim)', fontSize: '0.73rem', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--indigo)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-dim)', fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                        © 2026 itappens.ai · India
                    </p>
                </div>
            </footer>
        </>
    );
}
