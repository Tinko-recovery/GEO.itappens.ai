import { primaryNav, siteConfig } from "@/lib/content/site";
import BrandLogo from "./BrandLogo";

export default function SiteFooter() {
  return (
    <footer className="site-footer" style={{ borderTop: "1px solid var(--border)", paddingTop: 100, paddingBottom: 80, backgroundColor: "var(--bg)" }}>
      <div className="container grid-footer" style={{ gap: '64px' }}>
        <div style={{ maxWidth: 460 }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
            <BrandLogo />
          </a>
          <p className="text-sub" style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-dim)", opacity: 0.8 }}>
            The Citation Layer for the AI Web. We help brands build authority and visibility across ChatGPT, Perplexity, and SearchGPT through technical signals and entity corroboration.
          </p>
        </div>
        
        <div>
          <p className="overline" style={{ marginBottom: 24, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: '0.1em' }}>Platform</p>
          <ul className="footer-link-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {primaryNav.slice(0, 5).map((item) => (
              <li key={item.href}>
                <a href={item.href} style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.2s" }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="overline" style={{ marginBottom: 24, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: '0.1em' }}>Resources</p>
          <ul className="footer-link-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { href: "/geo", label: "GEO Framework" },
              { href: "/answers", label: "Answers Hub" },
              { href: "/audit", label: "AI Audit" },
              { href: "/itcontents", label: "Automation Hub" },
              { href: "/privacy", label: "Privacy Policy" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.2s" }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="overline" style={{ marginBottom: 24, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: '0.1em' }}>Contact</p>
          <ul className="footer-link-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <li>
              <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--brand-blue)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href="https://wa.me/919353015844" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={siteConfig.sameAs[0]} target="_blank" rel="noreferrer" style={{ color: "var(--brand-blue)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom" style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} {siteConfig.name}. Designed for the Agentic Web.
        </p>
        <div style={{ display: "flex", gap: 32 }}>
          <a href="/privacy" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", opacity: 0.8 }}>Privacy</a>
          <a href="/faq" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", opacity: 0.8 }}>Support</a>
        </div>
      </div>
    </footer>
  );
}
