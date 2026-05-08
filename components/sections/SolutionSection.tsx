'use client';
import { motion } from 'framer-motion';

const pillars = [
    {
        num: '01',
        title: 'Technical Signals',
        body: 'We normalize your entity schema, llms.txt, and crawl assets. This ensures AI systems extract a consistent machine-readable profile of your brand.',
        tag: 'Infrastructure'
    },
    {
        num: '02',
        title: 'Content Layer',
        body: 'We publish answer-first content clusters engineered for high-intent queries that buyers actually ask inside generative platforms.',
        tag: 'Authority'
    },
    {
        num: '03',
        title: 'Entity & Citation',
        body: 'We reinforce your identity and claims across the web, ensuring third-party references corroborate your core service definitions.',
        tag: 'Corroboration'
    },
    {
        num: '04',
        title: 'Tracking & Iteration',
        body: 'Weekly citation movement reports across all major engines. We use gap analysis to decide the next content and technical push.',
        tag: 'Precision'
    }
];

export default function SolutionSection() {
    return (
        <section id="solutions" style={{ padding: '120px 0', backgroundColor: 'var(--light-bg)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="badge-pill" style={{ marginBottom: '24px' }}>The Methodology</span>
                    <h2 className="headline-lg">A Systematic Framework for <br /> <span style={{ color: 'var(--blue)' }}>AI Retrieval Domination.</span></h2>
                </div>

                <div className="bento-grid">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="card-corporate"
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--blue)', opacity: 0.2 }}>{p.num}</span>
                                <span className="badge-pill">{p.tag}</span>
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 700 }}>{p.title}</h3>
                            <p style={{ color: 'var(--slate)', lineHeight: 1.7 }}>
                                {p.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

