'use client';
import { motion } from 'framer-motion';

const problems = [
    {
        title: "Invisible to AI Engines",
        description: "ChatGPT and Perplexity synthesize your market, but your brand isn't cited. Without semantic infrastructure, your authority is lost to the LLM.",
        icon: "🕵️"
    },
    {
        title: "Lost Organic Traffic",
        description: "Traditional SEO is losing ground to AI-generated answers. If you aren't optimizing for generative engines, you're missing the highest intent traffic.",
        icon: "📉"
    },
    {
        title: "Fragmented Entity Data",
        description: "Your brand information is scattered. AI models can't confidently extract a single source of truth about your services, leading to zero citations.",
        icon: "🧩"
    }
];

export default function ProblemSection() {
    return (
        <section id="problem" className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-brand-primary/5 to-transparent z-0" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                    
                    {/* Left Column: The Problem Text */}
                    <div className="md:w-1/2">
                        <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full uppercase tracking-wider">
                            The Growth Bottleneck
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-6">
                            Traditional SEO is losing to AI Answers.
                        </h2>
                        <p className="text-xl text-brand-text-muted mb-12 leading-relaxed">
                            Scaling a B2B SaaS is harder than ever. Buyers are skipping traditional search and asking ChatGPT, Perplexity, and Claude for recommendations. If you aren't optimizing for these engines, you simply don't exist.
                        </p>

                        <div className="flex flex-col gap-6">
                            {problems.map((p, i) => (
                                <motion.div 
                                    key={i} 
                                    className="bg-white border border-brand-border rounded-2xl p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="text-3xl">{p.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-text mb-2">{p.title}</h3>
                                        <p className="text-brand-text-muted leading-relaxed text-[15px]">{p.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column removed based on user request */}
                </div>
            </div>
        </section>
    );
}
