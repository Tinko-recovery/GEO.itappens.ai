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
        title: 'Generative Engine Optimization (GEO)',
        body: 'Structure your domain for LLM ingestion. We optimize your website architecture, schema, and content to align with agentic search algorithms.',
        tag: 'Technical'
    },
    {
        num: '03',
        title: 'AI Content Clusters',
        body: 'Programmatic, high-quality content generation that matches buyer intent. We build topical authority hubs designed specifically for LLM ingestion.',
        tag: 'Authority'
    },
    {
        num: '04',
        title: 'Citation Authority Building',
        body: 'Secure high-quality mentions and links from authoritative domains that are already trusted and cited by AI engines like ChatGPT and Perplexity.',
        tag: 'Growth'
    }
];

export default function SolutionSection() {
    return (
        <section id="solutions" className="py-24 md:py-32 bg-brand-bg-muted">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full uppercase tracking-wider">
                        4 Pillars of Growth
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-text">
                        Everything you need to <br /> <span className="text-brand-primary">Scale in Agentic Search.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {pillars.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white border border-brand-border rounded-2xl p-8 flex flex-col gap-5 h-full shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-4xl font-black text-brand-primary opacity-20">{p.num}</span>
                                <span className="px-3 py-1 text-xs font-bold text-brand-primary bg-brand-primary/10 rounded-full uppercase tracking-widest">{p.tag}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-brand-text">{p.title}</h3>
                            <p className="text-brand-text-muted leading-relaxed text-lg">
                                {p.body}
                            </p>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
}
