'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
    {
        icon: '🧬',
        title: 'Semantic Identity Seeding',
        description: 'Establishing brand entities within the LLM latent space through redundant semantic signals and knowledge graph blueprints. No longer just a keyword — your brand becomes a known entity.',
        metric: '3.8× higher entity confidence scores',
    },
    {
        icon: '⚡',
        title: 'Information Gain Sprint',
        description: 'Engineering 40-60 word "Golden Snippets" that provide unique data points. These are verbatim-liftable segments designed for AI reasoning engine extraction.',
        metric: '87% verbatim extraction rate in testing',
    },
    {
        icon: '🏗️',
        title: 'Machine-Readable Infrastructure',
        description: 'Deep JSON-LD Schema (Organization, Service, FAQ) that provides the mathematical corroboration AI models require to verify entity claims.',
        metric: '100% semantic verification on deployment',
    },
    {
        icon: '📈',
        title: 'AI Citation Auditing',
        description: 'Continuous monitoring across ChatGPT, Gemini, and Perplexity. We audit where brand citation is lost and recover brand presence through iterative GEO loops.',
        metric: 'Bi-weekly AI Presence Delta reports',
    },
];

const engines = ['ChatGPT', 'Perplexity', 'Gemini', 'Claude', 'Grok'];

export default function SolutionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });

    const fadeUp = (delay = 0) => ({
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay } },
    });

    return (
        <section id="system" className="section-padding section-alt" ref={ref}>
            <div className="container-wide">
                {/* Header */}
                <motion.div
                    variants={fadeUp(0)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ textAlign: 'center', marginBottom: 80 }}
                >
                    <span className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 20 }}>
                        The Solution Stack
                    </span>
                    <h2 className="headline-lg" style={{ maxWidth: 850, margin: '0 auto 20px' }}>
                        The 4-Pillar Framework for <span style={{ color: 'var(--accent)' }}>AI-Cited Brands.</span>
                    </h2>
                    <p className="body-lg" style={{ maxWidth: 640, margin: '0 auto' }}>
                        In 2026, brands are no longer ranked; they are cited. Our GEO stack transition your digital presence from invisible text to <strong style={{ color: 'var(--accent)' }}>authoritative knowledge.</strong>
                    </p>
                </motion.div>

                {/* Generative Engine Visual */}
                <motion.div
                    variants={fadeUp(0.2)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 100 }}
                >
                    <div style={{ position: 'relative', width: 440, height: 440 }}>
                        {/* Center core - The Brand Identity */}
                        <motion.div
                            animate={{ scale: [0.98, 1.05, 0.98] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 120, height: 120, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
                                border: '1px solid var(--accent-border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10,
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 0 60px rgba(0, 245, 255, 0.15)'
                            }}
                        >
                            <img src="/logo.png" alt="itappens.ai" style={{ width: '65%', height: '65%', objectFit: 'contain', borderRadius: '50%' }} />
                        </motion.div>

                        {/* Orbit rings */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 260, height: 260, borderRadius: '50%', border: '1px solid var(--border-lo)', opacity: 0.5 }} />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 340, height: 340, borderRadius: '50%', border: '1px dashed var(--accent-border)', opacity: 0.2 }}
                        />

                        {/* Rotating Node Container */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', inset: 0 }}
                        >
                            {engines.map((engine, i) => {
                                const angle = (i / engines.length) * 360;
                                const rad = (angle * Math.PI) / 180;
                                const radius = 175;
                                const x = 220 + radius * Math.cos(rad);
                                const y = 220 + radius * Math.sin(rad);
                                return (
                                    <motion.div
                                        key={engine}
                                        style={{
                                            position: 'absolute',
                                            left: x,
                                            top: y,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: 20,
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid var(--border)',
                                                backdropFilter: 'blur(8px)',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: 'var(--text-h)',
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            }}
                                            whileHover={{ scale: 1.1, borderColor: 'var(--accent)', color: 'var(--accent)' }}
                                        >
                                            {engine}
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                            style={{ position: 'absolute', inset: 0, width: 440, height: 440, pointerEvents: 'none', opacity: 0.2 }}
                        >
                            {engines.map((engine, i) => {
                                const angle = (i / engines.length) * 360;
                                const rad = (angle * Math.PI) / 180;
                                const radius = 175;
                                const x2 = 220 + radius * Math.cos(rad);
                                const y2 = 220 + radius * Math.sin(rad);
                                return (
                                    <line
                                        key={engine}
                                        x1="220" y1="220" x2={x2} y2={y2}
                                        stroke="url(#lineGradient)"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                    />
                                );
                            })}
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
                                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </motion.svg>
                    </div>
                </motion.div>

                {/* Pillars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                    {pillars.map((p, i) => (
                        <motion.div
                            key={p.title}
                            variants={fadeUp(0.3 + i * 0.1)}
                            initial="hidden"
                            animate={isInView ? 'visible' : 'hidden'}
                            className="phase-card"
                            style={{ background: 'rgba(255, 255, 255, 0.015)', borderColor: 'rgba(255,255,255,0.05)' }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: 16, opacity: 0.8 }}>{p.icon}</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-h)', marginBottom: 12, fontStyle: 'italic' }}>
                                {p.title}
                            </h3>
                            <p className="body-lg" style={{ fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 20, opacity: 0.8 }}>
                                {p.description}
                            </p>
                            <div style={{
                                padding: '10px 16px', borderRadius: 10,
                                background: 'var(--accent-dim)',
                                border: '1px solid var(--accent-border)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                                display: 'inline-flex', alignItems: 'center', gap: 8
                            }}>
                                <span style={{ fontSize: '1rem' }}>📈</span> {p.metric}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
