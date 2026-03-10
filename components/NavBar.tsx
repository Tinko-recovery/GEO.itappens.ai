'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const navLinks = [
        { name: 'Blog', href: '/blog' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'How It Works', href: '/#system' },
        { name: 'Packages', href: '/#packages' },
        { name: 'Contact', href: 'mailto:founder@tinko.in' },
    ];

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
            padding: scrolled ? '14px 24px' : '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(12, 11, 8, 0.9)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
            transition: 'padding 0.3s, background 0.3s'
        }}>
            <div className="container-wide" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
                <a href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none'
                }}>
                    <img src="/logo.png" alt="itappens.ai" style={{ height: '24px', width: 'auto' }} />
                </a>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div className="nav-links" style={{ display: 'none', gap: '32px' }}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                style={{
                                    fontSize: '10px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: 'var(--muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text2)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <a
                        href="/pricing"
                        className="nav-cta"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            padding: '8px 18px',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            textDecoration: 'none',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            transition: 'background 0.2s',
                            display: 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                    >
                        Get Started →
                    </a>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '10px'
                        }}
                    >
                        <div style={{ width: '18px', height: '2px', background: 'currentColor' }} />
                        <div style={{ width: '18px', height: '2px', background: 'currentColor' }} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'fixed',
                        top: '60px',
                        left: 0,
                        right: 0,
                        background: 'var(--bg)',
                        borderBottom: '1px solid var(--border)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        zIndex: 499
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                fontSize: '12px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                color: 'var(--text)',
                                textDecoration: 'none'
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/pricing"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--bg)',
                            padding: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            textTransform: 'uppercase'
                        }}
                    >
                        Get Started →
                    </a>
                </motion.div>
            )}

            <style>{`
                @media (min-width: 768px) {
                    .nav-links, .nav-cta { display: flex !important; }
                    button { display: none !important; }
                }
            `}</style>
        </nav>
    );
}
