"use client";

import { useState } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Platform", href: "/#platform" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav style={{
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      background: "rgba(249,250,251,0.95)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      zIndex: 100,
    }}>
      <div className="container" style={{ height: 64, display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--text)", textDecoration: "none", flexShrink: 0 }}>
          it<span style={{ color: "var(--accent)" }}>appens</span>.ai
        </a>
        <div style={{ flex: 1 }} />
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{ fontSize: 14, color: "var(--text-dim)", textDecoration: "none", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a href="/#audit" className="btn-primary nav-cta-btn" style={{ fontSize: 13, padding: "9px 20px", marginLeft: 8 }}>
          Free AI Audit →
        </a>
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {links.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <div className="mobile-menu-cta">
          <a href="/#audit" className="btn-primary" style={{ display: "block", textAlign: "center" }} onClick={() => setMenuOpen(false)}>
            Free AI Audit →
          </a>
        </div>
      </div>
    </nav>
  );
}
