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
                    style={{ zIndex: 1 }}
                >
                    <div className="eyebrow-dot" />
                    <span className="hero-eyebrow-text">itcontents — Premium AI Automation</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    className="headline-xl hero-headline"
                    style={{ zIndex: 1 }}
                >
                    <span style={{ display: 'block' }}>Your Social Media</span>
                    <span className="headline-indent-1" style={{ display: 'block', color: 'var(--text2)' }}>
                        on Autopilot.
                    </span>
                    <span className="headline-indent-2" style={{ display: 'block' }}>
                        <span style={{ color: 'var(--accent)' }}>Zero-Touch</span> Quality.
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    style={{
                        zIndex: 1
                    }}
                    className="hero-sub-row-container"
                >
                    <div className="hero-sub-row" style={{
                        display: 'grid',
                        gap: '48px',
                        marginTop: '48px',
                        alignItems: 'end'
                    }}>
                        <div className="text-sub hero-description" style={{ maxWidth: 480 }}>
                            Stop spending 20 hours a week on content that barely gets seen.<br /><br />
                            itcontents uses an agentic engine to research trends, write human-first copy, and generate premium Ken Burns video content — reviewed and approved by you before anything goes live.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <a href="/itcontents/onboard" className="btn-primary">Try Free Demo →</a>
                            <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', textAlign: 'center' }}>
                                A Product of itappens.ai
                            </div>
                        </div>
                    </div>
                </motion.div>

                <style jsx>{`
                    .headline-indent-1 { padding-left: clamp(32px, 6vw, 80px); }
                    .headline-indent-2 { padding-left: clamp(64px, 12vw, 160px); }
                    .hero-sub-row { grid-template-columns: 1fr 340px; }

                    @media (max-width: 900px) {
                        .hero-sub-row { grid-template-columns: 1fr; }
                        .headline-indent-1, .headline-indent-2 { padding-left: 0; }
                    }
                    @media (max-width: 600px) {
                        section { padding: 120px 24px 60px !important; }
                        .hero-headline { font-size: 42px !important; }
                    }
                `}</style>
            </section>

            <section className="section-base section-padding itcontents-workflow">
                <div className="container-wide">
                    <div className="eyebrow">
                        <div className="eyebrow-dot" />
                        <span>The itcontents Workflow</span>
                    </div>
                    <div className="workflow-grid" style={{ display: 'grid', gap: '32px', marginTop: '48px' }}>
                        {[
                            { step: '01', title: 'Data Feed', desc: 'Connect your Google Sheet. One row = One topic.' },
                            { step: '02', title: 'AI Orchestration', desc: 'Our engine generates premium text, images, and videos.' },
                            { step: '03', title: 'Approval Portal', desc: 'Review and approve content via email or your client dashboard before it goes live.' }
                        ].map((item) => (
                            <div key={item.step} className="phase-card">
                                <div className="phase-num">{item.step}</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '12px' }}>{item.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    .workflow-grid { grid-template-columns: repeat(3, 1fr); }
                    @media (max-width: 900px) {
                        .workflow-grid { grid-template-columns: 1fr; }
                        .itcontents-workflow { padding: 80px 24px !important; }
                    }
                `}</style>
            </section>

            <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
                        © 2026 itappens.ai — Blocks and Loops Technologies Pvt Ltd.
                    </div>
                    <a href="/" style={{ fontSize: '10px', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '1px' }}>Back to Hub</a>
                </div>
            </footer>
        </main>
    );
}
