'use client';

import { useEffect, useState } from 'react';
import BrandLogo from './BrandLogo';

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const navLinks = [
        { name: 'Platform', href: '#system' },
        { name: 'Solutions', href: '#proof' },
        { name: 'Insights', href: '/itcontents' },
        { name: 'Pricing', href: '#cta' },
    ];

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            padding: scrolled ? '12px 24px' : '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: scrolled ? 'rgba(249, 250, 251, 0.8)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a href="#hero" style={{ textDecoration: 'none' }}>
                    <BrandLogo />
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div className="nav-links" style={{ display: 'flex', gap: '24px' }}>
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--text-dim)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <a
                        href="#cta"
                        className="btn-primary"
                        style={{
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '6px'
                        }}
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </nav>
    );
}
