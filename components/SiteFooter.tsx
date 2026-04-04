import { primaryNav, siteConfig } from "@/lib/content/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container grid-footer">
        <div>
          <p className="overline">itappens.ai</p>
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            India's answer-engine visibility system.
          </h2>
          <p>
            Technical Signals, answer clusters, entity-building, and weekly citation tracking for brands that want to become
            the default AI answer.
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>Core Pages</h3>
          <ul className="footer-link-list">
            {primaryNav.slice(1, 5).map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>Resources</h3>
          <ul className="footer-link-list">
            {[
              { href: "/blog", label: "Blog" },
              { href: "/faq", label: "FAQ" },
              { href: "/insights", label: "Insights" },
              { href: "/privacy", label: "Privacy" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: 12 }}>Contact</h3>
          <ul className="footer-link-list">
            <li>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>
              <a href="https://wa.me/919353015844">{siteConfig.phone}</a>
            </li>
            <li>
              <a href={siteConfig.sameAs[0]} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{siteConfig.name}</span>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </div>
    </footer>
  );
}
