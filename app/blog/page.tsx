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
    <div className="page-shell">
      <NavBar />
      <main>
        <header className="section" style={{ padding: '160px 0 100px', backgroundColor: 'var(--bg)' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <span className="overline">GEO Blog</span>
              <h1 className="headline-xl" style={{ margin: '24px 0', letterSpacing: '-0.04em' }}>
                AI Search Visibility. <br />
                <span style={{ color: 'var(--accent)' }}>Written for Indian Brands.</span>
              </h1>
              <p className="text-sub" style={{ marginBottom: '40px' }}>
                In-depth articles on Generative Engine Optimization, LLM citation strategy, and entity architecture for the AI-first internet.
              </p>
            </div>
          </div>
        </header>

        <section className="section" style={{ padding: '0 0 120px' }}>
          <div className="container">
            {/* Featured Post */}
            {POSTS.filter((post) => post.featured).map((post) => (
              <a key={post.title} href={post.slug!} style={{ display: "block", textDecoration: "none", marginBottom: '64px' }}>
                <div className="card-bento" style={{ 
                  padding: '64px', 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="overline" style={{ color: 'var(--accent)', fontSize: '11px' }}>{post.tag}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', padding: '4px 12px', backgroundColor: 'var(--accent-soft)', borderRadius: '99px' }}>Featured</span>
                  </div>
                  <h2 className="headline-lg" style={{ margin: 0, color: 'var(--text)' }}>{post.title}</h2>
                  <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: '800px' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>{post.date}</span>
                    {post.readTime && <span>· {post.readTime}</span>}
                    <span style={{ color: 'var(--accent)', marginLeft: 'auto', fontWeight: 600 }}>Read full article →</span>
                  </div>
                </div>
              </a>
            ))}

            {/* Post Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: '32px' }}>
              {POSTS.filter((post) => !post.featured).map((post, i) => (
                <div key={i} className="card-bento" style={{ 
                  padding: '40px', 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  opacity: post.slug ? 1 : 0.8
                }}>
                  <span className="overline" style={{ fontSize: '11px', color: 'var(--accent)' }}>{post.tag}</span>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>{post.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6 }}>{post.excerpt}</p>
                  
                  <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    {post.slug ? (
                      <a href={post.slug} style={{ color: "var(--accent)", textDecoration: "none", fontSize: '13px', fontWeight: 600 }}>
                        Read insight →
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 12px', backgroundColor: 'var(--bg)', borderRadius: '99px' }}>
                        COMING SOON
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div style={{ 
              marginTop: '100px', 
              padding: '80px', 
              backgroundColor: 'var(--text)', 
              color: 'var(--surface)', 
              borderRadius: '32px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <span className="overline" style={{ color: 'var(--accent)' }}>Stay Ahead</span>
              <h2 className="headline-lg" style={{ color: 'var(--surface)', margin: 0 }}>Get GEO insights in your inbox.</h2>
              <p style={{ maxWidth: '600px', opacity: 0.8, fontSize: '17px', lineHeight: 1.6 }}>
                New articles on AI search visibility, entity architecture, and LLM citation strategy for Indian brands.
              </p>
              <a href="mailto:hello@itappens.ai?subject=GEO Blog Updates" className="btn-primary" style={{ padding: '18px 40px' }}>
                hello@itappens.ai
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
