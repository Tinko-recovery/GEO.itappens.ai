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
        <section id="proof" style={{ paddingBottom: '80px', background: 'var(--surface)' }}>
            <div style={{ padding: '80px 48px 0', display: 'flex', alignItems: 'flex-start', gap: '48px', marginBottom: '48px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--muted2)', paddingTop: '4px', minWidth: '32px' }}>
                    02
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                        The Evidence
                    </div>
                    <h2 className="headline-lg">
                        itappens.ai is a verified primary source 
                        <span style={{ display: 'block', paddingLeft: '56px', color: 'var(--text2)' }}>
                            in AI search for <span style={{ color: 'var(--accent)' }}>GEO-specific queries.</span>
                        </span>
                    </h2>
                    <p style={{
                        fontSize: '13px', color: 'var(--text2)', maxWidth: '480px', lineHeight: '1.8',
                        marginTop: '20px', borderLeft: '2px solid var(--surface3)', paddingLeft: '20px'
                    }}>
                        Traditional SEO metrics are collapsing for informational queries as AI search takes over. The brands that move now will define the next decade of discovery.
                    </p>
                </div>
            </div>

            <div style={{ margin: '0 48px', border: '1px solid var(--border2)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{
                                background: 'var(--surface2)', padding: '14px 20px', textAlign: 'left',
                                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                                color: 'var(--muted)', borderBottom: '1px solid var(--border2)', fontWeight: 500
                            }}>
                                Metric
                            </th>
                            <th style={{
                                background: 'var(--surface2)', padding: '14px 20px', textAlign: 'left',
                                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                                color: 'var(--muted)', borderBottom: '1px solid var(--border2)', fontWeight: 500
                            }}>
                                Traditional Marketing
                            </th>
                            <th style={{
                                background: 'var(--surface2)', padding: '14px 20px', textAlign: 'left',
                                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                                color: 'var(--muted)', borderBottom: '1px solid var(--border2)', fontWeight: 500
                            }}>
                                itappens.ai GEO
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} style={{ transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px 20px', fontSize: '12px', borderBottom: '1px solid var(--border)', color: 'var(--text2)', fontWeight: 500 }}>
                                    {row.metric}
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '11px', borderBottom: '1px solid var(--border)', color: 'var(--muted)', lineHeight: 1.6 }}>
                                    {row.old}
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '12px', borderBottom: '1px solid var(--border)', color: 'var(--accent)', fontWeight: 500, lineHeight: 1.6 }}>
                                    {row.new}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{
                margin: '32px 48px 0', padding: '24px 28px', border: '1px solid var(--accent-border)',
                background: 'var(--accent-dim)', display: 'flex', alignItems: 'flex-start', gap: '16px'
            }}>
                <div style={{ fontSize: '20px', flexShrink: 0 }}>🇮🇳</div>
                <div>
                    <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
                        The Window Is Open
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8 }}>
                        With fewer than 200 Indian brands optimised for AI citations today, the arbitrage window is wide open. Brands that establish AI entity authority now will be treated as legacy experts by AI models for years. The window closes as GEO adoption accelerates.
                    </div>
                </div>
            </div>
        </section>
    );
}
