'use client';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

const problems = [
    {
        title: "Citation Blindness",
        description: "Your brand is mentioned, but not cited. AI engines synthesize your knowledge without giving you credit, killing your downstream conversion.",
        icon: "🚫"
    },
    {
        title: "Entity Confusion",
        description: "AI crawlers see conflicting data across your site and socials. They default to the most 'consistent' answer, even if it's incorrect or outdated.",
        icon: "🕵️"
    },
    {
        title: "Competitor Capture",
        description: "Your competitors are already optimizing for LLM retrieval. If they own the citation layer, they own your market's trust by default.",
        icon: "📉"
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
                        <span className="badge-pill" style={{ marginBottom: '24px' }}>The Core Challenge</span>
                        <h2 className="headline-lg">Traditional SEO is no longer enough.</h2>
                        <p className="text-large" style={{ marginBottom: '48px' }}>
                            Google is becoming an answer engine. ChatGPT and Perplexity are becoming the first touchpoint. If your brand isn't structured for <strong>Agentic Retrieval</strong>, you're invisible.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {problems.map((p, i) => (
                                <motion.div 
                                    key={i} 
                                    className="card-corporate"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{ padding: '24px', display: 'flex', gap: '20px' }}
                                >
                                    <div style={{ fontSize: '32px' }}>{p.icon}</div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{p.title}</h3>
                                        <p style={{ color: 'var(--slate)', lineHeight: 1.6, fontSize: '15px' }}>{p.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: The Explainer Video */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'sticky', top: '120px' }}
                    >
                        <VideoPlayer 
                            videoSrc="/videos/explainer.mp4"
                            thumbnailSrc="/poster.png"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
