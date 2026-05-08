'use client';

import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import BrandLogo from "./BrandLogo";

const links = [
  { label: "Solutions", href: "/#solutions", id: "solutions" },
  { label: "How it Works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Pricing", href: "/#pricing", id: "pricing" },
  { label: "About", href: "/about" },
  { label: "Audit", href: "/audit" },
  { label: "GEO", href: "/geo" },
];

export default function NavBar() {
  const { user, isLoading } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.3s ease",
        backgroundColor: scrolled ? "var(--navy)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
        padding: "16px 0",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <BrandLogo color="white" />
        </a>

        <div className="desktop-nav" style={{ display: "flex", gap: "32px", marginLeft: "48px" }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div className="flex items-center gap-4">
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {!isLoading && (
              user ? (
                <a href="/itcontents" className="btn-blue" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Dashboard
                </a>
              ) : (
                <>
                  <a href="/auth/login" style={{ color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    Log In
                  </a>
                  <a href="/audit" className="btn-orange" style={{ padding: '10px 24px', fontSize: '14px' }}>
                    Start Free Audit
                  </a>
                </>
              )
            )}
          </div>
          
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '8px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "var(--navy)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 999
        }}>
          {links.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ color: "white", textDecoration: "none", fontSize: "16px", fontWeight: 600 }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/audit" className="btn-orange" style={{ justifyContent: 'center' }}>
              Start Free Audit
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

