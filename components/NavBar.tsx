'use client';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Menu, ChevronDown } from 'lucide-react';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const barW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

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
                style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, padding: '20px 0' }}
            >
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    {/* Left: Logo */}
                    <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'rgba(0, 245, 255, 0.05)',
                            border: '1px solid var(--accent-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/logo.png"
                                alt="itappens.ai"
                                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: 'var(--text-h)',
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            itappens<span style={{ color: 'var(--accent)' }}>.ai</span>
                        </span>
                    </a>

                    {/* Right: Navigation Links */}
                    <div style={{ display: 'flex', gap: 32 }}>
                        {['System', 'Proof', 'Roadmap', 'FAQ'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--accent)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    transition: 'opacity 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </motion.header>
        </>
    );
}
