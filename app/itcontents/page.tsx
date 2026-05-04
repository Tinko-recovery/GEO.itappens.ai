'use client';

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { motion } from 'framer-motion';
import SocialDashboard from "@/components/social/SocialDashboard";
import { Suspense } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

function itcontents() {
    return (
        <div className="page-shell">
            <Suspense fallback={<div className="h-20 bg-surface animate-pulse" />}>
                <NavBar />
            </Suspense>
            <main>
                <section className="section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '160px 0 80px', background: 'var(--bg)' }}>
                    {/* Ghost text */}
                    <div style={{
                        position: 'absolute',
                        right: '-5%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(140px, 25vw, 400px)',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.03)',
                        lineHeight: 1,
                        pointerEvents: 'none',
                        letterSpacing: '-0.05em',
                        zIndex: 0
                    }}>
                        CONTENT
                    </div>

                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            style={{ marginBottom: '32px' }}
                        >
                            <span className="overline" style={{ color: 'var(--brand-blue)', backgroundColor: 'rgba(58, 190, 249, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                              itcontents — Agentic Social Media
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="headline-xl"
                            style={{ maxWidth: '950px', marginBottom: '48px', lineHeight: 1.05 }}
                        >
                            Your social media on <br />
                            <span style={{ 
                                background: 'linear-gradient(to right, var(--brand-blue), var(--brand-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Autopilot.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '80px', alignItems: 'end' }}
                        >
                            <p className="text-sub" style={{ margin: 0, maxWidth: '600px', fontSize: '18px', opacity: 0.8 }}>
                                Stop spending hours on content creation. itcontents uses an agentic engine to research trends, 
                                write human-first copy, and generate premium video assets—all approved by you via the Hub below.
                            </p>
                            <div className="card-glass" style={{ padding: '32px', borderRadius: '16px' }}>
                                <a href="#dashboard" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '16px', borderRadius: '10px' }}>
                                    Launch Automation Hub ↓
                                </a>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px', fontFamily: 'var(--font-mono)', opacity: 0.6 }}>
                                    Paid Subscription Required for Generation
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section id="dashboard" className="section" style={{ padding: '80px 0 140px', background: 'var(--bg)' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
                            <div>
                                <span className="overline" style={{ color: 'var(--brand-green)', marginBottom: '12px', display: 'block' }}>AUTOMATION HUB</span>
                                <h2 className="headline-sm" style={{ fontSize: '28px', color: 'var(--text)' }}>Management Dashboard</h2>
                            </div>
                            <div style={{ textAlign: 'right', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</p>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-blue)' }}>itcontents PRO</span>
                            </div>
                        </div>
                    </div>
                    <Suspense fallback={<div className="container h-96 bg-surface animate-pulse rounded-2xl" />}>
                        <div style={{ position: 'relative' }}>
                             <SocialDashboard />
                        </div>
                    </Suspense>
                </section>

                <section className="section" style={{ padding: '140px 0', backgroundColor: 'var(--surface-alt)', borderTop: '1px solid var(--border)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                             <span className="overline" style={{ color: 'var(--brand-green)', backgroundColor: 'rgba(57, 181, 73, 0.08)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '24px' }}>The Workflow</span>
                             <h2 className="headline-lg">Zero Context Switching.</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                            {[
                                { step: '01', title: 'Data Feed', desc: 'Connect your inventory or topic list. One row is all it takes to trigger a complete narrative.', color: 'var(--brand-blue)' },
                                { step: '02', title: 'AI Orchestration', desc: 'Our engine researches high-signal trends and generates premium video & text assets.', color: 'var(--brand-green)' },
                                { step: '03', title: 'Interactive Hub', desc: 'Approve or edit drafts via this dashboard or your Telegram. Zero context switching.', color: 'var(--brand-yellow)' }
                            ].map((item) => (
                                <div key={item.step} className="card-glass" style={{ padding: '48px', position: 'relative' }}>
                                    <div style={{ 
                                        width: '48px', 
                                        height: '48px', 
                                        borderRadius: '12px', 
                                        backgroundColor: `${item.color}15`, 
                                        color: item.color, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 800,
                                        marginBottom: '32px',
                                        border: `1px solid ${item.color}20`
                                    }}>{item.step}</div>
                                    <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>{item.title}</h3>
                                    <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7, margin: 0, opacity: 0.8 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Suspense fallback={<div className="h-40 bg-surface" />}>
                <SiteFooter />
            </Suspense>
        </div>
    );
}

export default withPageAuthRequired(itcontents);
