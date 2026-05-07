'use client';
import { motion } from 'framer-motion';

export default function FounderTrustSection() {
    return (
        <section style={{ padding: '120px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
            <div className="container">
                <div className="card-glass" style={{ padding: '80px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ 
                            width: '320px', height: '400px', 
                            background: 'linear-gradient(45deg, #0a0a0f, #1a1a25)', 
                            borderRadius: '24px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                             {/* Founder Placeholder/Avatar with Techy Overlay */}
                             <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--brand-blue) 0%, transparent 70%)', opacity: 0.1 }} />
                             <span style={{ fontSize: '100px', opacity: 0.1 }}>SS</span>
                             
                             <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--brand-green)', boxShadow: '0 0 10px var(--brand-green)' }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--brand-green)' }}>FOUNDER_VERIFIED</span>
                                </div>
                             </div>
                        </div>
                        {/* Floating Tech Badge */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            style={{ 
                            position: 'absolute', 
                            top: '-20px', right: '-20px', 
                            padding: '16px 24px', 
                            background: 'var(--bg)', 
                            border: '1px solid var(--brand-blue)', 
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-glow)'
                        }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>GEO Specialist</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-dim)', margin: 0 }}>B2B SaaS & Agentic Web</p>
                        </motion.div>
                    </div>

                    <div>
                        <span className="overline" style={{ marginBottom: '24px' }}>The Authority Node</span>
                        <h2 className="headline-lg" style={{ marginBottom: '32px' }}>
                            Engineered by <br />
                            <span style={{ color: 'var(--brand-blue)' }}>Sadish Sugumaran.</span>
                        </h2>
                        <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '40px' }}>
                            "GEO is not rebranding SEO. It is a new technical discipline built for how modern LLMs retrieve, verify, and cite information. At itappens.ai, we bridge the gap between product complexity and machine-readability."
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '8px' }}>Technical Foundation</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Deep infrastructure knowledge applied to building robust entity signals for AI crawlers.</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '8px' }}>Global Focus</h4>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Helping US, UK, and Australian SaaS brands navigate the Agentic Web.</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '56px' }}>
                            <a href="/about" className="btn-secondary">Read Founder Story →</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
