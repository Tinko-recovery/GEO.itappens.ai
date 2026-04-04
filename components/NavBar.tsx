"use client";

import { useState, useEffect } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Platform", href: "/#platform" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <>
      {/* ── Floating pill wrapper ── */}
      <div style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 1100,
        zIndex: 200,
      }}>

        {/* Pill nav bar */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          height: 58,
          padding: "0 8px 0 20px",
          borderRadius: 999,
          background: scrolled
            ? "rgba(249,250,251,0.92)"
            : "rgba(249,250,251,0.60)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(226,232,240,0.85)",
          boxShadow: scrolled
            ? "0 4px 28px rgba(0,0,0,0.09)"
            : "0 2px 12px rgba(0,0,0,0.05)",
          transition: "background 0.3s, box-shadow 0.3s",
          gap: 6,
        }}>

          {/* Logo */}
          <a href="/" style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: 17, color: "var(--text)", textDecoration: "none", flexShrink: 0,
          }}>
            it<span style={{ color: "var(--accent)" }}>appens</span>.ai
          </a>

          <div style={{ flex: 1 }} />

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 2, alignItems: "center" }} className="desktop-nav">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 14, color: "var(--text-dim)", textDecoration: "none",
                  fontWeight: 500, padding: "7px 14px", borderRadius: 999,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "rgba(15,23,42,0.05)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--text-dim)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="/#audit"
            className="btn-primary nav-cta-btn"
            style={{ fontSize: 13, padding: "9px 18px", borderRadius: 999, flexShrink: 0, marginLeft: 6 }}
          >
            Free AI Audit →
          </a>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ marginLeft: 4 }}
          >
            <span style={{ transition: "all 0.2s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transition: "all 0.2s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>
        </nav>

        {/* Mobile dropdown card */}
        {menuOpen && (
          <div style={{
            marginTop: 8,
            borderRadius: 16,
            background: "rgba(249,250,251,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}>
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "15px 24px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--text-dim)",
                  textDecoration: "none",
                  borderBottom: i < links.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {l.label}
              </a>
            ))}
            <div style={{ padding: "12px 16px" }}>
              <a
                href="/#audit"
                className="btn-primary"
                onClick={() => setMenuOpen(false)}
                style={{ display: "block", textAlign: "center", borderRadius: 8 }}
              >
                Free AI Audit →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Spacer so page content clears the floating nav */}
      <div style={{ height: 90 }} />
    </>
  );
}
