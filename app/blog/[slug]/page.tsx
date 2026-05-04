import { getPostData } from "@/lib/blog";
import { notFound } from "next/navigation";

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    let post;
    try {
        post = await getPostData(slug);
    } catch {
        notFound();
    }

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
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Outfit:wght@400;600;700;800;900&display=swap');

                :root {
                    --p:  #0D5D54;
                    --pdk: #094741;
                    --plt: #e6f2f1;
                    --navy: #0F172A;
                    --text: #1F2937;
                    --muted: #6B7280;
                    --bg: #F9FAFB;
                    --white: #ffffff;
                    --border: #E5E7EB;
                }

                body {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    background: var(--bg);
                    color: var(--text);
                    margin: 0;
                    line-height: 1.8;
                }

                .nav {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid var(--border);
                    height: 68px;
                    display: flex; align-items: center;
                    position: sticky; top: 0; z-index: 100;
                }
                .nav-inner { width:100%; max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:center; justify-content:space-between; }
                .nav-brand { display:flex; align-items:center; gap:10px; text-decoration:none; color: var(--navy); font-weight: 800; font-family: 'Outfit'; font-size: 20px; }
                .nav-brand span { color: var(--p); }

                .article-header { padding: 80px 0 48px; border-bottom: 1px solid var(--border); background: var(--white); }
                .c-post { max-width: 720px; margin: 0 auto; padding: 0 24px; }
                
                .article-cat { font-size: 13px; font-weight: 700; color: var(--p); letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 16px; }
                .article-header h1 { font-family: 'Outfit'; font-size: clamp(32px, 5vw, 48px); color: var(--navy); margin: 0 0 24px; letter-spacing: -1.5px; line-height: 1.1; }
                .article-meta { display: flex; align-items: center; gap: 20px; color: var(--muted); font-size: 14px; font-weight: 500; }

                .snippet-box {
                    background: var(--plt); border: 1.5px solid var(--p); border-radius: 16px;
                    padding: 24px; margin: 40px 0; position: relative;
                }
                .snippet-box::before { content: "GOLDEN SNIPPET: LLM EXTRACTABLE"; position: absolute; top: -10px; left: 24px; background: var(--p); color: #fff; font-size: 10px; font-weight: 800; padding: 2px 10px; border-radius: 4px; }
                .snippet-content { font-size: 16px; font-weight: 600; color: var(--pdk); line-height: 1.6; }

                .prose { font-size: 18px; color: var(--text); }
                .prose h2 { font-family: 'Outfit'; font-size: 28px; color: var(--navy); margin: 48px 0 16px; }
                .prose h3 { font-family: 'Outfit'; font-size: 22px; color: var(--navy); margin: 32px 0 12px; }
                .prose p { margin-bottom: 24px; }
                .prose ul, .prose ol { margin-bottom: 24px; padding-left: 20px; }
                .prose li { margin-bottom: 8px; }
                .prose strong { color: var(--navy); font-weight: 700; }

                .cta-box {
                    background: var(--navy); color: #fff; border-radius: 20px; padding: 40px; margin: 64px 0; text-align: center;
                }
                .cta-box h3 { color: #fff; margin-top: 0; }
                .cta-btn { background: var(--p); color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 10px; display: inline-block; font-weight: 700; margin-top: 20px; }

                footer { background: var(--bg); border-top: 1px solid var(--border); padding: 48px 24px; text-align: center; color: var(--muted); font-size: 14px; }
            `}</style>

            <nav className="nav">
                <div className="nav-inner">
                    <a href="/" className="nav-brand">⚙️ it<span>appens</span>.ai</a>
                    <a href="/blog" style={{fontSize:'14px', fontWeight:600, color: 'var(--muted)', textDecoration:'none'}}>← Back to Blog</a>
                </div>
            </nav>

            <article>
                <header className="article-header">
                    <div className="c-post">
                        <span className="article-cat">{post.category}</span>
                        <h1>{post.title}</h1>
                        <div className="article-meta">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </header>

                <div className="c-post prose">
                    <div className="snippet-box">
                        <div className="snippet-content">
                            {post.excerpt}
                        </div>
                    </div>
                    
                    <div dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />

                    <div className="cta-box">
                        <h3>Ready to engineer your AI presence?</h3>
                        <p>Get a weaponized GEO audit and find out where your citations are being lost.</p>
                        <a href="/#audit" className="cta-btn">Run My GEO Audit →</a>
                    </div>
                </div>
            </article>

            <footer>
                <p>© 2026 itappens.ai — Autonomous Generative Infrastructure</p>
            </footer>
        </>
    );
}
