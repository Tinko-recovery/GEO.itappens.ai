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

                <div className="bento-grid" style={{ marginBottom: '80px' }}>
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

                {/* Mind Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ 
                        background: 'var(--navy)', 
                        borderRadius: '24px', 
                        padding: '48px', 
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {/* Glowing effect inside the dark container */}
                    <div style={{
                        position: 'absolute',
                        top: '0%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '60%', height: '40%',
                        background: 'var(--cyan)',
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                        <h3 style={{ color: '#fff', fontSize: '28px', marginBottom: '16px' }}>The Complete Strategy Map</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                            A top-down view of our entire optimization architecture—from foundational entity definitions to off-site citation building.
                        </p>
                        
                        <div style={{ 
                            background: '#fff', 
                            padding: '16px', 
                            borderRadius: '16px',
                            display: 'inline-block',
                            width: '100%',
                            maxWidth: '1000px',
                            margin: '0 auto'
                        }}>
                            <img 
                                src="/mindmap.png" 
                                alt="AI Search Optimization Strategy Map" 
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

