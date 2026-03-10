'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section id="hero" style={{
            minHeight: '100vh',
            padding: '140px 48px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Ghost text */}
            <div style={{
                position: 'absolute',
                right: '-40px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(160px, 22vw, 280px)',
                fontWeight: 800,
                color: 'rgba(232, 213, 163, 0.025)',
                lineHeight: 1,
                pointerEvents: 'none',
                letterSpacing: '-8px',
                userSelect: 'none',
                zIndex: 0
            }}>
                itappens
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-eyebrow"
            >
                <div className="eyebrow-dot" />
                <span className="hero-eyebrow-text">AI Brand Visibility + Content — 2026</span>
                <div className="eyebrow-div" />
                <span style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--muted)' }}>
                    Blocks & Loops Technologies
                </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="headline-xl"
            >
                <span style={{ display: 'block' }}>When your customer</span>
                <span style={{ display: 'block', paddingLeft: 'clamp(32px, 6vw, 80px)', color: 'var(--text2)' }}>
                    asks ChatGPT
                </span>
                <span style={{ display: 'block', paddingLeft: 'clamp(64px, 12vw, 160px)' }}>
                    <span style={{ color: 'var(--accent)' }}>who to trust</span> — <span style={{ WebkitTextStroke: '2px rgba(232,213,163,0.2)', color: 'transparent' }}>your name</span>
                </span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 340px',
                    gap: '48px',
                    marginTop: '48px',
                    alignItems: 'end',
                    zIndex: 1
                }}
                className="hero-sub-row"
            >
                <div className="text-sub" style={{ maxWidth: 480 }}>
                    Your competitors are already appearing in AI answers.<br />
                    Not because they're better — because their brand data is <strong style={{ color: 'var(--text)', fontWeight: 500 }}>structured for AI retrieval</strong> and yours isn't.<br /><br />
                    itappens.ai fixes that. We engineer your brand into ChatGPT, Perplexity, Gemini and Claude recommendations — systematically.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a href="#cta" className="btn-primary">Start Free AI Audit →</a>
                    <a href="#proof" className="btn-secondary">See the Proof</a>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textAlign: 'center' }}>
                        No sales call. Founder-direct. India-focused.
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{
                    marginTop: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border)',
                    maxWidth: '600px',
                    background: 'var(--bg)',
                    zIndex: 1
                }}
            >
                <div style={{
                    padding: '14px 20px',
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap'
                }}>
                    We optimise for
                </div>
                <div style={{ display: 'flex', flex: 1 }}>
                    {['ChatGPT', 'Perplexity', 'Gemini', 'Claude', 'Grok'].map((p, idx) => (
                        <div
                            key={p}
                            style={{
                                flex: 1,
                                padding: '14px 12px',
                                textAlign: 'center',
                                fontSize: '9px',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                borderRight: idx === 4 ? 'none' : '1px solid var(--border)',
                                color: idx === 0 ? 'var(--accent)' : 'var(--muted)',
                                background: idx === 0 ? 'var(--accent-dim)' : 'transparent'
                            }}
                        >
                            {p}
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
