'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section id="hero" style={{
            minHeight: '90vh',
            padding: '160px 0 120px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Animated Mesh Gradient Background — International SaaS Style */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `
                  radial-gradient(circle at 20% 30%, rgba(58, 190, 249, 0.15) 0%, transparent 40%),
                  radial-gradient(circle at 80% 20%, rgba(244, 80, 80, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at 50% 80%, rgba(57, 181, 73, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at 10% 90%, rgba(249, 217, 73, 0.08) 0%, transparent 40%)
                `,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="overline" style={{ 
                            backgroundColor: 'rgba(58, 190, 249, 0.1)', 
                            color: 'var(--brand-blue)',
                            padding: '6px 12px',
                            borderRadius: '100px',
                            display: 'inline-block',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(58, 190, 249, 0.1)'
                        }}>
                            Introducing The Agentic Web
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="headline-xl" 
                        style={{ margin: '32px 0', letterSpacing: '-0.05em', lineHeight: 1.0 }}
                    >
                        The Citation Layer <br /> 
                        <span style={{ 
                            background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>for the AI-First Internet.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-sub" 
                        style={{ margin: '0 auto 56px', maxWidth: '720px', fontSize: '18px', opacity: 0.8 }}
                    >
                        We ensure your brand is the primary source when LLMs like ChatGPT, Perplexity, and SearchGPT answer questions about your industry. Entity-first, engineering-led optimization.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <a href="/audit" className="btn-primary" style={{ padding: '20px 48px', fontSize: '16px', borderRadius: '16px' }}>
                            Start Free GEO Snapshot
                        </a>
                        <a href="/itcontents" className="btn-secondary" style={{ 
                            padding: '20px 48px', 
                            fontSize: '16px', 
                            borderRadius: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(12px)'
                        }}>
                            Automate Social Visibility →
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    style={{ marginTop: '120px', borderTop: '1px solid var(--border)', paddingTop: '48px' }}
                >
                    <p style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '12px', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em', 
                        color: 'var(--text-muted)', 
                        marginBottom: '40px',
                        textAlign: 'center'
                    }}>
                        Trusted by industry leaders in logistics & manufacturing
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '80px', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        opacity: 0.5, 
                        filter: 'grayscale(100%) brightness(200%)', 
                        flexWrap: 'wrap' 
                    }}>
                        {['Logistics Global', 'KIADB Manufacturing', 'TechCorp India', 'Narsapura Auto'].map(name => (
                          <span key={name} style={{ 
                            fontFamily: 'var(--font-display)', 
                            fontWeight: 700, 
                            fontSize: '20px', 
                            letterSpacing: '-0.02em',
                            color: 'var(--text-dim)'
                          }}>
                            {name}
                          </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
