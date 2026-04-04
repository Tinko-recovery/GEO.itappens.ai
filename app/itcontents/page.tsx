'use client';
import NavBar from "@/components/NavBar";
import { motion } from 'framer-motion';

export default function itcontents() {
    return (
        <main className="min-h-screen">
            <NavBar />

            <section style={{
                minHeight: '100vh',
                padding: '140px 48px 80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Ghost text */}
                <div style={{
                    position: 'absolute',
                    right: '-40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(120px, 18vw, 240px)',
                    fontWeight: 800,
                    color: 'rgba(232, 213, 163, 0.02)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    letterSpacing: '-8px',
                    zIndex: 0
                }}>
                    CONTENT
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hero-eyebrow"
                >
                    <div className="eyebrow-dot" />
                    <span className="hero-eyebrow-text">itcontents â€” Premium AI Automation</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="headline-xl"
                >
                    <span style={{ display: 'block' }}>Your Social Media</span>
                    <span style={{ display: 'block', paddingLeft: 'clamp(32px, 6vw, 80px)', color: 'var(--text2)' }}>
                        on Autopilot.
                    </span>
                    <span style={{ display: 'block', paddingLeft: 'clamp(64px, 12vw, 160px)' }}>
                        <span style={{ color: 'var(--accent)' }}>Zero-Touch</span> Quality.
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 340px',
                        gap: '48px',
                        marginTop: '48px',
                        alignItems: 'end',
                        zIndex: 1
                    }}
                    className="hero-sub-row"
                >
                    <div className="text-sub" style={{ maxWidth: 480 }}>
                        Stop spending 20 hours a week on content that barely gets seen.<br /><br />
                        itcontents uses an agentic engine to research trends, write human-first copy, and generate premium Ken Burns video contentâ€”all approved by you in Telegram.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <a href="https://t.me/itcontents_ai" target="_blank" className="btn-primary">View the Showroom â†’</a>
                        <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textAlign: 'center' }}>
                            A Product of itappens.ai
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="section-base section-padding">
                <div className="container-wide">
                    <div className="eyebrow">
                        <div className="eyebrow-dot" />
                        <span>The itcontents Workflow</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '48px' }}>
                        {[
                            { step: '01', title: 'Data Feed', desc: 'Connect your Google Sheet. One row = One topic.' },
                            { step: '02', title: 'AI Orchestration', desc: 'Our engine generates premium text, images, and videos.' },
                            { step: '03', title: 'Telegram Approval', desc: 'Approve or edit with a single tap on your phone.' }
                        ].map((item) => (
                            <div key={item.step} className="phase-card">
                                <div className="phase-num">{item.step}</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '12px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
                        © 2026 itappens.ai
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}><a href="mailto:hello@itappens.ai" style={{ fontSize: '10px', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '1px' }}>hello@itappens.ai</a><a href="/" style={{ fontSize: '10px', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '1px' }}>Back to Hub</a></div>
                </div>
            </footer>
        </main>
    );
}
