'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AuditWidget from '@/components/dashboard/widgets/AuditWidget';
import ComparisonChart from '@/components/dashboard/widgets/ComparisonChart';
import SemanticAnchorGenerator from '@/components/dashboard/widgets/SemanticAnchorGenerator';
import LLMProofWidget from '@/components/dashboard/widgets/LLMProofWidget';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get('domain') || 'yourbrand.com';
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock form submission to our new Universal Lead API
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Dashboard Visitor',
          email: email,
          company: domain,
          source: 'gated_dashboard',
        })
      });
      
      // Simulate delay for UX
      setTimeout(() => {
        setIsUnlocked(true);
        setSubmitted(true);
        setIsLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Visibility Dashboard: {domain}</h1>
        <p className="text-gray-500 text-sm mt-1">Data snapshot generated from recent LLM queries across ChatGPT, Claude, and Perplexity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 h-64">
          <AuditWidget />
        </div>
        <div className="lg:col-span-2 h-64">
          <ComparisonChart />
        </div>
      </div>

      {/* The Gated Section */}
      <div className="relative mt-6">
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center rounded-lg border border-gray-200">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-[#3abeF9] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock the Full Threat Report</h2>
              <p className="text-sm text-gray-500 mb-6">See exactly what the AI engines are saying about you vs. your competitors, and get the Semantic Schema to fix it.</p>
              
              <form onSubmit={handleUnlock} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your work email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3abeF9] focus:border-transparent text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#3abeF9] hover:bg-blue-500 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Unlocking...' : 'Unlock Full Data (Free)'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4">We will send a copy of the report to your inbox. No spam.</p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!isUnlocked ? 'opacity-40 select-none pointer-events-none' : ''}`}>
          <div className="h-80">
            <LLMProofWidget />
          </div>
          <div className="h-80">
            <SemanticAnchorGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}
