'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SearchHeroSection() {
  const [domain, setDomain] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsProbing(true);
    
    // Simulate LLM Probing Delay
    setTimeout(() => {
      router.push(`/dashboard?domain=${encodeURIComponent(domain)}`);
    }, 3500);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-bg border-b border-border">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-brand-blue text-sm font-medium mb-6">
            Phase 1: Generative Engine Optimization
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text mb-6">
            Become the Default Answer across <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">AI Engines.</span>
          </h1>
          <p className="text-xl text-text-dim mb-10 max-w-2xl mx-auto">
            Audit your brand's visibility on ChatGPT, Perplexity, and Claude instantly. Find gaps, inject semantics, and dominate the new search era.
          </p>

          {!isProbing ? (
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-yellow rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-surface p-2 rounded-lg border border-border shadow-xl">
                <div className="pl-4 text-text-dim">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter your domain (e.g. yourbrand.com)"
                  className="w-full bg-transparent border-none px-4 py-4 text-lg text-text focus:outline-none focus:ring-0 placeholder-gray-500"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-brand-blue hover:bg-blue-600 text-bg px-8 py-4 rounded-md font-bold text-lg transition-colors whitespace-nowrap"
                >
                  Analyze Visibility
                </button>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto bg-surface p-8 rounded-lg border border-border shadow-xl"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-brand-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <h3 className="text-xl font-semibold text-text animate-pulse">Probing LLMs...</h3>
                <p className="text-sm text-text-dim">Fetching live citations from ChatGPT, Claude, and Perplexity for {domain}</p>
                
                <div className="w-full bg-bg h-2 rounded-full mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-green"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
