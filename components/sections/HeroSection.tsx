'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section id="hero" style={{
            minHeight: '90vh',
            paddingTop: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="overline">Introducing The Agentic Web</span>
                    <h1 className="headline-xl" style={{ margin: '24px auto', maxWidth: '1000px' }}>
                        The Citation Layer <br /> 
                        <span style={{ color: 'var(--accent)' }}>for the AI Web.</span>
                    </h1>
                    <p className="text-sub" style={{ margin: '0 auto 40px' }}>
                        We ensure your brand is the primary source when LLMs like ChatGPT, Perplexity, and SearchGPT answer questions about your industry. Entity-first, engineering-led optimization.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#cta" className="btn-primary" style={{ padding: '16px 32px', fontSize: '15px' }}>
                            Get a Free GEO Audit
                        </a>
                        <a href="#system" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '15px' }}>
                            How it Works
                        </a>
                    </div>
                </motion.div>

                {/* Grayscale Social Proof Strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}
                >
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Trusted by industry leaders in KIADB & Malur
                    </p>
                    <div style={{ 
                        display: 'flex', gap: '60px', justifyContent: 'center', alignItems: 'center', 
                        opacity: 0.5, filter: 'grayscale(100%)', flexWrap: 'wrap' 
                    }}>
                        {['Logistics Global', 'KIADB Manufacturing', 'TechCorp India', 'Narsapura Auto'].map(name => (
                            <span key={name} style={{ 
                                fontFamily: 'var(--font-display)', 
                                fontWeight: 700, 
                                fontSize: '16px', 
                                letterSpacing: '-0.3px',
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
