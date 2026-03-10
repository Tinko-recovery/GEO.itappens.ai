'use client';
import { getAllPosts } from '@/lib/posts';
import { motion } from 'framer-motion';

export default function BlogTeaser() {
    const posts = getAllPosts().slice(0, 3);

    return (
        <section id="blog" style={{ padding: '80px 48px', borderTop: '1px solid var(--border)' }} className="blog-teaser-section">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div className="eyebrow" style={{ marginBottom: '12px' }}>
                            <div className="eyebrow-dot" />
                            <span>From the Team</span>
                        </div>
                        <h2 className="headline-lg" style={{ margin: 0, maxWidth: 440 }}>
                            Thinking on AI,<br />
                            <span style={{ color: 'var(--accent)' }}>brand & content.</span>
                        </h2>
                    </div>
                    <a href="/blog" style={{
                        border: '1px solid var(--border)', padding: '12px 24px',
                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                        color: 'var(--muted)', textDecoration: 'none', whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                    }}>
                        All Articles →
                    </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }} className="blog-grid">
                    {posts.map((post, idx) => (
                        <motion.a
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            style={{
                                background: 'var(--bg)', padding: '32px 28px',
                                textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '16px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
                        >
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{
                                    fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
                                    color: 'var(--accent)', border: '1px solid var(--accent-border)', padding: '2px 8px'
                                }}>{post.category}</span>
                                <span style={{ fontSize: '9px', color: 'var(--muted)' }}>{post.readTime}</span>
                            </div>

                            <h3 style={{
                                fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 2vw, 20px)',
                                fontWeight: 700, lineHeight: 1.25, color: 'var(--text)', flex: 1
                            }}>{post.title}</h3>

                            <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65 }}>
                                {post.excerpt.slice(0, 120)}...
                            </p>

                            <div style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' }}>Read →</div>
                        </motion.a>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .blog-grid { grid-template-columns: 1fr !important; }
                    .blog-teaser-section { padding: 60px 20px !important; }
                }
            `}</style>
        </section>
    );
}
