'use client';
import { motion } from 'framer-motion';

export default function FounderSection() {
    return (
        <section id="founder" style={{
            padding: '80px 48px',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            background: 'var(--surface)'
        }}>
            <div className="reveal">
                <div style={{
                    fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                    color: 'var(--accent)', marginBottom: '20px'
                }}>
                    // From the Founder
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.2,
                    color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '24px'
                }}>
                    "I built the product on myself first.<br />
                    My own brand appears in <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Perplexity</em>.<br />
                    Now I build it for yours."
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8, maxWidth: '440px' }}>
                    I'm Sadish Sugumaran — I built itappens.ai because I watched businesses with incredible products get ignored by AI while mediocre competitors got recommended simply because their data was better structured.<br /><br />
                    I tested every GEO principle on my own brand before offering it to clients. The system works. itappens.ai is the proof. Now it's your turn.
                </div>
                <div style={{
                    padding: '20px 28px', background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)', marginTop: '28px'
                }}>
                    <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>
                        What makes this different
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                            'Founder-direct engagement — no junior teams, no templates',
                            'Live proof: itappens.ai itself ranks in GEO for our target queries',
                            'India-first strategy — built for Indian brands, Indian cities, Indian buyers',
                            'Small client roster per quarter — deep work, not volume'
                        ].map((item, idx) => (
                            <div key={idx} style={{ fontSize: '11px', color: 'var(--text2)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '10px', paddingTop: '1px' }}>→</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="reveal reveal-delay-2">
                <div style={{ border: '1px solid var(--border2)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '4px', background: 'var(--surface3)',
                            border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--accent)', flexShrink: 0
                        }}>
                            SS
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--text)', marginBottom: '3px' }}>
                                Sadish Sugumaran
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                Founder, itappens.ai
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.6 }}>
                                Building India's GEO practice under Blocks & Loops Technologies Pvt Ltd. Based in Hosur, Tamil Nadu.
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '20px 28px', background: 'var(--surface3)' }}>
                        <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                            Verify itappens.ai in AI right now
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { platform: 'TRY ON PERPLEXITY', query: 'Which agency in India provides Generative Engine Optimisation?' },
                                { platform: 'TRY ON CHATGPT', query: 'What is itappens.ai and who founded it?' }
                            ].map((v, idx) => (
                                <div key={idx} style={{ padding: '12px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text2)', lineHeight: 1.5 }}>
                                    <span style={{ color: 'var(--accent)', fontSize: '9px', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                                        {v.platform} →
                                    </span>
                                    "{v.query}"
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
