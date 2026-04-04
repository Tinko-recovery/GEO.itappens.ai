"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "GEO", href: "/geo" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Answers", href: "/answers" },
  { label: "Blog", href: "/blog" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 32px)",
          maxWidth: 1240,
          zIndex: 100,
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minHeight: 78,
            padding: "0 14px 0 24px",
            borderRadius: 999,
            background: scrolled ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.75)",
            border: "1px solid rgba(219, 227, 239, 0.9)",
            boxShadow: scrolled ? "0 14px 40px rgba(15, 23, 42, 0.10)" : "0 10px 28px rgba(15, 23, 42, 0.06)",
            backdropFilter: "blur(18px)",
          }}
        >
          <a href="/" style={{ textDecoration: "none", fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>
            it<span style={{ color: "var(--accent)" }}>appens</span>.ai
          </a>
          <div style={{ flex: 1 }} />
          <div className="desktop-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: "12px 16px",
                  borderRadius: 999,
                  color: "var(--text-dim)",
                  textDecoration: "none",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a className="btn-primary nav-cta-btn" href="/#audit" style={{ minHeight: 56, padding: "0 26px", fontSize: 17 }}>
            Free AI Audit
          </a>
          <button aria-label="Toggle menu" className="hamburger-btn" onClick={() => setMenuOpen((value) => !value)}>
            <span />
            <span />
            <span />
          </button>
        </nav>
        {menuOpen ? (
          <div
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 24,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid var(--border)",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.10)",
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 14px",
                  borderRadius: 16,
                  color: "var(--text-dim)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
            <a className="btn-primary" href="/#audit" onClick={() => setMenuOpen(false)} style={{ width: "100%", marginTop: 8 }}>
              Free AI Audit
            </a>
          </div>
        ) : null}
      </div>
      <div style={{ height: 90 }} />
    </>
  );
}
