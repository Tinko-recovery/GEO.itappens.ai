import React from 'react';
import Link from 'next/link';
import { Bot, Image as ImageIcon, CalendarClock, Zap, ShoppingCart, Globe, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'itappens AEO | The Answer Engine Optimization Auto-Blogger',
  description: 'Fully automated, deeply researched content pipelines that publish directly to your WordPress.',
};

export default function AeoLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">itappens <span className="text-indigo-400">AEO</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="/api/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link href="/api/auth/login" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-indigo-500 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Powered by Claude 3.5 Haiku + Unsplash
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Answer Engine Optimization <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              On Autopilot.
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            itappens AEO autonomously researches, writes, illustrates, and drip-publishes deep-dive SEO/AEO articles directly to your WordPress. Designed for maximum scale and extreme cost-efficiency.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/api/auth/login" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-0.5">
              Start Your Free Trial
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl transition-all">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Trust Bar */}
      <section className="border-y border-slate-800/60 bg-slate-900/20 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">98%</div>
              <div className="text-sm text-slate-400 font-medium">Publish Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">$0.02</div>
              <div className="text-sm text-slate-400 font-medium">Avg Cost Per Article</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">30+</div>
              <div className="text-sm text-slate-400 font-medium">Topics Planned Instantly</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">Zero</div>
              <div className="text-sm text-slate-400 font-medium">Human Intervention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need for <br/>automated dominance.</h2>
            <p className="text-lg text-slate-400">From AI keyword planning to final WordPress publication.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Article Writing</h3>
              <p className="text-slate-400 leading-relaxed">Claude 3.5 Haiku generates structurally perfect, 2000+ word AEO articles optimized for both Google and Perplexity.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <ImageIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Cost Imagery</h3>
              <p className="text-slate-400 leading-relaxed">Autonomous Unsplash integration fetches and inserts highly relevant, royalty-free photography without eating into your margins.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direct WP Integration</h3>
              <p className="text-slate-400 leading-relaxed">Securely connects to your WordPress REST API to upload images directly to the Media Library and publish the post.</p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <CalendarClock className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Drip Scheduler</h3>
              <p className="text-slate-400 leading-relaxed">Queue up 30 articles and let our Upstash QStash cron workers drip-feed them to your blog at optimal intervals.</p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Keyword Planner</h3>
              <p className="text-slate-400 leading-relaxed">Enter a seed keyword and let AI instantly map out a 30-day topical cluster strategy. 1-click approve into your queue.</p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-slate-900/40 border border-indigo-500/30 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-indigo-600 text-[10px] font-bold px-3 py-1 rounded-bl-lg">GAME CHANGER</div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">E-Commerce Injector</h3>
              <p className="text-slate-400 leading-relaxed">Paste your Shopify/Woo product link. The AI naturally weaves your product as the ultimate solution inside the educational article.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900/20 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Pricing that respects your margins.</h2>
            <p className="text-lg text-slate-400">Pay for credits, not seats. Unused credits roll over.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-white mb-2">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-400 text-sm mb-6 border-b border-slate-800 pb-6">Perfect for solo bloggers.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 1,000 Credits/mo</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 1 WordPress Site</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Auto Scheduling</li>
              </ul>
              <Link href="/api/auth/login" className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-center font-semibold transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* Growth (Popular) */}
            <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(79,70,229,0.15)] transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">Growth</h3>
              <div className="text-4xl font-extrabold text-white mb-2">$69<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-400 text-sm mb-6 border-b border-slate-800 pb-6">For serious content operations.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 2,500 Credits/mo</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Up to 5 WordPress Sites</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> E-Commerce Injector</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> AI Keyword Planner</li>
              </ul>
              <Link href="/api/auth/login" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-center font-semibold text-white transition-colors">
                Get Started
              </Link>
            </div>

            {/* Agency */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Agency</h3>
              <div className="text-4xl font-extrabold text-white mb-2">$159<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-slate-400 text-sm mb-6 border-b border-slate-800 pb-6">Manage multiple client portfolios.</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 6,000 Credits/mo</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Unlimited WordPress Sites</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Dedicated Account Manager</li>
              </ul>
              <Link href="/api/auth/login" className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-center font-semibold transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Real results. Real revenue.</h2>
            <p className="text-lg text-slate-400">Join agencies like NewKRINN's Verdict in dominating search.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
              <div className="text-amber-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 leading-relaxed mb-6">"Our spine clinic now gets 2-3 new patient inquiries every week purely from organic search. The AEO engine transformed our online presence completely while costing us pennies compared to our old agency."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-300 font-bold">NK</div>
                <div>
                  <div className="font-bold text-white">NewKRINN's Verdict</div>
                  <div className="text-sm text-slate-400">SEO Agency</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
              <div className="text-amber-400 mb-4 text-xl">★★★★★</div>
              <p className="text-slate-300 leading-relaxed mb-6">"Just add domain, connect WordPress — it does the rest. We added our Shopify product links and it writes content that actually converts readers into buyers. Organic bookings increased 50% in just 4 months."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-emerald-300 font-bold">PB</div>
                <div>
                  <div className="font-bold text-white">PackUrBags</div>
                  <div className="text-sm text-slate-400">E-Commerce Retailer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-slate-600" />
            <span className="text-lg font-bold text-slate-400 tracking-tight">itappens <span className="text-slate-500">AEO</span></span>
          </div>
          <div className="text-sm text-slate-500">
            © 2026 itappens.ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
