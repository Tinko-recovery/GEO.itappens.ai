'use client';
import { useState } from 'react';

export default function CTASection() {
    return (
        <section id="cta" style={{
            margin: '0 48px 80px',
            border: '1px solid var(--accent-border)',
            background: 'var(--accent-dim)',
            padding: '80px 48px',
            display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'center'
        }}>
            <div className="reveal">
                <div style={{
                    fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                    color: 'var(--accent)', marginBottom: '24px'
                }}>
                    // Next Action
                </div>
                <h2 className="headline-lg" style={{ marginBottom: '24px' }}>
                    See where you stand.<br />
                    <span style={{ color: 'var(--accent)' }}>Free AI Audit.</span>
                </h2>
                <div className="text-sub" style={{ maxWidth: '440px' }}>
                    We'll run your brand through 50+ targeted queries across ChatGPT, Perplexity, Gemini and Claude.<br /><br />
                    You'll get a report showing exactly where you're being cited, where you're invisible, and exactly which competitor is taking your traffic. No sales call. No credit card. Just the data.
                </div>

                <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { val: '50+', label: 'AI Presence Audits\nDone in India' },
                        { val: '100%', label: 'Founder-direct\nStrategy review' }
                    ].map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, width: '80px' }}>
                                {s.val}
                            </div>
                            <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="reveal reveal-delay-2">
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '40px' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
                                Corporate Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                style={{
                                    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                                    padding: '16px', color: 'var(--text)', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
                                Website URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://yourbrand.com"
                                style={{
                                    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                                    padding: '16px', color: 'var(--text)', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
                                Primary Competitor URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://competitor.com"
                                style={{
                                    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
                                    padding: '16px', color: 'var(--text)', fontSize: '14px', outline: 'none'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', padding: '18px', fontSize: '11px', letterSpacing: '3px' }}
                        >
                            Request AI Audit →
                        </button>
                        <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>
                            Founder @ itappens.ai will review this personally.
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
