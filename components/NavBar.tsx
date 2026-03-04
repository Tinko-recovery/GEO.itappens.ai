'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const barW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const navLinks = [
        { name: 'System', href: '#system' },
        { name: 'Proof', href: '#proof' },
        { name: 'Roadmap', href: '#roadmap' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <>
            {/* Progress bar */}
            <motion.div style={{
                position: 'fixed', top: 0, left: 0, height: '1.5px', zIndex: 1000,
                background: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent-border)',
                width: barW,
            }} />

            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
                    padding: '24px 0',
                    background: scrolled ? 'rgba(2, 4, 10, 0.8)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Left: Logo */}
                    <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'rgba(0, 245, 255, 0.05)',
                            border: '1px solid var(--accent-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/logo.png"
                                alt="itappens.ai"
                                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                            />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            color: 'var(--text-h)',
                            letterSpacing: '-0.01em',
                        }}>
                            itappens<span style={{ color: 'var(--accent)' }}>.ai</span>
                        </span>
                    </a>

                    {/* Right: Navigation Links */}
                    <nav style={{ display: 'flex', gap: 32 }}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--accent)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </motion.header>
        </>
    );
}
