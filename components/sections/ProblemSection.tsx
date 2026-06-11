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

                    {/* Right Column: Interactive UI Mockup */}
                    <div className="md:w-1/2 w-full mt-12 md:mt-0 relative lg:pl-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-blue-400/20 blur-3xl -z-10 rounded-full" />
                        
                        <motion.div 
                            className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Window Header */}
                            <div className="bg-zinc-50 border-b border-brand-border px-6 py-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="bg-white border border-brand-border text-xs text-brand-text-muted font-medium px-4 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                    AI Answer Engine
                                </div>
                                <div className="w-10" /> {/* spacer for balance */}
                            </div>
                            
                            {/* Chat Body */}
                            <div className="p-6 md:p-8 space-y-6">
                                {/* User Prompt */}
                                <motion.div 
                                    className="flex justify-end"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="bg-zinc-100 text-brand-text px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-[15px] font-medium shadow-sm">
                                        What is the best enterprise software for our team?
                                    </div>
                                </motion.div>

                                {/* AI Response */}
                                <motion.div 
                                    className="flex justify-start"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="bg-brand-primary/5 border border-brand-primary/20 text-brand-text px-6 py-5 rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-6 h-6 rounded-sm bg-brand-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                AI
                                            </div>
                                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Synthesizing Data...</span>
                                        </div>
                                        <p className="text-[15px] leading-relaxed mb-4">
                                            Based on top industry citations, documentation, and expert sentiment, the leading choices are:
                                        </p>
                                        <ul className="space-y-3 mb-4">
                                            <li className="flex items-start gap-2 text-[15px]">
                                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                                <span><strong>Competitor A</strong> — Highly cited for enterprise security.</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-[15px]">
                                                <span className="text-green-500 mt-0.5 font-bold">✓</span>
                                                <span><strong>Competitor B</strong> — Mentioned in 42 recent industry benchmarks.</span>
                                            </li>
                                        </ul>
                                        
                                        <motion.div 
                                            className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl relative overflow-hidden"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 2.2, type: "spring" }}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                                            <p className="text-sm font-medium text-red-900">
                                                <span className="font-bold block mb-1">Your Brand: 0 Citations</span>
                                                Missing from the generative layer. No structured entities found to recommend.
                                            </p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
