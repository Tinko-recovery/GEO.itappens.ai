import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { getSortedPostsData } from "@/lib/blog";

export const dynamic = 'force-dynamic';

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

export default async function BlogPage() {
  const posts = await getSortedPostsData();
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="page-shell">
      <NavBar />
      <main>
        <header className="section dark-section" style={{ padding: '160px 0 100px', position: 'relative' }}>
          <div className="container-narrow">
            <span className="overline">GEO Blog</span>
            <h1 className="headline-xl" style={{ margin: '24px 0' }}>
              AI Search Visibility. <br />
              <span style={{ color: 'var(--cyan)' }}>Written for Indian Brands.</span>
            </h1>
            <p className="text-sub" style={{ marginBottom: '40px' }}>
              In-depth articles on Generative Engine Optimization, LLM citation strategy, and entity architecture for the AI-first internet.
            </p>
          </div>
        </header>

        <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
          <div className="container">
            {/* Featured Post */}
            {featuredPost && (
              <a href={`/blog/${featuredPost.slug}`} style={{ display: "block", textDecoration: "none", marginBottom: '64px' }}>
                <div className="card-bento" style={{ borderTop: '4px solid var(--blue)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <span className="overline" style={{ marginBottom: 0 }}>{featuredPost.category}</span>
                    <span className="badge-pill" style={{ padding: '4px 12px', fontSize: '11px' }}>Featured</span>
                  </div>
                  <h2 className="headline-lg" style={{ margin: '0 0 16px 0', color: 'var(--navy)' }}>{featuredPost.title}</h2>
                  <p className="text-sub" style={{ maxWidth: '800px', marginBottom: '24px' }}>{featuredPost.excerpt}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                    <span>{featuredPost.date}</span>
                    {featuredPost.readTime && <span>· {featuredPost.readTime}</span>}
                    <span style={{ color: 'var(--blue)', marginLeft: 'auto', fontWeight: 700 }}>Read full article →</span>
                  </div>
                </div>
              </a>
            )}

            {/* Post Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: '32px' }}>
              {regularPosts.map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} style={{ display: "block", textDecoration: "none" }}>
                  <div className="card-bento" style={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    <span className="overline" style={{ marginBottom: 0 }}>{post.category}</span>
                    <h3 className="headline-md" style={{ margin: 0, color: 'var(--navy)' }}>{post.title}</h3>
                    <p className="text-sub" style={{ fontSize: '15px' }}>{post.excerpt}</p>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                        {post.date}
                      </div>
                      <span style={{ color: "var(--blue)", fontSize: '14px', fontWeight: 700 }}>
                        Read insight →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="card-bento" style={{ 
              marginTop: '100px', 
              backgroundColor: 'var(--navy)', 
              color: '#fff',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px'
            }}>
              <span className="overline" style={{ color: 'var(--cyan)' }}>Stay Ahead</span>
              <h2 className="headline-lg" style={{ color: '#fff', margin: 0 }}>Get GEO insights in your inbox.</h2>
              <p className="text-sub" style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)' }}>
                New articles on AI search visibility, entity architecture, and LLM citation strategy for Indian brands.
              </p>
              <a href="mailto:hello@itappens.ai?subject=GEO Blog Updates" className="btn-primary">
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
