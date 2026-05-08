'use client';
import { motion } from 'framer-motion';

const platforms = ["ChatGPT", "Perplexity", "Gemini", "Claude", "SearchGPT", "Grok"];

export default function HeroSection() {
    return (
        <section id="hero" style={{
            minHeight: '100vh',
            padding: '180px 0 100px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--navy)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Corporate Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 10% 20%, rgba(27, 79, 222, 0.1) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(0, 194, 255, 0.05) 0%, transparent 40%)
                `,
                zIndex: 0
            }} />
            
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="badge-pill" style={{ 
                            marginBottom: '24px',
                            background: 'rgba(27, 79, 222, 0.15)',
                            color: 'var(--cyan)',
                            border: '1px solid rgba(0, 194, 255, 0.2)'
                        }}>
                            Global GEO & AEO Authority
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="headline-xl" 
                        style={{ color: '#fff', marginBottom: '32px' }}
                    >
                        Get Cited by ChatGPT, Perplexity & Gemini. <br />
                        <span style={{ color: 'var(--cyan)' }}>Not Just Ranked.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{ 
                            fontSize: '20px', 
                            lineHeight: 1.6, 
                            color: 'rgba(255,255,255,0.7)', 
                            maxWidth: '800px', 
                            margin: '0 auto 56px' 
                        }}
                    >
                        itappens.ai builds the technical and semantic infrastructure that causes AI platforms to trust, retrieve, and cite your brand as the primary authority in your category.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <a href="/audit" className="btn-orange" style={{ padding: '20px 48px', fontSize: '16px' }}>
                            Start Free GEO Audit
                        </a>
                        <a href="/geo" className="btn-ghost" style={{ padding: '20px 48px', fontSize: '16px', color: 'white' }}>
                            View the Framework →
                        </a>
                    </motion.div>

                    {/* Platform Trust Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        style={{ marginTop: '100px' }}
                    >
                        <p style={{ 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            color: 'rgba(255,255,255,0.4)', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.15em',
                            marginBottom: '32px'
                        }}>
                            Optimizing Citations Across
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '48px', 
                            flexWrap: 'wrap',
                            opacity: 0.6
                        }}>
                            {platforms.map(p => (
                                <span key={p} style={{ 
                                    color: 'white', 
                                    fontSize: '18px', 
                                    fontWeight: 700, 
                                    fontFamily: 'var(--font-display)',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {p}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

