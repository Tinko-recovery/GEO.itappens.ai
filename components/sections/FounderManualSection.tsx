'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const phases = [
    {
        n: '01', rev: '₹0 → Start',
        title: 'AI Presence Audit',
        hook: 'Diagnose the gap',
        desc: '200+ targeted prompts across ChatGPT, Perplexity, Gemini, and Claude measure your baseline citation rate. Unoptimised brands typically appear in 0–3% of relevant AI responses. The audit makes the invisible visible.',
        dur: 'Week 1–2',
        out: 'Citation Frequency Report · Competitor Gap Map',
    },
    {
        n: '02', rev: '₹0 → ₹1L',
        title: 'Entity Architecture',
        hook: 'Build the AI identity',
        desc: 'We design your semantic entity — the structured knowledge definition AI models use when reasoning about your brand. This is the foundation your category\'s AI answers will reference for years.',
        dur: 'Week 2–4',
        out: 'Brand Entity Document · Knowledge Graph Blueprint',
    },
    {
        n: '03', rev: '₹1L → ₹10L',
        title: 'Golden Snippet Sprint',
        hook: 'Plant flags in AI memory',
        desc: '12–18 high-information-gain content pieces, each engineered with 40-60 word, data-dense paragraphs that AI models tend to extract verbatim when answering related queries.',
        dur: 'Week 4–8',
        out: '18 GEO assets · Liftability score report',
    },
    {
        n: '04', rev: '₹10L → ₹30L',
        title: 'Schema & Technical Layer',
        hook: "Speak the machine's language",
        desc: 'Full JSON-LD deployment: Organization, Service, and FAQPage schemas. AI crawlers like PerplexityBot and OAI-SearchBot consume these directly, corroborating what your content claims.',
        dur: 'Week 6–10',
        out: '100% schema coverage · Structured data validation',
    },
    {
        n: '05', rev: '₹30L → ₹75L',
        title: 'Citation Amplification',
        hook: 'Build the corroboration network',
        desc: '15+ authoritative third-party references corroborating your entity claims. AI models weight multi-source confirmation heavily when forming answers — we engineer that confirmation.',
        dur: 'Week 8+ (ongoing)',
        out: '15+ entity references · Source map',
    },
    {
        n: '06', rev: '₹75L → ₹1Cr',
        title: 'GEO Intelligence Layer',
        hook: 'Compound the asset',
        desc: 'Monthly citation dashboards, quarterly entity refreshes, and real-time alerts when AI model updates affect your citation posture. GEO is not a one-time project — it is a compounding strategic asset.',
        dur: 'Monthly (ongoing)',
        out: 'Monthly GEO report · Citation trajectory · Entity refresh',
    },
];

export default function FounderManualSection() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const lineH = useTransform(scrollYProgress, [0.05, 0.9], ['0%', '100%']);

    return (
        <section
            id="roadmap"
            className="section-padding layer-top section-base"
            ref={ref}
        >
            <div className="container-wide">
                {/* Header — centered */}
                <motion.div
                    initial={{ opacity: 0.01, y: 32 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.85 }}
                    className="text-center"
                    style={{ marginBottom: 84 }}
                >
                    <h2 className="headline-lg" style={{ maxWidth: 820, margin: '0 auto 24px' }}>
                        What are the 6 phases from zero visibility<br />to becoming the default AI answer?
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="golden-snippet" style={{ textAlign: 'left' }}>
                            The itappens.ai 6-Phase Roadmap is a <strong>90-day compounding journey</strong> from AI invisibility to
                            category authority. Under Blocks and Loops Technologies Pvt Ltd, each phase builds on the last — turning
                            semantic signals into <strong>durable AI citations</strong> that persist long after an algorithm would have reshuffled.
                        </div>
                    </div>
                </motion.div>

                {/* Timeline */}
                <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}>
                    {/* Center line */}
                    <div style={{
                        position: 'absolute', left: '50%', top: 0, bottom: 0,
                        width: 1, background: 'var(--border-lo)', transform: 'translateX(-50%)',
                    }}>
                        <motion.div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%',
                            background: 'linear-gradient(to bottom, var(--indigo), rgba(129,140,248,0.3))',
                            height: lineH,
                        }} />
                    </div>

                    {phases.map((p, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div
                                key={p.n}
                                style={{ display: 'grid', gridTemplateColumns: '1fr 52px 1fr', marginBottom: 28 }}
                            >
                                {isLeft ? (
                                    <motion.div
                                        initial={{ opacity: 0.01, x: -32 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.1 * i, duration: 0.7 }}
                                        className="phase-card"
                                        style={{ marginRight: 18 }}
                                    >
                                        <PhaseContent p={p} />
                                    </motion.div>
                                ) : <div />}

                                {/* Dot */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 24 }}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={inView ? { scale: 1 } : {}}
                                        transition={{ delay: 0.1 * i + 0.15 }}
                                        style={{
                                            width: 11, height: 11, borderRadius: '50%',
                                            background: 'var(--indigo)',
                                            border: '2px solid var(--bg-base)',
                                            boxShadow: '0 0 12px rgba(129,140,248,0.5)',
                                            zIndex: 2,
                                        }}
                                    />
                                </div>

                                {!isLeft ? (
                                    <motion.div
                                        initial={{ opacity: 0.01, x: 32 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.1 * i, duration: 0.7 }}
                                        className="phase-card"
                                        style={{ marginLeft: 18 }}
                                    >
                                        <PhaseContent p={p} />
                                    </motion.div>
                                ) : <div />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function PhaseContent({ p }: { p: typeof phases[0] }) {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8 }}>
                <div className="phase-num">{p.n}</div>
                <span style={{
                    background: 'var(--indigo-dim)', border: '1px solid var(--indigo-border)',
                    borderRadius: 100, padding: '3px 10px',
                    fontFamily: 'var(--font-sans)', fontSize: '0.63rem',
                    fontWeight: 700, color: 'var(--indigo)', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                    {p.rev}
                </span>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, color: 'var(--indigo)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                {p.hook}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 400, color: 'var(--text-h)', marginBottom: 10, letterSpacing: '0.02em' }}>
                {p.title}
            </h3>
            <p style={{ color: 'var(--text-body)', fontSize: '0.855rem', lineHeight: 1.78, marginBottom: 14 }}>{p.desc}</p>
            <div style={{ borderTop: '1px solid var(--border-lo)', paddingTop: 10, fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                ⏱ {p.dur} &nbsp;·&nbsp; {p.out}
            </div>
        </>
    );
}
