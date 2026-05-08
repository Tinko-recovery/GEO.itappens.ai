'use client';

import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from "./BrandLogo";
import { primaryNav } from "@/lib/content/site";

export default function NavBar() {
  const { user, isLoading } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // On non-homepage, we want a dark background by default for visibility
  const isHome = pathname === "/";
  const showBg = scrolled || !isHome;

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
        backgroundColor: showBg ? "rgba(10, 15, 30, 0.95)" : "transparent",
        backdropFilter: showBg ? "blur(12px)" : "none",
        borderBottom: showBg ? "1px solid rgba(255,255,255,0.1)" : "none",
        padding: showBg ? "12px 0" : "20px 0",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <BrandLogo color="white" />
        </Link>

        <div className="desktop-nav" style={{ display: "flex", gap: "24px", marginLeft: "48px" }}>
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: pathname === link.href ? "var(--cyan)" : "rgba(255,255,255,0.8)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div className="flex items-center gap-4">
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {!isLoading && (
              user ? (
                <Link href="/itcontents" className="btn-blue" style={{ padding: '10px 20px', fontSize: '14px' }}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" style={{ color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    Log In
                  </Link>
                  <Link href="/audit" className="btn-orange" style={{ padding: '10px 24px', fontSize: '14px' }}>
                    Start Free Audit
                  </Link>
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
          {primaryNav.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ color: "white", textDecoration: "none", fontSize: "16px", fontWeight: 600 }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/audit" className="btn-orange" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              Start Free Audit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

