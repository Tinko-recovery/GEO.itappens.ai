'use client';
import { motion } from 'framer-motion';

const phases = [
    {
        num: '01',
        phase: 'Phase One',
        title: 'AI Presence Audit',
        desc: '200+ targeted prompts across ChatGPT, Perplexity, Gemini and Claude establish your baseline citation rate. Most unoptimised brands appear in 0–3% of relevant AI responses. The audit makes the invisible visible — and gives us your competitor gap map.',
        timing: '⏱ Week 1–2',
        deliverable: 'Citation Frequency Report\nCompetitor Gap Map',
        active: true
    },
    {
        num: '02',
        phase: 'Phase Two',
        title: 'Entity Architecture',
        desc: 'We design your semantic entity — the structured definition AI models use when reasoning about your brand. This is the foundation your category\'s AI answers reference for years. Think of it as your brand\'s AI identity card.',
        timing: '⏱ Week 2–4',
        deliverable: 'Brand Entity Document\nKnowledge Graph Blueprint'
    },
    {
        num: '03',
        phase: 'Phase Three',
        title: 'Content Sprint',
        desc: '12–18 high-information-gain content pieces, each engineered with data-dense, AI-extractable paragraphs. These are the assets AI models pull from directly when answering questions in your category. Not generic blog posts — precision GEO assets.',
        timing: '⏱ Week 4–8',
        deliverable: '18 GEO Content Assets\nLiftability Score Report'
    },
    {
        num: '04',
        phase: 'Phase Four',
        title: 'Schema & Technical Layer',
        desc: 'Full JSON-LD deployment covering Organisation, Service, FAQPage and LocalBusiness schemas. AI crawlers like PerplexityBot and OAI-SearchBot consume these directly — they corroborate what your content claims and multiply citation confidence.',
        timing: '⏱ Week 6–10',
        deliverable: 'Full Schema Coverage\nStructured Data Validation'
    },
    {
        num: '05',
        phase: 'Phase Five',
        title: 'Citation Amplification',
        desc: '15+ authoritative third-party references — directories, press mentions, industry databases — corroborating your entity claims. AI models weight multi-source confirmation heavily. We engineer that confirmation network systematically.',
        timing: '⏱ Week 8+ (ongoing)',
        deliverable: '15+ Entity References\nSource Authority Map'
    },
    {
        num: '06',
        phase: 'Phase Six — Ongoing',
        title: 'GEO Intelligence Layer',
        desc: 'Monthly citation dashboards, quarterly entity refreshes, and real-time alerts when AI model updates affect your citation posture. GEO is not a one-time project — it is a compounding strategic asset that grows more valuable over time.',
        timing: '⏱ Monthly',
        deliverable: 'Monthly GEO Report\nCitation Trajectory\nEntity Refresh'
    }
];

export default function RoadmapSection() {
    return (
        <section id="roadmap" style={{ paddingBottom: '80px' }}>
            <div style={{ padding: '80px 48px 0', display: 'flex', alignItems: 'flex-start', gap: '48px', marginBottom: '48px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--muted2)', paddingTop: '4px', minWidth: '32px' }}>
                    03
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px' }}>
                        The 6-Phase Journey
                    </div>
                    <h2 className="headline-lg">
                        From invisible
                        <span style={{ display: 'block', paddingLeft: '56px', color: 'var(--text2)' }}>
                            to <span style={{ color: 'var(--accent)' }}>default answer.</span>
                        </span>
                    </h2>
                    <p style={{
                        fontSize: '13px', color: 'var(--text2)', maxWidth: '480px', lineHeight: '1.8',
                        marginTop: '20px', borderLeft: '2px solid var(--surface3)', paddingLeft: '20px'
                    }}>
                        A 90-day compounding roadmap. Each phase builds on the last — turning your brand from an unknown entity into the name AI models consistently recommend.
                    </p>
                </div>
            </div>

            <div style={{ margin: '0 48px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border2)' }}>
                {phases.map((p, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'grid', gridTemplateColumns: '80px 1fr 200px',
                            borderBottom: idx === phases.length - 1 ? 'none' : '1px solid var(--border)',
                            transition: 'background 0.2s'
                        }}
                        className="roadmap-item-hover"
                    >
                        <div style={{
                            padding: '28px 20px', borderRight: '1px solid var(--border)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                            gap: '8px', background: 'var(--surface)'
                        }}>
                            <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
                                color: 'rgba(232, 213, 163, 0.15)', lineHeight: 1
                            }}>
                                {p.num}
                            </div>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: p.active ? 'var(--accent)' : 'var(--muted2)',
                                boxShadow: p.active ? '0 0 8px rgba(255, 107, 26, 0.4)' : 'none'
                            }} />
                        </div>
                        <div style={{ padding: '28px 32px' }}>
                            <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
                                {p.phase}
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text)', marginBottom: '8px' }}>
                                {p.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.7 }}>
                                {p.desc}
                            </div>
                        </div>
                        <div style={{
                            padding: '28px 20px', borderLeft: '1px solid var(--border)',
                            display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center'
                        }}>
                            <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px' }}>{p.timing}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.deliverable}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
