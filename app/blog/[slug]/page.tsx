import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    let post;
    try {
        post = await getPostData(slug);
    } catch {
        notFound();
    }
    
    if (!post) {
        notFound();
    }

    const allPosts = await getSortedPostsData();
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    
    // Previous is chronologically newer (lower index), Next is chronologically older (higher index)
    const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "datePublished": post.date,
        "author": { "@type": "Organization", "name": "itappens.ai" },
        "publisher": { "@type": "Organization", "name": "itappens.ai", "logo": { "@type": "ImageObject", "url": "https://itappens.ai/logo.png" } },
        "description": post.excerpt
    };

    return (
        <div className="page-shell">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            
            <NavBar />

            <main style={{ backgroundColor: 'var(--light-bg)' }}>
                {/* Article Header */}
                <header className="section" style={{ backgroundColor: 'var(--brand-bg)', borderBottom: '1px solid var(--border-light)', paddingTop: '160px', paddingBottom: '80px' }}>
                    <div className="container-narrow">
                        <a href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--slate)', textDecoration: 'none', marginBottom: '32px' }}>
                            <ArrowLeft className="h-4 w-4" /> Back to Blog
                        </a>
                        <span className="overline">{post.category}</span>
                        <h1 className="headline-xl" style={{ margin: '16px 0 24px 0', color: 'var(--navy)' }}>{post.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px', color: 'var(--slate)', fontFamily: 'var(--font-mono)' }}>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="section" style={{ paddingBottom: '40px' }}>
                    <div className="container-narrow">
                        <div className="card-bento" style={{ marginBottom: '64px', borderLeft: '4px solid var(--blue)', backgroundColor: 'rgba(255, 0, 127, 0.05)' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                                GOLDEN SNIPPET
                            </span>
                            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--navy)', margin: 0, lineHeight: 1.6 }}>
                                {post.excerpt}
                            </p>
                        </div>
                        
                        <div 
                            className="prose prose-lg max-w-none prose-headings:text-[var(--navy)] prose-a:text-[var(--blue)] prose-a:font-bold prose-strong:text-[var(--navy)]"
                            style={{ color: 'var(--slate)', fontSize: '18px', lineHeight: 1.8 }}
                            dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} 
                        />

                        {/* Inline CTA */}
                        <div className="card-bento" style={{ marginTop: '80px', backgroundColor: 'var(--navy)', color: '#fff', textAlign: 'center', padding: '64px' }}>
                            <h3 className="headline-md" style={{ color: '#fff', margin: '0 0 16px 0' }}>Ready to engineer your AI presence?</h3>
                            <p className="text-sub" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>
                                Get a weaponized GEO audit and find out where your citations are being lost.
                            </p>
                            <a href="/#audit" className="btn-primary">
                                Run My GEO Audit →
                            </a>
                        </div>
                    </div>
                </article>

                {/* Pagination Navigation */}
                <section style={{ paddingBottom: '120px' }}>
                    <div className="container-narrow">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '40px' }}>
                            {prevPost ? (
                                <a href={`/blog/${prevPost.slug}`} className="card-bento" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous Article</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4 }}>{prevPost.title}</span>
                                </a>
                            ) : <div />}
                            
                            {nextPost ? (
                                <a href={`/blog/${nextPost.slug}`} className="card-bento" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none', textAlign: 'right' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Article</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4 }}>{nextPost.title}</span>
                                </a>
                            ) : <div />}
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
