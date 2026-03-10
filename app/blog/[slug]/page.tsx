import { getPost, getAllPosts } from '@/lib/posts';
import NavBar from '@/components/NavBar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = getPost(params.slug);
    if (!post) return {};
    return {
        title: `${post.title} — itappens.ai Blog`,
        description: post.excerpt,
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getPost(params.slug);
    if (!post) notFound();

    // Convert markdown-ish content to paragraphs
    const lines = post.content.trim().split('\n').filter(Boolean);

    return (
        <>
            <NavBar />
            <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '120px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Back */}
                    <a href="/blog" style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
                        ← Blog
                    </a>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid var(--accent-border)', padding: '3px 10px' }}>{post.category}</span>
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{post.readTime}</span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)',
                        fontWeight: 800, lineHeight: 1.1, marginBottom: '32px', color: 'var(--text)'
                    }}>{post.title}</h1>

                    {/* Excerpt */}
                    <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '48px', borderLeft: '2px solid var(--accent)', paddingLeft: '20px' }}>
                        {post.excerpt}
                    </p>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '48px' }} />

                    {/* Content */}
                    <div style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.85 }}>
                        {lines.map((line, i) => {
                            if (line.startsWith('## ')) return (
                                <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--text)', margin: '40px 0 16px' }}>
                                    {line.replace('## ', '')}
                                </h2>
                            );
                            if (line.startsWith('**') && line.endsWith('**')) return (
                                <p key={i} style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
                                    {line.replace(/\*\*/g, '')}
                                </p>
                            );
                            return <p key={i} style={{ marginBottom: '16px' }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                        })}
                    </div>

                    {/* LinkedIn link */}
                    {post.linkedinUrl && (
                        <div style={{ marginTop: '48px', padding: '24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                            <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Originally on LinkedIn</div>
                            <a href={post.linkedinUrl} target="_blank" rel="noopener" style={{ color: 'var(--accent)', fontSize: '13px', textDecoration: 'none' }}>
                                Follow itappens.ai on LinkedIn →
                            </a>
                        </div>
                    )}

                    {/* CTA */}
                    <div style={{ marginTop: '48px', padding: '36px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '12px' }}>
                            Want this for your brand?
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
                            itappens.ai automates your content across all channels — or engineers your brand into AI answers.
                        </p>
                        <a href="/pricing" style={{
                            display: 'inline-block', background: 'var(--accent)', color: 'var(--bg)',
                            padding: '12px 28px', fontSize: '10px', letterSpacing: '2px',
                            textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700
                        }}>See Pricing →</a>
                    </div>
                </div>
            </main>
        </>
    );
}
