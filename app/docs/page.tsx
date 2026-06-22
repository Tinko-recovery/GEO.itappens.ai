import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation & Guide | itappens.ai',
  description: 'Complete FAQ and Documentation for the Weaponized GEO Audit. Learn how to optimize for Answer Engines like Perplexity and ChatGPT.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-purple-900/50 selection:text-white">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              itappens.ai
            </span>
            <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
              Docs
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/#audit" className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
              Run Audit
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Getting Started</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#what-is-geo" className="text-gray-400 hover:text-white transition-colors block py-1">What is Weaponized GEO?</a></li>
                <li><a href="#citation-gravity" className="text-gray-400 hover:text-white transition-colors block py-1">Citation Gravity Explained</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Using The Tool</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#running-audit" className="text-gray-400 hover:text-white transition-colors block py-1">Running an Audit</a></li>
                <li><a href="#payment-concierge" className="text-gray-400 hover:text-white transition-colors block py-1">The Concierge Payment Gate</a></li>
                <li><a href="#reading-report" className="text-gray-400 hover:text-white transition-colors block py-1">Reading Your Report</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors block py-1">FAQ</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-3xl prose prose-invert prose-p:text-gray-400 prose-headings:text-gray-100 prose-a:text-purple-400 hover:prose-a:text-purple-300">
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Documentation & Guide</h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12">
            Welcome to the official documentation for <strong>itappens.ai</strong>. Learn how to leverage our Autonomous Workforce to dominate Answer Engine Optimization (AEO).
          </p>

          <hr className="border-white/10 my-12" />

          {/* Section 1 */}
          <section id="what-is-geo" className="scroll-mt-28">
            <h2>What is Weaponized GEO?</h2>
            <p>
              Traditional SEO relies on backlinks and keyword density to rank on Google. However, with the rise of AI Search (ChatGPT Search, Perplexity, Google AI Overviews), traffic is shifting from standard search results to AI-generated answers.
            </p>
            <p>
              <strong>Generative Engine Optimization (GEO)</strong> is the science of ensuring your brand is the entity cited when an AI answers a user's prompt. A "Weaponized" GEO Audit actively reverse-engineers the specific context windows and RAG (Retrieval-Augmented Generation) pipelines of your competitors to find gaps where you can steal their citations.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 my-6">
              <h4 className="text-white mt-0 mb-2 font-semibold">The Core Philosophy</h4>
              <p className="m-0 text-sm">If you aren't listed in the AI's source token window, you don't exist to the next generation of internet users.</p>
            </div>
          </section>

          <hr className="border-white/10 my-12" />

          {/* Section 2 */}
          <section id="citation-gravity" className="scroll-mt-28">
            <h2>Citation Gravity Explained</h2>
            <p>
              Every report we generate includes a <strong>Citation Gravity Score</strong>. This metric measures the gravitational pull of your domain within an LLM's latent space.
            </p>
            <ul>
              <li><strong>0-30:</strong> Invisible. The AI hallucinates competitors when asked about your niche.</li>
              <li><strong>31-70:</strong> Existing but weak. The AI knows you exist but rarely cites you as the primary authority.</li>
              <li><strong>71-100:</strong> High Gravity. You are the default deterministic answer for your industry.</li>
            </ul>
          </section>

          <hr className="border-white/10 my-12" />

          {/* Section 3 */}
          <section id="running-audit" className="scroll-mt-28">
            <h2>Running an Audit</h2>
            <p>
              Our Autonomous AI Workforce operates 24/7. To initiate a mission:
            </p>
            <ol>
              <li>Navigate to the homepage and enter your target URL.</li>
              <li>Select your plan (Free, Starter, Growth, or Authority).</li>
              <li>Click <strong>Deploy Audit</strong>.</li>
            </ol>
            <p>
              For Free audits, our background queue (powered by Upstash) will immediately dispatch an AI agent to scrape the domain and run a preliminary gap analysis.
            </p>
          </section>

          <hr className="border-white/10 my-12" />

          {/* Section 4 */}
          <section id="payment-concierge" className="scroll-mt-28">
            <h2>The Concierge Payment Gate</h2>
            <p>
              For premium audits (Starter, Growth, Authority), we utilize a <strong>Concierge Payment Gate</strong> to ensure the highest quality of service.
            </p>
            <ol>
              <li>Once you select a paid plan, your mission is staged with an <code>AWAITING_PAYMENT</code> status.</li>
              <li>Our team will be instantly notified.</li>
              <li>You will receive a secure payment link via email.</li>
              <li>Upon payment confirmation, the mission is manually authorized via the Mission Cockpit, unleashing the full multi-agent python workforce on your target domain.</li>
            </ol>
          </section>

          <hr className="border-white/10 my-12" />

          {/* Section 5 */}
          <section id="faq" className="scroll-mt-28">
            <h2>Frequently Asked Questions (FAQ)</h2>
            
            <div className="space-y-6 mt-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">How long does an audit take?</h4>
                <p className="text-sm text-gray-400">Free audits take roughly 2-3 minutes as they are processed in our background queue. Premium audits involve our multi-agent framework running exhaustive Playwright scripts and Gemini analysis, which typically takes 15-30 minutes after payment authorization.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Do you use ChatGPT or Claude?</h4>
                <p className="text-sm text-gray-400">Our core orchestration engine (Zenith) and our worker agents are powered by Google's Gemini 1.5 Pro and Gemini 1.5 Flash models, ensuring massive 1M+ token context windows for deep competitor scraping.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Can I automate this process?</h4>
                <p className="text-sm text-gray-400">Yes. Enterprise clients can access our API to programmatically trigger audits directly from their CRM.</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Why is it called an "Autonomous Workforce"?</h4>
                <p className="text-sm text-gray-400">Because we don't just sell software. Our backend is a CrewAI framework consisting of a CEO Agent, Engineering Team, and Marketing Team. When you purchase an Authority plan, you are literally renting our AI employees to execute a sprint on your behalf.</p>
              </div>
            </div>
          </section>

        </main>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} itappens.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
