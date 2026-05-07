'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section id="hero" style={{
            minHeight: '100vh',
            padding: '180px 0 120px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Ultra-Premium Agentic Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 15% 15%, rgba(0, 245, 255, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 85% 85%, rgba(255, 0, 122, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(10, 10, 20, 1) 0%, transparent 100%)
                `,
                zIndex: 0
            }} />
            
            {/* Moving Grid Pattern */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
                zIndex: 1
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="overline" style={{ 
                            marginBottom: '32px',
                            padding: '6px 16px',
                            background: 'rgba(0, 245, 255, 0.05)',
                            borderColor: 'rgba(0, 245, 255, 0.2)',
                            boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)'
                        }}>
                            The Citation Layer for B2B SaaS
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="headline-xl" 
                        style={{ margin: '0 0 32px', letterSpacing: '-0.06em', fontWeight: 900 }}
                    >
                        Master the <span style={{ 
                            color: 'var(--brand-blue)',
                            textShadow: '0 0 40px rgba(0, 245, 255, 0.3)'
                        }}>Agentic Web.</span> <br />
                        Dominate LLM Citations.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-sub" 
                        style={{ margin: '0 auto 64px', maxWidth: '800px', fontSize: '20px', lineHeight: 1.6, color: 'var(--text-dim)' }}
                    >
                        itappens.ai ensures your brand is the primary authority when ChatGPT, Perplexity, and Gemini answer questions. <span style={{ color: '#fff' }}>Engineering-led GEO for the world's most ambitious SaaS brands.</span>
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <a href="/audit" className="btn-primary" style={{ padding: '22px 56px', fontSize: '17px', borderRadius: '16px' }}>
                            Get Free GEO Snapshot
                        </a>
                        <a href="/about" className="btn-secondary" style={{ 
                            padding: '22px 56px', 
                            fontSize: '17px', 
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)'
                        }}>
                            Meet the Founder →
                        </a>
                    </motion.div>

                    {/* Authority Signal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 2 }}
                        style={{ marginTop: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <div style={{ 
                            width: '1px', height: '80px', 
                            background: 'linear-gradient(to bottom, var(--brand-blue), transparent)',
                            marginBottom: '32px'
                        }} />
                        <p style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '12px', 
                            color: 'var(--text-muted)', 
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase'
                        }}>
                            Currently Onboarding Global B2B SaaS Founders
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
