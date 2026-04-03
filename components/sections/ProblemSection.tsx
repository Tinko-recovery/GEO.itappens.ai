'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const voidCards = [
    {
        title: 'The AI Visibility Gap',
        description: 'Traditional SEO is dying. itappens.ai benchmarks show that while you rank on Google Page 1, AI agents are recommending your competitors because your brand data isn\'t structured for LLM retrieval.',
        icon: true,
        subtext: 'The Recommendation Void',
        subtextDesc: 'If Perplexity or ChatGPT can\'t cite you with high confidence, you are invisible to the next generation of buyers.'
    },
    {
        title: 'Citation Crisis',
        description: 'Standard metadata isn\'t enough. We bridge the gap between human-readable content and machine-extractable facts for AI models.',
        icon: true,
        isSmall: true
    },
    {
        title: 'Lost Authority',
        description: 'Don\'t let AI hallucinations define your brand. We seed the "Truth Layer" so models like Claude and Gemini speak about you accurately.',
        icon: true,
        isSmall: true
    }
];

export default function ProblemSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="problem" className="layer-top" style={{ padding: '100px 24px', position: 'relative' }} ref={ref}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ marginBottom: 60 }}
                >
                    <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        color: 'var(--text-dim)',
                        letterSpacing: '0.05em',
                        marginBottom: 16,
                        display: 'block'
                    }}>
                        Current Status
                    </span>
                    <h2 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 800,
                        color: 'var(--text-h)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                        marginBottom: 24
                    }}>
                        itappens.ai
                    </h2>
                    <a href="#contact" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'var(--accent)',
                        fontSize: '1.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)'
                    }}>
                        Get AI-cited <ChevronRight size={32} />
                    </a>
                </motion.div>

                {/* Void Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, alignItems: 'start' }}>
                    {/* Main Card (Left) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ gridColumn: 'span 5' }}
                    >
                        <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-h)', marginBottom: 20 }}>
                            {voidCards[0].title}
                        </h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 40 }}>
                            {voidCards[0].description}
                        </p>

                        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                            <div style={{
                                width: 50, height: 50, borderRadius: '50%', border: '1px solid var(--accent-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <img src="/logo.png" style={{ width: '70%', height: '70%', objectFit: 'contain' }} alt="ia" />
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{voidCards[0].subtext}</h4>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.5 }}>{voidCards[0].subtextDesc}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Smaller Cards Group (Right) */}
                    <div style={{ gridColumn: 'span 7', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                        {voidCards.slice(1).map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.4 + (i * 0.1) }}
                                style={{
                                    padding: '0 32px',
                                    borderLeft: '1px solid var(--border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{
                                    width: 60, height: 60, borderRadius: '50%', border: '1px solid var(--accent-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                                    background: 'rgba(0, 245, 255, 0.02)'
                                }}>
                                    <img src="/logo.png" style={{ width: '65%', height: '65%', objectFit: 'contain' }} alt="ia" />
                                </div>
                                <h4 style={{ color: 'var(--text-h)', fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>{card.title}</h4>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 220 }}>{card.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer labels (mockup) */}
                <div style={{
                    marginTop: 80,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 40,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 32
                }}>
                    {['Approach', 'Proof', 'FAQ'].map((label, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--text-h)', fontSize: '0.95rem' }}>{label}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}
