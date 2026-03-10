'use client';
import { getAllPosts } from '@/lib/posts';
import NavBar from '@/components/NavBar';

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <>
            <NavBar />
            <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '120px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '64px' }}>
                        <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px' }}>
                            From the Engine Room
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
                            Insights on AI,<br />
                            <span style={{ color: 'var(--accent)' }}>Brand & Content.</span>
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '520px', lineHeight: 1.7 }}>
                            Everything we post on LinkedIn — and more. Real thinking on GEO, content automation, and what it takes to build a brand that AI models actually cite.
                        </p>
                    </div>

                    {/* Post List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {posts.map((post, idx) => (
                            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '36px 0',
                                    borderTop: '1px solid var(--border)',
                                    borderBottom: idx === posts.length - 1 ? '1px solid var(--border)' : 'none',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    gap: '24px',
                                    alignItems: 'start',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '12px'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '0'; }}
                                    className="blog-row"
                                >
                                    <div>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
                                                color: 'var(--accent)', border: '1px solid var(--accent-border)',
                                                padding: '3px 10px'
                                            }}>{post.category}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                                                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{post.readTime}</span>
                                        </div>
                                        <h2 style={{
                                            fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 24px)',
                                            fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', marginBottom: '10px'
                                        }}>{post.title}</h2>
                                        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
                                        {post.linkedinUrl && (
                                            <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' }}>
                                                Also on LinkedIn →
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ color: 'var(--accent)', fontSize: '24px', paddingTop: '4px', flexShrink: 0 }}>→</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* LinkedIn CTA */}
                    <div style={{
                        marginTop: '64px', padding: '40px', border: '1px solid var(--border)',
                        background: 'var(--surface)', display: 'flex', gap: '24px',
                        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'
                    }}>
                        <div>
                            <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>Live on LinkedIn</div>
                            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6, maxWidth: '400px' }}>
                                We post daily on LinkedIn. Follow <strong>itappens.ai</strong> for the freshest content — some of it makes it here, all of it goes there first.
                            </p>
                        </div>
                        <a href="https://www.linkedin.com/company/itappens-ai/" target="_blank" rel="noopener" style={{
                            background: 'var(--accent)', color: 'var(--bg)', padding: '12px 24px',
                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                            textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap'
                        }}>Follow on LinkedIn →</a>
                    </div>
                </div>

            </main>
        </>
    );
}
