import { primaryNav, siteConfig } from "@/lib/content/site";
import BrandLogo from "./BrandLogo";

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "var(--navy)", color: "white", padding: "100px 0 60px" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "64px" }}>
        <div style={{ gridColumn: "span 2" }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
            <BrandLogo color="white" />
          </a>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: "400px" }}>
            The Global Authority in Generative Engine Optimization. We help B2B SaaS brands become the primary cited authority in the AI era.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: "white", fontSize: "14px", fontWeight: 700, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Solutions</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 15 }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: "white", fontSize: "14px", fontWeight: 700, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <li>
              <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--cyan)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.sameAs[0]} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 15 }}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container" style={{ marginTop: 100, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 32 }}>
          <a href="/privacy" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy Policy</a>
          <a href="/terms" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

