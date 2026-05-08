'use client';
import { motion } from 'framer-motion';

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
        <section id="problem" style={{ padding: '120px 0', backgroundColor: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
                    <span className="badge-pill" style={{ marginBottom: '24px' }}>The Core Challenge</span>
                    <h2 className="headline-lg">Traditional SEO is no longer enough.</h2>
                    <p className="text-large">
                        Google is becoming an answer engine. ChatGPT and Perplexity are becoming the first touchpoint. If your brand isn't structured for <strong>Agentic Retrieval</strong>, you're invisible.
                    </p>
                </div>

                <div className="bento-grid">
                    {problems.map((p, i) => (
                        <motion.div 
                            key={i} 
                            className="card-corporate"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div style={{ fontSize: '40px', marginBottom: '24px' }}>{p.icon}</div>
                            <h3 style={{ fontSize: '22px', marginBottom: '16px' }}>{p.title}</h3>
                            <p style={{ color: 'var(--slate)', lineHeight: 1.7 }}>{p.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
