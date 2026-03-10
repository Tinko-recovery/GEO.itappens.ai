'use client';
import { motion } from 'framer-motion';

// itappens Content features (table rows)
const contentRows = [
    { feature: 'LinkedIn daily posts', growth: true, pro: true },
    { feature: 'Twitter / X daily posts', growth: true, pro: true },
    { feature: 'AI-generated brand visuals (DALL·E 3)', growth: true, pro: true },
    { feature: 'Trend intelligence (HackerNews + Reddit)', growth: true, pro: true },
    { feature: 'First post live in 5 minutes', growth: true, pro: true },
    { feature: 'Client approval dashboard', growth: true, pro: true },
    { feature: 'Instagram Reels (AI video, daily)', growth: false, pro: true },
    { feature: 'YouTube Shorts (auto-posted)', growth: false, pro: true },
    { feature: 'Cinematic 9:16 video with music', growth: false, pro: true },
    { feature: 'Email preview before each post', growth: false, pro: true },
    { feature: 'Priority support', growth: false, pro: true },
];

export default function PackagesSection() {
    return (
        <section id="packages" style={{ padding: '80px 48px' }} className="packages-section">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="eyebrow" style={{ marginBottom: '16px' }}>
                    <div className="eyebrow-dot" />
                    <span>Our Products</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ marginBottom: '56px' }}
                >
                    <h2 className="headline-lg" style={{ margin: 0, maxWidth: 560 }}>
                        One platform.<br />
                        <span style={{ color: 'var(--accent)' }}>Two ways to grow.</span>
                    </h2>
                </motion.div>

                {/* ── itappens GEO ─────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{
                        border: '1px solid var(--accent-border)',
                        background: 'var(--accent-dim)',
                        padding: '40px',
                        marginBottom: '32px',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '40px',
                        alignItems: 'center'
                    }}
                    className="geo-card"
                >
                    <div>
                        <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                            itappens GEO
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, marginBottom: '12px' }}>
                            Get your brand in AI answers.
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, maxWidth: '560px', marginBottom: '20px' }}>
                            Full 6-phase GEO service — AI presence audit, entity architecture, golden snippet content, schema deployment, citation amplification, and monthly intelligence reports.
                            We make your brand the default AI recommendation in your category.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {['AI Presence Audit', 'Entity Architecture', 'Schema Setup', 'Monthly Reports', 'Citation Tracking'].map(tag => (
                                <span key={tag} style={{
                                    padding: '4px 12px', border: '1px solid var(--accent-border)',
                                    fontSize: '9px', letterSpacing: '1px', color: 'var(--accent)', textTransform: 'uppercase'
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '180px' }}>
                        <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '4px' }}>Starting from</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>₹19,999</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '20px' }}>/mo</div>
                        <a href="/pricing" style={{
                            display: 'block', textAlign: 'center',
                            background: 'var(--accent)', color: 'var(--bg)',
                            padding: '12px 24px', fontSize: '10px', letterSpacing: '2px',
                            textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700,
                        }}>
                            View GEO Plans →
                        </a>
                    </div>
                </motion.div>

                {/* ── itappens Content — Table ─────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>
                        itappens Content
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, marginBottom: '28px' }}>
                        Your social media on autopilot.
                    </div>

                    {/* Comparison Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                                    <th style={{
                                        textAlign: 'left', padding: '14px 20px',
                                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                        color: 'var(--muted)', fontWeight: 700, width: '50%'
                                    }}>Feature</th>
                                    <th style={{
                                        textAlign: 'center', padding: '14px 20px',
                                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                        color: 'var(--muted)', fontWeight: 700
                                    }}>
                                        Growth<br />
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text)', fontWeight: 800, letterSpacing: 0 }}>₹4,999<span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>/mo</span></span>
                                    </th>
                                    <th style={{
                                        textAlign: 'center', padding: '14px 20px',
                                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                        color: 'var(--accent)', fontWeight: 700,
                                        background: 'var(--accent-dim)', borderTop: '2px solid var(--accent)'
                                    }}>
                                        Pro ★ Most Popular<br />
                                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text)', fontWeight: 800, letterSpacing: 0 }}>₹9,999<span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>/mo</span></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentRows.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px 20px', fontSize: '12px', color: 'var(--text2)' }}>{row.feature}</td>
                                        <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                                            {row.growth
                                                ? <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
                                                : <span style={{ color: 'var(--muted)', opacity: 0.4, fontSize: '14px' }}>✗</span>}
                                        </td>
                                        <td style={{ padding: '12px 20px', textAlign: 'center', background: 'var(--accent-dim)' }}>
                                            {row.pro
                                                ? <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
                                                : <span style={{ color: 'var(--muted)', opacity: 0.4, fontSize: '14px' }}>✗</span>}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td style={{ padding: '20px' }} />
                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                        <a href="/signup?plan=growth" style={{
                                            display: 'inline-block', padding: '10px 24px',
                                            border: '1px solid var(--accent-border)', color: 'var(--accent)',
                                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                            textDecoration: 'none', fontWeight: 700
                                        }}>Start Growth →</a>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'center', background: 'var(--accent-dim)' }}>
                                        <a href="/signup?plan=pro" style={{
                                            display: 'inline-block', padding: '10px 24px',
                                            background: 'var(--accent)', color: 'var(--bg)',
                                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                            textDecoration: 'none', fontWeight: 700
                                        }}>Start Pro →</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
                        Annual plans save up to ₹40K · <a href="/pricing" style={{ color: 'var(--accent)' }}>See full pricing →</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
