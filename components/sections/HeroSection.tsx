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
            {/* Dark Tech Radial Glowing Pattern */}
            <div style={{
                position: 'absolute',
                top: '-20%', left: '-10%', right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 20% 30%, rgba(0, 194, 255, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 60%, rgba(27, 79, 222, 0.1) 0%, transparent 40%)
                `,
                zIndex: 0
            }} />
            
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="grid-2col" style={{ alignItems: 'center' }}>
                    
                    {/* Left Column: Copy & Actions */}
                    <div style={{ textAlign: 'left' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="badge-pill" style={{ 
                                marginBottom: '24px',
                                background: 'rgba(0, 194, 255, 0.1)',
                                color: 'var(--cyan)',
                                border: '1px solid rgba(0, 194, 255, 0.3)'
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
                                marginBottom: '48px',
                                maxWidth: '600px'
                            }}
                        >
                            itappens.ai builds the technical and semantic infrastructure that causes AI platforms to trust, retrieve, and cite your brand as the primary authority in your category.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
                        >
                            <a href="/audit" className="btn-orange" style={{ padding: '20px 48px', fontSize: '16px' }}>
                                Start Free GEO Audit
                            </a>
                            <a href="/geo" className="btn-ghost" style={{ padding: '20px 48px', fontSize: '16px', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                                View the Framework →
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Column: Glowing Dark Glass Card Graphic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Decorative glow behind card */}
                        <div style={{
                            position: 'absolute',
                            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '80%', height: '80%',
                            background: 'var(--cyan)',
                            filter: 'blur(100px)',
                            opacity: 0.15,
                            zIndex: -1
                        }} />
                        
                        <div className="card-glass-dark" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                                </div>
                                <h3 style={{ color: 'var(--cyan)', fontSize: '18px', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>$ analyze --target yourbrand.com</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                                    &gt; Extracting entity relationships... <br/>
                                    &gt; Scanning LLM citation vectors... <br/>
                                    &gt; Found 4 missing semantic signals.
                                </p>
                            </div>
                            <div style={{ padding: '24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                                    <div style={{ height: '8px', background: 'rgba(0,194,255,0.2)', borderRadius: '4px', width: '85%' }} />
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '60%' }} />
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '90%' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

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
        </section>
    );
}

