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
        }} className="founder-grid">
            <div className="reveal">
                <div style={{
                    fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                    color: 'var(--accent)', marginBottom: '20px'
                }}>
                    // Why itappens.ai
                </div>
                <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.2,
                    color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '24px'
                }}>
                    "We built the product on ourselves first.<br />
                    Our own brand appears in <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Perplexity</em>.<br />
                    Now we build it for yours."
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8, maxWidth: '440px' }}>
                    itappens.ai was built because brands with incredible products get ignored by AI
                    while mediocre competitors get recommended — simply because their data is better structured.<br /><br />
                    We tested every GEO principle on our own brand before offering it to clients. The system works.
                    itappens.ai is the proof. Now it&apos;s your turn.
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
                            'Direct engagement — no junior teams, no templates',
                            'Live proof: itappens.ai itself ranks in GEO for target queries',
                            'India-first strategy — built for Indian brands and buyers',
                            'Focused client roster — deep work, not volume'
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
                    <div style={{ padding: '28px', borderBottom: '1px solid var(--border)' }}>
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
                                    &quot;{v.query}&quot;
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: '20px 28px', background: 'var(--surface3)' }}>
                        <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                            itappens.ai by the numbers
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { val: '50+', label: 'AI Audits completed' },
                                { val: '90', label: 'Days to citation authority' },
                                { val: '40%', label: 'Avg citation increase' },
                                { val: '4.2×', label: 'Higher AI trust signal' },
                            ].map((s, i) => (
                                <div key={i}>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{s.val}</div>
                                    <div style={{ fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
