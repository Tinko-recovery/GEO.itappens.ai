'use client';
import { motion } from 'framer-motion';

const pillars = [
    {
        num: '01',
        icon: '🧬',
        tag: 'Pillar One',
        title: 'Semantic Identity Seeding',
        body: "AI models don't find you by keyword — they recognise you as a known entity. We build the structured knowledge definition that makes AI models say your brand's name with confidence when answering questions in your category.",
        result: '→ Your brand becomes a named entity, not just text'
    },
    {
        num: '02',
        icon: '⚡',
        tag: 'Pillar Two',
        title: 'Information Gain Content',
        body: "AI models cite sources that provide unique, data-dense information — not generic blog posts. We engineer 12–18 high-value content pieces specifically designed to be extracted and quoted by AI reasoning engines when answering your category's queries.",
        result: '→ Most clients achieve citations within 8–12 weeks'
    },
    {
        num: '03',
        icon: '🏗️',
        tag: 'Pillar Three',
        title: 'Machine-Readable Infrastructure',
        body: "Deep JSON-LD Schema (Organisation, Service, FAQ, LocalBusiness) that gives AI crawlers like PerplexityBot the mathematical proof they need to trust and cite your brand. Without this, your site is readable to humans but invisible to AI.",
        result: '→ Full schema coverage on deployment'
    },
    {
        num: '04',
        icon: '📈',
        tag: 'Pillar Four',
        title: 'AI Citation Auditing',
        body: "We run 200+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude every two weeks to measure your brand's citation frequency. When AI model updates affect your visibility, we know within days and respond with targeted content.",
        result: '→ Bi-weekly AI presence delta reports'
    }
];

export default function SolutionSection() {
    return (
        <section id="system" style={{ paddingBottom: '80px' }}>
            <div style={{ padding: '80px 48px 0', display: 'flex', alignItems: 'flex-start', gap: '48px', marginBottom: '48px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--muted2)', paddingTop: '4px', minWidth: '32px' }}>
                    01
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                        The 4-Pillar System
                    </div>
                    <h2 className="headline-lg">
                        How your brand becomes
                        <span style={{ display: 'block', paddingLeft: '56px', color: 'var(--text2)' }}>
                            the <span style={{ color: 'var(--accent)' }}>default answer.</span>
                        </span>
                    </h2>
                    <p style={{
                        fontSize: '13px', color: 'var(--text2)', maxWidth: '480px', lineHeight: '1.8',
                        marginTop: '20px', borderLeft: '2px solid var(--surface3)', paddingLeft: '20px'
                    }}>
                        In 2026, brands are no longer ranked — they are cited. Traditional SEO gets you on Google Page 1. GEO gets you named by AI. These are two completely different games. We play the new one.
                    </p>
                </div>
            </div>

            <div style={{
                margin: '0 48px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                border: '1px solid var(--border2)'
            }}>
                {pillars.map((p, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: '40px 36px',
                            borderRight: idx % 2 === 0 ? '1px solid var(--border)' : 'none',
                            borderBottom: idx < 2 ? '1px solid var(--border)' : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        className="pillar-hover"
                    >
                        <div style={{
                            position: 'absolute', top: -10, right: 16,
                            fontFamily: 'var(--font-display)', fontSize: '80px', fontWeight: 800,
                            color: 'rgba(232, 213, 163, 0.03)', lineHeight: 1, pointerEvents: 'none'
                        }}>
                            {p.num}
                        </div>
                        <div style={{ fontSize: '24px', marginBottom: '16px' }}>{p.icon}</div>
                        <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px' }}>
                            {p.tag}
                        </div>
                        <h3 style={{
                            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px',
                            color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2
                        }}>
                            {p.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px' }}>
                            {p.body}
                        </p>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            fontSize: '10px', color: 'var(--accent)', border: '1px solid var(--accent-border)',
                            padding: '5px 12px', background: 'var(--accent-dim)'
                        }}>
                            {p.result}
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-divider" style={{ marginTop: '48px', height: '1px', background: 'linear-gradient(to right, transparent, var(--border2), transparent)', margin: '48px 48px 0' }} />

            <div style={{
                margin: '48px 48px 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                border: '1px solid var(--border2)',
                overflow: 'hidden'
            }}>
                {[
                    { val: '<200', label: 'Indian brands\nGEO-ready today' },
                    { val: '90 days', label: 'To first verified\nAI citations', acc: true },
                    { val: '5x', label: 'Growth in AI search\nvs traditional search' },
                    { val: '0', label: 'Indian agencies\nGEO-first before us', acc: true }
                ].map((s, idx) => (
                    <div
                        key={idx}
                        style={{
                            padding: '28px 24px',
                            borderRight: idx === 3 ? 'none' : '1px solid var(--border)',
                            background: 'var(--bg)'
                        }}
                    >
                        <div style={{
                            fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800,
                            color: s.acc ? 'var(--accent)' : 'var(--text)', lineHeight: 1, marginBottom: '6px'
                        }}>
                            {s.val}
                        </div>
                        <div style={{
                            fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px',
                            textTransform: 'uppercase', lineHeight: 1.5, whiteSpace: 'pre-line'
                        }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
