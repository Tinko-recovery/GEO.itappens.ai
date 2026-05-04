'use client';
import { motion } from 'framer-motion';

const bentoFeatures = [
    {
        num: '01',
        title: 'Entity Correction',
        body: 'Most brands suffer from "Entity Drift"—outdated data across the web. We build a unified Semantic Identity that AI models like Perplexity and SearchGPT trust and recommend.',
        tag: 'Identity Seal'
    },
    {
        num: '02',
        title: 'Information-Gain Engine',
        body: 'AI models cite sources that provide unique, data-dense information. We engineer High-Information Content designed to be extracted and quoted by AI reasoning engines.',
        tag: 'Authority Seeding'
    },
    {
        num: '03',
        title: 'Citation Analytics',
        body: 'Measuring GEO performance is different from SEO. We track your brand\'s citation frequency across 200+ targeted prompts in ChatGPT, Claude, and Gemini every two weeks.',
        tag: 'Verification'
    }
];

export default function SolutionSection() {
    return (
        <section id="system" style={{ padding: '120px 0' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="overline">The Citation Engine</span>
                    <h2 className="headline-lg">A 3-Pillar Solution for <br /> <span style={{ color: 'var(--accent)' }}>AI-First Visibility.</span></h2>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '24px' 
                }}>
                    {bentoFeatures.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            className="card-bento"
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                            }}>
                                <span className="overline" style={{ margin: 0 }}>{f.num}</span>
                                <span style={{ 
                                    fontSize: '10px', padding: '4px 10px', 
                                    background: 'var(--surface-alt)', border: '1px solid var(--border)', 
                                    borderRadius: '100px', fontWeight: 600, color: 'var(--text-dim)'
                                }}>
                                    {f.tag}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '10px' }}>{f.title}</h3>
                            <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-dim)' }}>
                                {f.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
