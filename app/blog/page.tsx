import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "GEO Blog | itappens.ai",
  description:
    "In-depth articles on Generative Engine Optimization, LLM citations, entity architecture, and AI-first brand visibility for Indian businesses.",
  alternates: { canonical: "https://www.itappens.ai/blog" },
  openGraph: {
    title: "GEO Blog | itappens.ai",
    description: "In-depth GEO strategy for Indian brands navigating AI-first search in 2026.",
    url: "https://www.itappens.ai/blog",
    siteName: "itappens.ai",
    type: "website",
    locale: "en_IN",
  },
};

const POSTS = [
  {
    slug: "/insights",
    tag: "GEO Strategy",
    title: "GEO vs SEO: The 2026 Guide for Indian Brands",
    excerpt:
      "Traditional SEO ranked your website. Generative Engine Optimization gets your brand named by AI. These are two different games, and in 2026 the new game is the one that matters.",
    date: "April 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: null,
    tag: "Entity Architecture",
    title: "What Is a Brand Entity and Why Do AI Models Care?",
    excerpt:
      "AI models do not find you by keyword alone. They recognize you as a named entity, which is why most Indian brands are still structurally invisible to AI.",
    date: "Coming soon",
    readTime: null,
    featured: false,
  },
  {
    slug: null,
    tag: "Technical GEO",
    title: "JSON-LD Schema for GEO: A Practical Guide",
    excerpt:
      "Deep JSON-LD schema is how AI crawlers corroborate your entity claims. Here is what to implement and why.",
    date: "Coming soon",
    readTime: null,
    featured: false,
  },
  {
    slug: null,
    tag: "Content Strategy",
    title: "Engineering the Golden Snippet: Content AI Systems Will Actually Extract",
    excerpt:
      "Generic blog posts do not get lifted by AI reasoning engines. Dense, extractable paragraphs do.",
    date: "Coming soon",
    readTime: null,
    featured: false,
  },
  {
    slug: null,
    tag: "Case Studies",
    title: "How itappens.ai Achieved AI Citation in 6 Weeks",
    excerpt:
      "A behind-the-scenes look at how we applied our own 4-pillar framework to itappens.ai before taking it to the market.",
    date: "Coming soon",
    readTime: null,
    featured: false,
  },
  {
    slug: null,
    tag: "Market Intelligence",
    title: "The India GEO Landscape: Who's Winning AI Search in 2026",
    excerpt:
      "A data-driven look at which Indian brands are currently cited in AI responses, which categories have the highest citation density, and where the white space is.",
    date: "Coming soon",
    readTime: null,
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <NavBar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 48px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 16,
          }}
        >
          GEO Blog
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.05em",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          AI Search Visibility.
          <br />
          Written for Indian Brands.
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-dim)", lineHeight: 1.75, maxWidth: 560 }}>
          In-depth articles on Generative Engine Optimization, LLM citation strategy, entity architecture, and what it takes
          to get your brand named by AI in 2026.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        {POSTS.filter((post) => post.featured).map((post) => (
          <a key={post.title} href={post.slug!} style={{ display: "block", textDecoration: "none", marginBottom: 32 }}>
            <div
              style={{
                padding: "40px 40px",
                background: "var(--surface)",
                border: "2px solid var(--border-accent)",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--accent)",
                    padding: "3px 10px",
                    border: "1px solid var(--border-accent)",
                    borderRadius: 20,
                    letterSpacing: "0.08em",
                    background: "var(--accent-muted)",
                  }}
                >
                  {post.tag}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.05em" }}>
                  Featured
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem,2.5vw,2rem)",
                  color: "var(--text)",
                  letterSpacing: "-0.04em",
                  marginBottom: 14,
                  lineHeight: 1.15,
                }}
              >
                {post.title}
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-dim)", lineHeight: 1.75, maxWidth: 680, marginBottom: 20 }}>
                {post.excerpt}
              </p>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <span>{post.date}</span>
                {post.readTime ? (
                  <>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </>
                ) : null}
                <span style={{ color: "var(--accent)", marginLeft: 8 }}>Read article</span>
              </div>
            </div>
          </a>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {POSTS.filter((post) => !post.featured).map((post, i) => (
            <div
              key={i}
              style={{
                padding: "28px 28px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                opacity: post.slug ? 1 : 0.75,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--accent)",
                  padding: "3px 10px",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  letterSpacing: "0.08em",
                  display: "inline-block",
                  marginBottom: 16,
                }}
              >
                {post.tag}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                  marginBottom: 12,
                  lineHeight: 1.25,
                }}
              >
                {post.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.75, marginBottom: 20 }}>{post.excerpt}</p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                {post.slug ? (
                  <a href={post.slug} style={{ color: "var(--accent)", textDecoration: "none" }}>
                    Read article
                  </a>
                ) : (
                  <span style={{ padding: "4px 10px", background: "var(--surface-alt)", borderRadius: 20, fontSize: 10, letterSpacing: "0.05em" }}>
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, padding: "40px", background: "var(--accent-muted)", border: "1px solid var(--border-accent)", borderRadius: 8, textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.03em" }}>
            Get GEO insights in your inbox.
          </h3>
          <p style={{ fontSize: 15, color: "var(--text-dim)", marginBottom: 24 }}>
            New articles on AI search visibility, entity architecture, and LLM citation strategy for Indian brands.
          </p>
          <a
            href="mailto:hello@itappens.ai?subject=GEO Blog Updates"
            style={{ background: "var(--accent)", color: "#fff", padding: "12px 28px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-block" }}
          >
            hello@itappens.ai
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
