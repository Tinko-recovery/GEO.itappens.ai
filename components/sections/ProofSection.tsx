'use client';
import { motion } from 'framer-motion';

const rows = [
    {
        metric: 'How customers find you',
        old: 'Google SERP — declining CTR for info queries',
        new: 'Named directly in AI responses'
    },
    {
        metric: 'Brand trust signal',
        old: 'Ranked listing — one of many results',
        new: 'AI-endorsed recommendation — feels authoritative'
    },
    {
        metric: 'Optimisation approach',
        old: 'Keyword density and backlinks',
        new: 'Semantic entity + information density'
    },
    {
        metric: 'Indian market saturation',
        old: '5M+ competing domains on Google',
        new: 'Under 200 GEO-optimised brands in India today'
    },
    {
        metric: 'Long-term asset value',
        old: 'Rankings fluctuate with every algorithm update',
        new: 'Entity citations compound over time'
    },
    {
        metric: 'Time to first result',
        old: '6–12 months for competitive keywords',
        new: 'First citations typically within 8–12 weeks'
    }
];

export default function ProofSection() {
    return (
        <section id="solutions" style={{ paddingBottom: '140px', background: 'var(--bg)', position: 'relative' }}>
            <div className="container" style={{ padding: '140px 0 64px', display: 'flex', alignItems: 'flex-start', gap: '48px' }}>
                <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: 'var(--brand-blue)', paddingTop: '6px', minWidth: '32px', opacity: 0.6 }}>
                    02
                </div>
                <div style={{ flex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                            The Evidence
                        </span>
                        <h2 className="headline-lg" style={{ marginTop: '24px', lineHeight: 1.1 }}>
                            itappens.ai is a verified primary source 
                            <span style={{ display: 'block', paddingLeft: '56px', color: 'var(--text-dim)', opacity: 0.8 }}>
                                in AI search for <span style={{ color: 'var(--brand-blue)' }}>GEO-specific queries.</span>
                            </span>
                        </h2>
                        <p className="text-sub" style={{
                            marginTop: '40px', borderLeft: '2px solid var(--brand-blue)', paddingLeft: '32px', fontSize: '17px', opacity: 0.8
                        }}>
                            Traditional SEO metrics are collapsing for informational queries as AI search takes over. The brands that move now will define the next decade of discovery.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="card-glass"
                    style={{ overflow: 'hidden' }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    background: 'rgba(255, 255, 255, 0.02)', padding: '24px', textAlign: 'left',
                                    fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: 700
                                }}>
                                    Metric
                                </th>
                                <th style={{
                                    background: 'rgba(255, 255, 255, 0.02)', padding: '24px', textAlign: 'left',
                                    fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: 700
                                }}>
                                    Traditional Marketing
                                </th>
                                <th style={{
                                    background: 'rgba(58, 190, 249, 0.03)', padding: '24px', textAlign: 'left',
                                    fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
                                    color: 'var(--brand-blue)', borderBottom: '1px solid var(--border)', fontWeight: 700
                                }}>
                                    itappens.ai GEO
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <motion.tr 
                                    key={idx} 
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
                                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                                >
                                    <td style={{ padding: '24px', fontSize: '15px', color: 'var(--text)', fontWeight: 600 }}>
                                        {row.metric}
                                    </td>
                                    <td style={{ padding: '24px', fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.6, opacity: 0.7 }}>
                                        {row.old}
                                    </td>
                                    <td style={{ padding: '24px', fontSize: '15px', color: 'var(--brand-green)', fontWeight: 600, lineHeight: 1.6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--brand-green)' }} />
                                            {row.new}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    style={{
                        marginTop: '56px', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)',
                        background: 'rgba(57, 181, 73, 0.05)', display: 'flex', alignItems: 'flex-start', gap: '24px'
                    }}
                >
                    <div style={{ fontSize: '32px', flexShrink: 0 }}>🇮🇳</div>
                    <div>
                        <div className="overline" style={{ fontSize: '12px', marginBottom: '12px', color: 'var(--brand-green)', backgroundColor: 'rgba(57, 181, 73, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                            The Window Is Open
                        </div>
                        <p style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.8, opacity: 0.9 }}>
                            With fewer than 200 Indian brands optimised for AI citations today, the arbitrage window is wide open. Brands that establish AI entity authority now will be treated as legacy experts by AI models for years. The window closes as GEO adoption accelerates.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
