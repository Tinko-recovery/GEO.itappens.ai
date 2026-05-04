'use client';
import { motion } from 'framer-motion';

export default function ProblemSection() {
    return (
        <section id="problem" style={{ padding: '140px 0', background: 'var(--bg)', position: 'relative', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div className="grid-2col" style={{ gap: '100px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="overline" style={{ color: 'var(--brand-red)', backgroundColor: 'rgba(244, 80, 80, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                            The Information Gap
                        </span>
                        <h2 className="headline-lg" style={{ marginTop: '24px', lineHeight: 1.1 }}>
                            If you aren't a primary source, <br />
                            <span style={{ color: 'var(--brand-red)' }}>you don't exist.</span>
                        </h2>
                        <p className="text-sub" style={{ marginTop: '32px', fontSize: '17px', lineHeight: 1.7, opacity: 0.8 }}>
                            Traditional SEO is built for a world where humans click links. <br /><br />
                            <strong>The 'Blind Spot':</strong> AI models like Perplexity don't search; they synthesize. They ignore rank in favor of entity-authority. If your brand data isn't structured for their reasoning engines, you are invisible to the next generation of buyers.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="card-glass"
                        style={{ padding: '56px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {[
                                { t: 'Hallucination Risk', d: 'Models guess your specs because facts aren\'t seeded.', color: 'var(--brand-yellow)' },
                                { t: 'Citation Loss', d: 'Competitors are cited because their schema is machine-ready.', color: 'var(--brand-blue)' },
                                { t: 'Entity Drift', d: 'AI confuses your brand with legacy data or competitors.', color: 'var(--brand-red)' }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    style={{ display: 'flex', gap: '24px' }}
                                    whileHover={{ x: 10 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    <div style={{ 
                                        width: '4px', height: 'auto', borderRadius: '4px', 
                                        background: item.color, flexShrink: 0
                                    }} />
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text)', marginBottom: '8px' }}>{item.t}</h4>
                                        <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item.d}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
