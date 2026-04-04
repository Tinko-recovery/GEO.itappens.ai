'use client';
import { motion } from 'framer-motion';

const steps = [
    {
        title: 'Analyze',
        overline: 'Step 01',
        desc: 'We run 200+ targeted prompts across ChatGPT, Perplexity, and Claude to map your current "Citation Gap" against your competitors in the KIADB/Industrial sector.'
    },
    {
        title: 'Engineer',
        overline: 'Step 02',
        desc: 'We build your Semantic Identity—the structured definition AI models use when reasoning about your brand. This is the foundation of your AI-first authority.'
    },
    {
        title: 'Inject',
        overline: 'Step 03',
        desc: 'We deploy machine-readable infrastructure (Deep JSON-LD) and "Information Gain" content that AI crawlers like PerplexityBot prioritizes for extraction.'
    },
    {
        title: 'Rank',
        overline: 'Step 04',
        desc: 'The result: Your brand becomes the default answer. We track and maintain your citation frequency as AI models evolve, ensuring you stay cited, not just indexed.'
    }
];

export default function RoadmapSection() {
    return (
        <section id="roadmap" style={{ padding: '120px 0', background: 'var(--surface)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="overline">The Timeline</span>
                    <h2 className="headline-lg">How We Engineer Your <br /> <span style={{ color: 'var(--accent)' }}>AI Presence.</span></h2>
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Vertical Indigo Line */}
                    <div style={{ 
                        position: 'absolute', left: '20px', top: '0', bottom: '0', 
                        width: '2px', background: 'var(--accent)', opacity: 0.3 
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                style={{ display: 'flex', gap: '40px', position: 'relative', zIndex: 1 }}
                            >
                                {/* Circle Indicator */}
                                <div style={{ 
                                    width: '42px', height: '42px', borderRadius: '50%', background: 'var(--bg)', 
                                    border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', 
                                    justifyContent: 'center', flexShrink: 0 
                                }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                                </div>

                                <div style={{ paddingTop: '8px' }}>
                                    <span className="overline" style={{ fontSize: '10px', marginBottom: '8px' }}>{step.overline}</span>
                                    <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{step.title}</h3>
                                    <p style={{ fontSize: '15px', color: 'var(--text-dim)', lineHeight: 1.7 }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
