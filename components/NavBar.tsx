'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const navLinks = [
        { name: 'System', href: '#system' },
        { name: 'Proof', href: '#proof' },
        { name: 'Roadmap', href: '#roadmap' },
        { name: 'Founder', href: '#founder' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
            padding: scrolled ? '14px 48px' : '20px 48px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(12, 11, 8, 0.9)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
            transition: 'padding 0.3s, background 0.3s'
        }}>
            <a href="#hero" style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '-0.3px',
                color: 'var(--text)',
                textDecoration: 'none'
            }}>
                it<em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>appens</em>.ai
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div className="nav-links" style={{ display: 'flex', gap: '32px' }}>
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
                    href="#cta"
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
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
                >
                    Free Audit →
                </a>
            </div>
        </nav>
    );
}
