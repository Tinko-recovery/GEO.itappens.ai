'use client';
import { motion } from 'framer-motion';

const rows = [
    {
        metric: 'Visibility Model',
        old: 'Google SERP — declining CTR for info queries',
        new: 'Primary Citation — named directly in AI responses'
    },
    {
        metric: 'Trust Signal',
        old: 'Ranked listing — one of many results',
        new: 'Institutional Authority — AI-endorsed recommendations'
    },
    {
        metric: 'Core Logic',
        old: 'Keyword density and backlinks',
        new: 'Semantic entity + information density'
    },
    {
        metric: 'Market Saturation',
        old: 'Millions of competing domains on Google',
        new: 'Under 1,000 GEO-optimized SaaS brands globally'
    },
    {
        metric: 'Asset Compounding',
        old: 'Rankings fluctuate with algorithm updates',
        new: 'Entity citations compound as LLMs retrain'
    }
];

export default function ProofSection() {
    return (
        <section id="proof" style={{ padding: '120px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'start', marginBottom: '80px' }}>
                    <div>
                        <span className="badge-pill" style={{ marginBottom: '24px' }}>The Evidence</span>
                        <h2 className="headline-lg">Traditional Marketing is failing the AI era.</h2>
                        <p className="text-large" style={{ marginTop: '32px' }}>
                            itappens.ai transitions your brand from traditional "ranking" to institutional "citation". We ensure you are the verified primary source for your industry.
                        </p>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--blue)', paddingLeft: '40px' }}>
                        <p style={{ fontSize: '18px', color: 'var(--slate)', lineHeight: 1.8 }}>
                            "GEO is not just rebranded SEO. It is a new discipline built for how Agentic systems retrieve, synthesize, and cite information."
                        </p>
                    </div>
                </div>

                <div className="card-corporate" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--light-bg)' }}>
                                <th style={{ padding: '24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', color: 'var(--slate)', borderBottom: '1px solid var(--border)' }}>Metric</th>
                                <th style={{ padding: '24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', color: 'var(--slate)', borderBottom: '1px solid var(--border)' }}>Legacy Marketing</th>
                                <th style={{ padding: '24px', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', color: 'var(--blue)', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>itappens.ai System</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '24px', fontWeight: 600, color: 'var(--slate-dark)' }}>{row.metric}</td>
                                    <td style={{ padding: '24px', color: 'var(--slate)', opacity: 0.8 }}>{row.old}</td>
                                    <td style={{ padding: '24px', color: 'var(--blue)', fontWeight: 700 }}>{row.new}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

