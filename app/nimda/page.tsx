"use client";

import { useState } from "react";
import { searchApolloLeads, SearchParams, Lead } from "./actions";

export default function LeadGenDashboard() {
  const [params, setParams] = useState<SearchParams>({
    person_titles: "",
    organisation_keywords: "",
    organisation_localities: "",
    q_organization_domains: "",
  });
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchApolloLeads(params);
      if (!result) {
        throw new Error("Version Mismatch: Please hard-refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) to load the newly deployed code.");
      }
      if (result.error) {
        setError(result.error);
      } else {
        setLeads(result.leads || []);
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="border-b border-cyan-500/20 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            NIMDA Engine
          </h1>
          <p className="text-sm text-cyan-200/60 mt-2 tracking-widest uppercase">
            Restricted Access: Apollo Lead Generation
          </p>
        </header>

        {/* Search Form */}
        <div className="bg-[#0B1221] border border-cyan-900/50 rounded-xl p-6 shadow-2xl shadow-cyan-900/20">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-cyan-50">
            <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Target Query Parameters
          </h2>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Job Titles (comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g. CMO, VP of Marketing"
                className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                value={params.person_titles}
                onChange={(e) => setParams({...params, person_titles: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Keywords (comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g. AI, SaaS, Enterprise"
                className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                value={params.organisation_keywords}
                onChange={(e) => setParams({...params, organisation_keywords: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Locations (comma-separated)</label>
              <input 
                type="text" 
                placeholder="e.g. San Francisco, New York"
                className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                value={params.organisation_localities}
                onChange={(e) => setParams({...params, organisation_localities: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">Target Domain</label>
              <input 
                type="text" 
                placeholder="e.g. openai.com"
                className="w-full bg-[#050B14] border border-cyan-800/60 rounded-lg px-4 py-2.5 text-sm text-cyan-100 placeholder:text-cyan-800/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                value={params.q_organization_domains}
                onChange={(e) => setParams({...params, q_organization_domains: e.target.value})}
              />
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-between pt-4 border-t border-cyan-900/30">
              <div className="text-sm text-red-400 font-medium">{error}</div>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing Search...
                  </>
                ) : (
                  "Execute Search"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Table */}
        {leads.length > 0 && (
          <div className="bg-[#0B1221] border border-cyan-900/50 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-cyan-900/50 flex justify-between items-center bg-[#070D18]">
              <h2 className="text-lg font-semibold text-cyan-100">
                Acquired Leads ({leads.length})
              </h2>
              <button className="text-xs px-4 py-2 border border-cyan-700/50 rounded-md hover:bg-cyan-900/30 text-cyan-300 transition-colors">
                Export Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#050B14] border-b border-cyan-900/50 text-xs uppercase tracking-wider text-cyan-400/70">
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium text-right">Intel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/20">
                  {leads.map((lead, idx) => (
                    <tr key={lead.id || idx} className="hover:bg-cyan-900/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-cyan-50">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-cyan-200/80">{lead.title}</td>
                      <td className="px-6 py-4 text-sm text-cyan-200/80">{lead.company}</td>
                      <td className="px-6 py-4">
                        {lead.email ? (
                          <span className="text-sm font-mono text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-800/50">
                            {lead.email}
                          </span>
                        ) : (
                          <span className="text-sm text-cyan-700 font-mono italic">unavailable</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {lead.linkedin_url ? (
                          <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-300 text-sm font-medium">
                            LinkedIn ↗
                          </a>
                        ) : (
                          <span className="text-cyan-800/50 text-sm">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
