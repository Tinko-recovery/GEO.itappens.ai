'use client';
import { motion } from 'framer-motion';

const problems = [
    {
        title: "Invisible to AI Engines",
        description: "ChatGPT and Perplexity synthesize your market, but your brand isn't cited. Without semantic infrastructure, your authority is lost to the LLM.",
        icon: "🕵️"
    },
    {
        title: "Fragmented Tooling",
        description: "You're paying for separate tools for lead gen, content creation, and SEO. Data is siloed, and execution is slow and expensive.",
        icon: "🧩"
    },
    {
        title: "Manual Growth Workflows",
        description: "Your team is wasting hours on manual research, outbound emails, and content formatting instead of closing deals. You need autonomous agents.",
        icon: "⏳"
    }
];

export default function ProblemSection() {
    return (
        <section id="problem" style={{ padding: '120px 0', backgroundColor: '#fff', position: 'relative' }}>
            {/* Subtle background element */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(27, 79, 222, 0.03))', zIndex: 0 }} />
            
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="grid-2col" style={{ alignItems: 'flex-start' }}>
                    
                    {/* Left Column: The Problem Text */}
                    <div>
                        <span className="badge-pill" style={{ marginBottom: '24px' }}>The Growth Bottleneck</span>
                        <h2 className="headline-lg">Fragmented tools are killing your scale.</h2>
                        <p className="text-large" style={{ marginBottom: '48px', fontSize: '18px', lineHeight: 1.6 }}>
                            Scaling a B2B SaaS is harder than ever. You have one agency for SEO, another software for outbound, and manual workflows holding your team back. It's time to unify your growth engine.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {problems.map((p, i) => (
                                <motion.div 
                                    key={i} 
                                    className="card-bento"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{ padding: '24px', display: 'flex', gap: '20px' }}
                                >
                                    <div style={{ fontSize: '32px' }}>{p.icon}</div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--navy)' }}>{p.title}</h3>
                                        <p style={{ color: 'var(--slate)', lineHeight: 1.6, fontSize: '15px' }}>{p.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: The AEO Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'sticky', top: '120px' }}
                    >
                        <div style={{ 
                            borderRadius: '16px', 
                            overflow: 'hidden', 
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            border: '1px solid var(--border)',
                            background: '#fff'
                        }}>
                            <img 
                                src="/poster.png" 
                                alt="The New Rules of AI Search Optimization (AEO)" 
                                style={{ width: '100%', height: 'auto', display: 'block' }} 
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
