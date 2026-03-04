'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
    {
        icon: '🧬',
        title: 'Semantic Identity Seeding',
        description: 'We structure your brand entity so AI models classify you as a high-confidence, citable expert. Not just mentioned — referenced.',
        metric: '3× citation frequency vs. unseeded brands',
    },
    {
        icon: '⚙️',
        title: 'Information Gain Engineering',
        description: 'Every content piece is crafted for maximum knowledge density — the metric AI models use to decide what to include in their responses.',
        metric: '87% liftability score on key topic clusters',
    },
    {
        icon: '🧩',
        title: 'Technical Schema Injection',
        description: 'Deep JSON-LD deployment (Organization, Service, FAQPage) creates a machine-readable authority layer AI crawlers consume directly.',
        metric: '100% semantic markup coverage per deployment',
    },
    {
        icon: '📊',
        title: 'AI Citation Auditing',
        description: 'We run systematic prompts across ChatGPT, Perplexity, Gemini, and Claude to measure your citation frequency and track growth.',
        metric: 'Bi-weekly citation tracking reports',
    },
];

const engines = ['ChatGPT', 'Perplexity', 'Gemini', 'Claude', 'Grok'];

export default function SolutionSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const fadeUp = (delay = 0) => ({
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay } },
    });

    return (
        <section id="solution" className="section-padding section-alt" ref={ref}>
            <div className="container-wide">
                {/* Header */}
                <motion.div
                    variants={fadeUp(0)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ textAlign: 'center', marginBottom: 80 }}
                >
                    <span className="tag" style={{ marginBottom: 20, display: 'inline-flex' }}>
                        ✳️ The Solution
                    </span>
                    <h2 className="section-h2" style={{ marginBottom: 20 }}>
                        What is Generative Engine Optimization<br />
                        and how does itappens.ai lead it?
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-dim)', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
                        GEO is the discipline of making your brand a high-confidence source
                        inside AI reasoning engines — the systems that answer 4 billion queries a month.
                    </p>
                </motion.div>

                {/* Generative Engine Visual */}
                <motion.div
                    variants={fadeUp(0.2)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 80 }}
                >
                    <div style={{ position: 'relative', width: 400, height: 400 }}>
                        {/* Center core */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 40px rgba(129,140,248,0.2)', '0 0 80px rgba(129,140,248,0.4)', '0 0 40px rgba(129,140,248,0.2)'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 140, height: 140, borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(129,140,248,0.1))',
                                border: '2px solid rgba(129,140,248,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column', zIndex: 10,
                                backdropFilter: 'blur(10px)',
                                overflow: 'hidden'
                            }}
                        >
                            <img src="/logo.png" alt="itappens.ai" style={{ width: '60%', height: '60%', objectFit: 'contain', borderRadius: '50%' }} />
                        </motion.div>

                        {/* Orbit rings */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 280, height: 280, borderRadius: '50%', border: '1px solid var(--border-lo)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 360, height: 360, borderRadius: '50%', border: '1px dashed var(--border-lo)' }} />

                        {/* Orbiting engine nodes */}
                        {engines.map((engine, i) => {
                            const angle = (i / engines.length) * 360;
                            const rad = (angle * Math.PI) / 180;
                            const radius = 140;
                            const x = 200 + radius * Math.cos(rad) - 32;
                            const y = 200 + radius * Math.sin(rad) - 16;
                            return (
                                <motion.div
                                    key={engine}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        left: x,
                                        top: y,
                                        padding: '6px 12px',
                                        borderRadius: 20,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--indigo-border)',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: 'var(--indigo)',
                                        whiteSpace: 'nowrap',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    {engine}
                                </motion.div>
                            );
                        })}

                        {/* Connection lines from center to engines */}
                        <svg style={{ position: 'absolute', inset: 0, width: 400, height: 400, pointerEvents: 'none' }}>
                            {engines.map((engine, i) => {
                                const angle = (i / engines.length) * 360;
                                const rad = (angle * Math.PI) / 180;
                                const radius = 140;
                                const x2 = 200 + radius * Math.cos(rad);
                                const y2 = 200 + radius * Math.sin(rad);
                                return (
                                    <motion.line
                                        key={engine}
                                        x1="200" y1="200" x2={x2} y2={y2}
                                        stroke="var(--indigo-border)"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                                    />
                                );
                            })}
                        </svg>
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
                        >
                            <div style={{ fontSize: '2rem', marginBottom: 16 }}>{p.icon}</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-h)', marginBottom: 10 }}>
                                {p.title}
                            </h3>
                            <p style={{ color: 'var(--text-body)', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: 16 }}>
                                {p.description}
                            </p>
                            <div style={{
                                padding: '8px 14px', borderRadius: 8,
                                background: 'var(--indigo-dim)',
                                border: '1px solid var(--indigo-border)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.775rem', fontWeight: 700, color: 'var(--indigo)',
                            }}>
                                📈 {p.metric}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
