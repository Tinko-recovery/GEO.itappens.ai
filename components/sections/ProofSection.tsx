'use client';
import { motion } from 'framer-motion';

const rows = [
    {
        metric: 'Visibility Model',
        old: 'Google SERP — declining CTR for info queries',
        new: 'Primary Citation — named directly in AI responses'
    },
    {
        metric: 'Trust Signal',
        old: 'Ranked listing — one of many results',
        new: 'Institutional Authority — AI-endorsed recommendations'
    },
    {
        metric: 'Core Logic',
        old: 'Keyword density and backlinks',
        new: 'Semantic entity + information density'
    },
    {
        metric: 'Market Saturation',
        old: 'Millions of competing domains on Google',
        new: 'Under 1,000 GEO-optimized SaaS brands globally'
    },
    {
        metric: 'Asset Compounding',
        old: 'Rankings fluctuate with algorithm updates',
        new: 'Entity citations compound as LLMs retrain'
    }
];

export default function ProofSection() {
    return (
        <section id="proof" className="py-24 md:py-32 bg-brand-bg-muted">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-20">
                    <div>
                        <span className="inline-block px-4 py-1 mb-6 text-sm font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 rounded-full uppercase tracking-wider">
                            The Evidence
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-8">
                            Traditional Marketing is failing the AI era.
                        </h2>
                        <p className="text-xl text-brand-text-muted leading-relaxed">
                            itappens.ai transitions your brand from traditional "ranking" to institutional "citation". We ensure you are the verified primary source for your industry.
                        </p>
                    </div>
                    <div className="border-l-4 border-brand-primary pl-8">
                        <p className="text-xl md:text-2xl font-light text-brand-text leading-relaxed">
                            "GEO is not just rebranded SEO. It is a new discipline built for how Agentic systems retrieve, synthesize, and cite information."
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-brand-bg-muted border-b border-brand-border">
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-brand-text-muted">Metric</th>
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-brand-text-muted">Legacy Marketing</th>
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-brand-primary">itappens.ai System</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-brand-border last:border-0 hover:bg-brand-bg-muted/50 transition-colors">
                                        <td className="p-6 font-semibold text-brand-text whitespace-nowrap">{row.metric}</td>
                                        <td className="p-6 text-brand-text-muted">{row.old}</td>
                                        <td className="p-6 font-bold text-brand-primary">{row.new}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
