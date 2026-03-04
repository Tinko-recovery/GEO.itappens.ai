'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const rows = [
    {
        metric: 'Discovery Channel',
        old: 'Google Page 1 ranking',
        new: 'AI-generated response citation',
    },
    {
        metric: 'Average CTR (India)',
        old: '1.9% (informational queries)',
        new: '14.3% trust-to-action rate',
    },
    {
        metric: 'Optimization Target',
        old: 'Crawler bots & keyword density',
        new: 'AI reasoning confidence scores',
    },
    {
        metric: 'Result Lifespan',
        old: '2–6 weeks before algorithm shift',
        new: 'Persistent semantic entity — months',
    },
    {
        metric: 'Brand Control',
        old: 'Zero — algo decides ranking',
        new: 'High — structured identity seeding',
    },
    {
        metric: 'Indian Market Edge',
        old: 'Saturated — 5M+ competing domains',
        new: 'Untapped — <200 GEO-optimized brands',
    },
    {
        metric: 'B2B Trust Signal',
        old: 'Baseline',
        new: '4.2× higher with AI citation',
    },
];

export default function ProofSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const fadeUp = (delay = 0) => ({
        hidden: { y: 40, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay } },
    });

    return (
        <section id="proof" className="section-padding section-base" ref={ref}>
            <div className="container-wide">
                {/* Header */}
                <motion.div
                    variants={fadeUp(0)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ textAlign: 'center', marginBottom: 64 }}
                >
                    <span className="tag" style={{ marginBottom: 20, display: 'inline-flex' }}>
                        📊 The Proof
                    </span>
                    <h2 className="section-h2" style={{ marginBottom: 20 }}>
                        What results does itappens.ai deliver<br />
                        vs traditional digital agencies?
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-dim)', maxWidth: 560, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
                        The numbers tell the story. GEO is not iterating on SEO — it is a fundamentally superior channel for the 2026 discovery landscape.
                    </p>
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    variants={fadeUp(0.2)}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', background: 'var(--bg-card)' }}
                >
                    <table className="cmp-table" style={{ width: '100%' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                                <th style={{ color: 'var(--text-dim)', padding: '20px 28px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Metric</th>
                                <th style={{ padding: '20px 28px', opacity: 0.7, color: 'var(--text-h)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ background: 'rgba(90,100,120,0.3)', borderRadius: 4, padding: '3px 8px', fontSize: '0.7rem', color: '#FFF' }}>OLD</span>
                                        Traditional SEO
                                    </span>
                                </th>
                                <th style={{ padding: '20px 28px', color: 'var(--indigo)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ background: 'var(--indigo-dim)', border: '1px solid var(--indigo-border)', borderRadius: 4, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--indigo)' }}>NEW</span>
                                        GEO · itappens.ai
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <motion.tr
                                    key={row.metric}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.15)' }}
                                >
                                    <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-h)', padding: '18px 28px', borderBottom: '1px solid var(--border-lo)' }}>
                                        {row.metric}
                                    </td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--text-dim)', padding: '18px 28px', borderBottom: '1px solid var(--border-lo)', textDecoration: 'line-through', opacity: 0.7 }}>
                                        {row.old}
                                    </td>
                                    <td style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--indigo)', padding: '18px 28px', borderBottom: '1px solid var(--border-lo)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ color: 'var(--indigo)', fontSize: 10 }}>▶</span>
                                            {row.new}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Bottom Call-out */}
                <motion.div
                    variants={fadeUp(0.5)}
                    initial="hidden"
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    style={{
                        marginTop: 40, padding: 32, borderRadius: 16,
                        background: 'var(--indigo-dim)',
                        border: '1px solid var(--indigo-border)',
                        display: 'flex', alignItems: 'center', gap: 24,
                    }}
                >
                    <div style={{ fontSize: '2.5rem' }}>🇮🇳</div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.2rem', color: 'var(--text-h)', marginBottom: 6 }}>
                            India&apos;s Untapped GEO Window — Closes in 2026
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Fewer than 200 Indian brands are GEO-optimized today. Early movers will be permanently encoded as the default
                            answers in AI for their category. This window will not reopen.
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
