'use client';
import { motion } from 'framer-motion';

export default function ProblemSection() {
    return (
        <section id="problem" style={{ padding: '120px 0', background: 'var(--surface)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="overline">The Information Gap</span>
                        <h2 className="headline-lg" style={{ marginTop: '20px' }}>
                            If you aren't a primary source, <br />
                            <span style={{ color: 'var(--accent)' }}>you don't exist.</span>
                        </h2>
                        <p className="text-sub" style={{ marginTop: '24px' }}>
                            Traditional SEO is built for a world where humans click links. <br /><br />
                            <strong>The 'Blind Spot':</strong> AI models like Perplexity don't search; they synthesize. They ignore rank in favor of entity-authority. If your brand data isn't structured for their reasoning engines, you are invisible to the next generation of buyers.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            padding: '40px',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { t: 'Hallucination Risk', d: 'Models guess your specs because facts aren\'t seeded.' },
                                { t: 'Citation Loss', d: 'Competitors are cited because their schema is machine-ready.' },
                                { t: 'Entity Drift', d: 'AI confuses your brand with legacy data or competitors.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ 
                                        width: '8px', height: '8px', borderRadius: '50%', 
                                        background: 'var(--accent)', marginTop: '8px' 
                                    }} />
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{item.t}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
