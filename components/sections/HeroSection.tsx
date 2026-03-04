'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import OrbitalLogo from '@/components/OrbitalLogo';

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="layer-top"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '160px 24px 80px',
                position: 'relative',
            }}
        >
            {/* Main Orbital Brand Centerpiece */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                style={{ marginBottom: 40 }}
            >
                <OrbitalLogo size={340} />
            </motion.div>

            {/* Headline branding */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h1 style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 800,
                    fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                    color: 'var(--text-h)',
                    letterSpacing: '-0.04em',
                    marginBottom: 8,
                }}>
                    itappens<span style={{ color: 'var(--accent)' }}>.ai</span>
                </h1>
            </motion.div>

            {/* Primary CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ marginTop: 20 }}
            >
                <a
                    href="#contact"
                    className="btn-primary"
                    style={{
                        background: 'transparent',
                        color: 'var(--accent)',
                        fontSize: 'clamp(1.5rem, 3vw, 2.8rem)',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontFamily: 'var(--font-sans)',
                        letterSpacing: '-0.02em',
                        padding: '12px 0'
                    }}
                >
                    Get AI-cited <ArrowRight size={48} strokeWidth={2.5} />
                </a>
            </motion.div>

            {/* Secondary Nav in Hero as mockup */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{
                    display: 'flex',
                    gap: 48,
                    marginTop: 60,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 32,
                    width: '100%',
                    maxWidth: 500,
                    justifyContent: 'center'
                }}
            >
                {['Roadmap', 'Roadmap', 'FAQ'].map((link, i) => (
                    <a
                        key={i}
                        href={`#${link.toLowerCase()}`}
                        style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-h)',
                            textDecoration: 'none',
                            letterSpacing: '0.02em'
                        }}
                    >
                        {link}
                    </a>
                ))}
            </motion.div>
        </section>
    );
}
