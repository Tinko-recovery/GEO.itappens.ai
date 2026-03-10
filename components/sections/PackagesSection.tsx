'use client';
import { motion } from 'framer-motion';

const packages = [
    {
        id: 'geo',
        tag: 'itappens GEO',
        label: 'Full-Stack',
        headline: 'GEO + Content',
        description: 'Complete AI brand dominance. We engineer your brand into AI answers AND automate your content — zero manual effort.',
        features: [
            'AI Presence Audit (50+ queries)',
            'GEO strategy & implementation',
            'AI citation tracking',
            'Full content automation (below)',
            'Founder-direct onboarding',
        ],
        cta: 'Request GEO Package →',
        accent: true,
    },
    {
        id: 'content',
        tag: 'itappens Content',
        label: 'Automation Only',
        headline: 'Content Generator',
        description: 'Your social media on autopilot. Trending AI content, cinematic visuals, and Reels — posted daily across all channels.',
        features: [
            'Daily trend intelligence',
            'LinkedIn + Twitter/X posts',
            'Instagram Reels (AI video)',
            'YouTube Shorts',
            'Telegram approval — you control it',
        ],
        cta: 'Request Content Package →',
        accent: false,
    },
];

export default function PackagesSection() {
    return (
        <section id="packages" className="section-base section-padding">
            <div className="container-wide">
                <div className="eyebrow">
                    <div className="eyebrow-dot" />
                    <span>Packages</span>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="headline-lg"
                    style={{ marginBottom: '16px', maxWidth: 560 }}
                >
                    One platform.<br />
                    <span style={{ color: 'var(--accent)' }}>Two ways in.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-sub"
                    style={{ marginBottom: '64px', maxWidth: 480 }}
                >
                    Start with content automation. Add GEO when you're ready to own the AI conversation in your market.
                </motion.p>

                <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {packages.map((pkg, idx) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            style={{
                                border: `1px solid ${pkg.accent ? 'var(--accent-border)' : 'var(--border)'}`,
                                background: pkg.accent ? 'var(--accent-dim)' : 'var(--surface)',
                                padding: '40px',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                            }}
                        >
                            {pkg.accent && (
                                <div style={{
                                    position: 'absolute', top: '20px', right: '20px',
                                    background: 'var(--accent)', color: 'var(--bg)',
                                    fontSize: '8px', letterSpacing: '2px',
                                    textTransform: 'uppercase', padding: '4px 10px',
                                    fontWeight: 700,
                                }}>
                                    RECOMMENDED
                                </div>
                            )}

                            <div>
                                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
                                    {pkg.tag}
                                </div>
                                <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                                    {pkg.label}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
                                    {pkg.headline}
                                </h3>
                                <p className="text-sub" style={{ fontSize: '13px' }}>
                                    {pkg.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {pkg.features.map((f) => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text2)' }}>
                                        <div style={{ width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <a
                                href="/#cta"
                                style={{
                                    marginTop: 'auto',
                                    display: 'inline-block',
                                    background: pkg.accent ? 'var(--accent)' : 'transparent',
                                    color: pkg.accent ? 'var(--bg)' : 'var(--accent)',
                                    border: `1px solid ${pkg.accent ? 'var(--accent)' : 'var(--accent-border)'}`,
                                    padding: '14px 24px',
                                    fontSize: '10px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.85';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {pkg.cta}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    .packages-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
