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

                {/* Mind Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-brand-text rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl"
                >
                    {/* Glowing effect inside the dark container */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-2/5 bg-brand-primary filter blur-[100px] opacity-20 z-0" />

                    <div className="relative z-10 text-center">
                        <h3 className="text-white text-3xl font-bold mb-4">The Complete Strategy Map</h3>
                        <p className="text-white/70 mb-10 max-w-2xl mx-auto text-lg">
                            A top-down view of our entire optimization architecture—from foundational entity definitions to off-site citation building.
                        </p>
                        
                        <div className="bg-white p-4 rounded-2xl inline-block w-full max-w-4xl mx-auto relative">
                            {/* Obfuscation Container */}
                            <div className="relative max-h-[400px] overflow-hidden rounded-xl border border-brand-border">
                                <img 
                                    src="/mindmap.png" 
                                    alt="AI Search Optimization Strategy Map" 
                                    className="w-full h-auto block"
                                />
                                
                                {/* Fade to white / blur overlay */}
                                <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-b from-white/0 via-white/90 to-white backdrop-blur-[4px] flex flex-col items-center justify-end pb-10 z-10">
                                    <h4 className="text-brand-text text-xl mb-6 font-bold">Want to see the exact execution plan?</h4>
                                    <a href="/audit" className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_25px_rgba(139,92,246,0.3)] transition-colors">
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
