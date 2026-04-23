'use client';

import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import BrandLogo from "./BrandLogo";

const links = [
  { label: "Audit", href: "/audit" },
  { label: "GEO Setup", href: "/geo" },
  { label: "Solutions", href: "/#solutions", id: "solutions" },
  { label: "How it Works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Pricing", href: "/#pricing", id: "pricing" },
];

export default function NavBar() {
  const { user, isLoading } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === "/") {
        // Scroll spy logic for homepage
        const sectionIds = links.filter(l => l.id).map(l => l.id);
        let currentSection = "";
        
        for (const id of sectionIds) {
          const element = document.getElementById(id!);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If the top of the section is near the top of the viewport
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = id!;
              break;
            }
          }
        }
        setActiveSection(currentSection);
      } else if (pathname === "/audit") {
        setActiveSection("audit");
      } else if (pathname === "/geo") {
        setActiveSection("geo");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isLinkActive = (href: string, id?: string) => {
    if (id) return activeSection === id;
    if (href === "/audit") return activeSection === "audit";
    if (href === "/geo") return activeSection === "geo";
    return false;
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        backgroundColor: scrolled ? "var(--glass-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        padding: scrolled ? "12px 0" : "24px 0",
      }}
    >
      <div 
        className="container" 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 24px' 
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <BrandLogo />
          </a>

          <div className="desktop-nav" style={{ display: "flex", gap: "24px" }}>
            {links.map((link) => {
              const active = isLinkActive(link.href, link.id);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "14px",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--brand-blue)" : "var(--text-dim)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    position: "relative",
                    textShadow: active ? "0 0 20px rgba(58, 190, 249, 0.4)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = "var(--text-dim)";
                  }}
                >
                  {link.label}
                  {active && (
                    <div style={{
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--brand-blue)',
                      borderRadius: '2px',
                      boxShadow: '0 0 10px var(--brand-blue)'
                    }} />
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isLoading && (
            user ? (
              <a href="/itcontents" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '12px' }}>
                Dashboard
              </a>
            ) : (
              <a href="/auth/login" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px', borderRadius: '12px' }}>
                Log In
              </a>
            )
          )}
          
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '8px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 999
        }}>
          {links.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ 
                color: isLinkActive(link.href, link.id) ? "var(--brand-blue)" : "var(--text-dim)", 
                textDecoration: "none", 
                fontSize: "16px",
                fontWeight: isLinkActive(link.href, link.id) ? 700 : 500
              }}
            >
              {link.label}
            </a>
          ))}
          <a href="/itcontents" className="btn-primary" style={{ textAlign: "center" }}>
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
