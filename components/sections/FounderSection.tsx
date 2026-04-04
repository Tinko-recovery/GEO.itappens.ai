'use client';
import { motion } from 'framer-motion';

export default function FounderSection() {
    return (
        <section id="founder" style={{ padding: '120px 0', background: 'var(--bg)' }}>
            <div className="container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1.2fr', 
                    gap: '80px', 
                    alignItems: 'center',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '60px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Visual Accent */}
                    <div style={{ 
                        position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', 
                        background: 'var(--accent)' 
                    }} />

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div style={{ 
                            width: '80px', height: '80px', borderRadius: '12px', 
                            background: 'var(--accent-muted)', border: '1px solid var(--border-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
                            color: 'var(--accent)', marginBottom: '32px'
                        }}>
                            SS
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
                            Sadish Sugumaran
                        </h2>
                        <span className="overline" style={{ fontSize: '11px', marginBottom: '24px' }}>
                            Founder, itappens.ai
                        </span>
                        <div style={{ 
                            padding: '16px 20px', background: 'var(--bg)', 
                            border: '1px solid var(--border)', borderRadius: '8px',
                            fontSize: '14px', fontStyle: 'italic', color: 'var(--text-dim)',
                            lineHeight: 1.6
                        }}>
                            "My commitment is to **Intellectual Honesty**. We don't sell SEO templates; we engineer citations via semantic architecture. If your brand doesn't have the data-density to rank, I'll tell you before we take your money."
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
                            Why work with us?
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { t: 'Founder-Direct', d: 'No junior account managers. You work directly with the architect of the system.' },
                                { t: 'KIADB & Malur Focus', d: 'Deep understanding of Indian industrial clusters and manufacturing authority.' },
                                { t: 'Entity-First Strategy', d: 'Proven method to align your brand with LLM training datasets and real-time scrapers.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '18px' }}>→</div>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '15px' }}>{item.t}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '32px' }}>
                            <a 
                                href="https://www.linkedin.com/in/sadishsugumaran/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ fontSize: '12px', fontWeight: 600, padding: '10px 20px' }}
                            >
                                Connect on LinkedIn
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
