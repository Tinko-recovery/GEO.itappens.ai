'use client';
import { motion } from 'framer-motion';

const pillars = [
    {
        num: '01',
        title: 'Answer Engine Optimization (AEO)',
        body: 'Dominate ChatGPT, Perplexity, and Gemini. We build the technical infrastructure and semantic relevance required to make your brand the primary retrieved entity.',
        tag: 'Visibility'
    },
    {
        num: '02',
        title: 'AI Automation Services',
        body: 'Replace manual workflows with autonomous agents. From customer support to data extraction, we build custom AI systems that run 24/7.',
        tag: 'Efficiency'
    },
    {
        num: '03',
        title: 'Content Creation at Scale',
        body: 'Programmatic, high-quality content generation that matches buyer intent. We build topical authority hubs designed specifically for LLM ingestion.',
        tag: 'Authority'
    },
    {
        num: '04',
        title: 'Outbound Lead Generation',
        body: 'Audit-driven outreach. Our lead generation engine identifies high-intent targets, runs automated audits, and deploys hyper-personalized sequences.',
        tag: 'Growth'
    }
];

export default function SolutionSection() {
    return (
        <section id="solutions" style={{ padding: '120px 0', backgroundColor: 'var(--light-bg)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span className="badge-pill" style={{ marginBottom: '24px' }}>4 Pillars of Growth</span>
                    <h2 className="headline-lg">Everything you need to <br /> <span style={{ color: 'var(--blue)' }}>Scale with AI.</span></h2>
                </div>

                <div className="grid-2col" style={{ marginBottom: '80px' }}>
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="card-bento"
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--blue)', opacity: 0.2 }}>{p.num}</span>
                                <span className="badge-pill">{p.tag}</span>
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--navy)' }}>{p.title}</h3>
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
                            margin: '0 auto',
                            position: 'relative'
                        }}>
                            {/* Obfuscation Container */}
                            <div style={{ 
                                position: 'relative',
                                maxHeight: '400px', 
                                overflow: 'hidden',
                                borderRadius: '8px'
                            }}>
                                <img 
                                    src="/mindmap.png" 
                                    alt="AI Search Optimization Strategy Map" 
                                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                                />
                                
                                {/* Fade to white / blur overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0, left: 0, right: 0,
                                    height: '250px',
                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 60%, rgba(255,255,255,1) 100%)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingBottom: '40px',
                                    zIndex: 10
                                }}>
                                    <h4 style={{ color: 'var(--slate-dark)', fontSize: '20px', marginBottom: '16px', fontWeight: 700 }}>Want to see the exact execution plan?</h4>
                                    <a href="/audit" className="btn-blue" style={{ padding: '16px 32px', fontSize: '16px', boxShadow: '0 10px 25px rgba(27, 79, 222, 0.3)' }}>
                                        Unlock the Full Roadmap
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

