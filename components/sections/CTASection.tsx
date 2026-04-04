'use client';
import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <section id="cta" style={{ padding: '120px 0', background: 'var(--surface-alt)' }}>
            <div className="container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '100px', 
                    alignItems: 'center' 
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="overline">Get Citations</span>
                        <h2 className="headline-lg" style={{ marginTop: '20px' }}>
                            See where you stand. <br />
                            <span style={{ color: 'var(--accent)' }}>Free AI Audit.</span>
                        </h2>
                        <p className="text-sub" style={{ marginTop: '24px' }}>
                            We'll run your brand through 50+ targeted queries across ChatGPT, Perplexity, and Gemini. <br /><br />
                            You'll get a report showing exactly where you're being cited, where you're invisible, and which competitor is taking your traffic. No sales call. Just the data.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            background: 'var(--surface)',
                            padding: '48px',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.02)'
                        }}
                    >
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                                    Website URL
                                </label>
                                <input 
                                    type="url" 
                                    placeholder="https://company.com"
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '6px',
                                        border: '1px solid var(--border)', background: 'var(--bg)',
                                        fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                                    Corporate Email
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="you@company.com"
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '6px',
                                        border: '1px solid var(--border)', background: 'var(--bg)',
                                        fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '8px' }}>
                                    Primary Goal
                                </label>
                                <select 
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '6px',
                                        border: '1px solid var(--border)', background: 'var(--bg)',
                                        fontSize: '14px', outline: 'none'
                                    }}
                                >
                                    <option>Fix AI Hallucinations</option>
                                    <option>Increase Brand Citations</option>
                                    <option>Competitor Analysis</option>
                                    <option>KIADB/Industrial Visibility</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                            >
                                Start Free AI Audit →
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                                Our Principal reviews every request personally.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
