'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ListTodo, Settings, Loader2, Plus, ArrowRight, BarChart3, Save } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'analytics' | 'planner' | 'queue' | 'sites';

export default function SocialDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [engineActive, setEngineActive] = useState(false);
  const [checking, setChecking] = useState(true);

  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTopics, setGeneratedTopics] = useState<any[]>([]);
  const [isQueueingAll, setIsQueueingAll] = useState(false);
  
  const [articles, setArticles] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Settings editing state
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [siteForm, setSiteForm] = useState({ toneOfVoice: '', targetAudience: '', formattingRules: '' });

  const fetchData = async () => {
    try {
      const [sitesRes, articlesRes, creditsRes, analyticsRes] = await Promise.all([
        fetch('/api/aeo/sites'),
        fetch('/api/aeo/articles'),
        fetch('/api/aeo/credits'),
        fetch('/api/aeo/analytics')
      ]);

      if (sitesRes.ok) setSites(await sitesRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (creditsRes.ok) {
        const cData = await creditsRes.json();
        setCredits(cData.balance);
      }
      if (analyticsRes.ok) setAnalyticsData(await analyticsRes.json());
      
      setEngineActive(true);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnectSite = async () => {
    const url = prompt("Enter WordPress Site URL:");
    if (!url) return;
    const appUser = prompt("Enter WordPress Application Username:");
    if (!appUser) return;
    const appToken = prompt("Enter WordPress Application Password (we encrypt this):");
    if (!appToken) return;

    try {
      const res = await fetch('/api/aeo/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, appUser, appToken })
      });
      if (res.ok) {
        const newSite = await res.json();
        setSites([newSite, ...sites]);
      } else {
        alert("Failed to connect site.");
      }
    } catch (e) {
      alert("Error connecting site.");
    }
  };

  const handleGeneratePlanner = async () => {
    if (!topic.trim()) {
      alert("Please enter a seed keyword.");
      return;
    }
    
    setIsGenerating(true);
    setGeneratedTopics([]);
    try {
      const res = await fetch('/api/aeo/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedKeyword: topic })
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedTopics(data.topics);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to generate topics");
      }
    } catch (e) {
      console.error("Error generating topics", e);
      alert("An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQueueAll = async () => {
    if (sites.length === 0) {
      alert("Please connect a WordPress site first.");
      setActiveTab('sites');
      return;
    }
    if (generatedTopics.length === 0) return;

    setIsQueueingAll(true);
    const queuedArticles = [];
    let currentCredits = credits || 0;

    for (const t of generatedTopics) {
      if (currentCredits <= 0) {
        alert("Insufficient credits to queue all articles.");
        break;
      }
      try {
        const res = await fetch('/api/aeo/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: t.title, siteId: sites[0].id })
        });
        if (res.ok) {
          const newArt = await res.json();
          queuedArticles.push(newArt);
          currentCredits -= 1;
        }
      } catch (e) {
        console.error("Failed to queue topic", t.title);
      }
    }

    setArticles([...queuedArticles, ...articles]);
    setCredits(currentCredits);
    setGeneratedTopics([]);
    setTopic("");
    setIsQueueingAll(false);
    setActiveTab('queue');
  };

  const handleQueueSingle = async (topicTitle: string) => {
    if (sites.length === 0) {
      alert("Please connect a WordPress site first.");
      return;
    }
    try {
      const res = await fetch('/api/aeo/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, siteId: sites[0].id })
      });
      if (res.ok) {
        const newArt = await res.json();
        setArticles([newArt, ...articles]);
        if (credits !== null) setCredits(credits - 1);
        setGeneratedTopics(prev => prev.filter(t => t.title !== topicTitle));
      } else {
        alert("Failed to queue article");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleSaveSettings = async (id: string) => {
    try {
      const res = await fetch('/api/aeo/sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...siteForm })
      });
      if (res.ok) {
        setSites(sites.map(s => s.id === id ? { ...s, ...siteForm } : s));
        setEditingSiteId(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">itappens <span className="text-indigo-400">AEO</span></h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={checking ? "" : engineActive ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" : "absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${checking ? 'bg-slate-500' : engineActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </span>
              {checking ? 'Connecting...' : engineActive ? 'Engine Online' : 'Engine Offline'}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-3 flex items-center gap-4">
            <div className="text-slate-400 text-sm">Available Credits</div>
            <div className="text-2xl font-bold text-indigo-400">{credits !== null ? credits : '-'}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-px overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart3 className="w-4 h-4" />
            Performance
          </button>
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === 'planner' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Bot className="w-4 h-4" />
            Keyword Planner
          </button>
          <button 
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === 'queue' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <ListTodo className="w-4 h-4" />
            Article Queue ({articles.length})
          </button>
          <button 
            onClick={() => setActiveTab('sites')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${activeTab === 'sites' ? 'border-indigo-500 text-indigo-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <Settings className="w-4 h-4" />
            Connected Sites ({sites.length})
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="text-slate-400 text-sm mb-1">Total Published</div>
                  <div className="text-4xl font-extrabold text-white">{analyticsData?.statusCounts?.PUBLISHED || 0}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="text-slate-400 text-sm mb-1">In Queue / Generating</div>
                  <div className="text-4xl font-extrabold text-white">{(analyticsData?.statusCounts?.PENDING || 0) + (analyticsData?.statusCounts?.GENERATING || 0)}</div>
                </div>
                <div className="bg-indigo-600/20 border border-indigo-500/50 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-bl">ESTIMATED</div>
                  <div className="text-indigo-300 text-sm mb-1">Organic Traffic Value</div>
                  <div className="text-4xl font-extrabold text-indigo-400">${analyticsData?.estimatedTraffic || 0}</div>
                  <div className="text-xs text-indigo-400/70 mt-2">Based on avg. CPC of $1.50 per click</div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-6">Content Velocity (30 Days)</h3>
                <div className="h-[300px] w-full">
                  {analyticsData?.chartData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.chartData}>
                        <defs>
                          <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="articles" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorArticles)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin"/></div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PLANNER TAB */}
          {activeTab === 'planner' && (
            <motion.div key="planner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-2">Seed Keyword Planner</h2>
                <p className="text-slate-400 text-sm mb-6">Enter a broad topic to instantly generate a 30-day topical map of AEO queries.</p>
                
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Real Estate in Connecticut" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={handleGeneratePlanner}
                    disabled={isGenerating || !engineActive}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Bot className="w-5 h-5" /> Generate Map</>}
                  </button>
                </div>
              </div>

              {generatedTopics.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Generated Topic Map ({generatedTopics.length})</h3>
                    <button 
                      onClick={handleQueueAll}
                      disabled={isQueueingAll}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isQueueingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Approve & Queue All
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedTopics.map((t, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-indigo-500/50 transition-colors">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Vol: {t.estimatedVolume}</span>
                            <button onClick={() => handleQueueSingle(t.title)} className="text-slate-500 hover:text-emerald-400 transition-colors" title="Queue this article">
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-sm text-slate-200 leading-snug mb-2">{t.title}</h4>
                          <p className="text-xs text-slate-500">Query: {t.targetQuery}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* QUEUE TAB */}
          {activeTab === 'queue' && (
            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {articles.length === 0 ? (
                <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl">
                  No articles in the queue. Use the Planner to generate some!
                </div>
              ) : (
                articles.map((art, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-slate-200 mb-1">{art.topic}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>Created: {new Date(art.createdAt).toLocaleDateString()}</span>
                        {art.scheduledFor && <span>Scheduled: {new Date(art.scheduledFor).toLocaleString()}</span>}
                      </div>
                    </div>
                    <div>
                      {art.status === 'PUBLISHED' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">PUBLISHED</span>
                      ) : art.status === 'PENDING' ? (
                        <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">QUEUED</span>
                      ) : art.status === 'GENERATING' ? (
                        <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> WRITING AI</span>
                      ) : (
                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">{art.status}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* SITES TAB */}
          {activeTab === 'sites' && (
            <motion.div key="sites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Connected Destinations</h2>
                <button 
                  onClick={handleConnectSite}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  + Add WordPress Site
                </button>
              </div>

              {sites.length === 0 ? (
                <div className="text-center py-20 text-slate-500 border border-slate-800 border-dashed rounded-2xl">
                  No sites connected. You must connect a WordPress site before queuing articles.
                </div>
              ) : (
                <div className="space-y-4">
                  {sites.map((site) => (
                    <div key={site.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xl border border-indigo-500/20">W</div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-200 truncate">{site.url}</div>
                            <div className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> REST API Connected
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (editingSiteId === site.id) {
                              setEditingSiteId(null);
                            } else {
                              setEditingSiteId(site.id);
                              setSiteForm({
                                toneOfVoice: site.toneOfVoice || '',
                                targetAudience: site.targetAudience || '',
                                formattingRules: site.formattingRules || ''
                              });
                            }
                          }}
                          className="text-slate-400 hover:text-indigo-400 transition-colors p-2"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Editing Form */}
                      <AnimatePresence>
                        {editingSiteId === site.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-800 pt-4 mt-2"
                          >
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs text-slate-400 mb-1">Tone of Voice</label>
                                <input 
                                  type="text" 
                                  value={siteForm.toneOfVoice} 
                                  onChange={e => setSiteForm({...siteForm, toneOfVoice: e.target.value})}
                                  placeholder="e.g. Professional, Witty, Conversational"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-400 mb-1">Target Audience</label>
                                <input 
                                  type="text" 
                                  value={siteForm.targetAudience} 
                                  onChange={e => setSiteForm({...siteForm, targetAudience: e.target.value})}
                                  placeholder="e.g. Enterprise CEOs, Beginner Gardeners"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs text-slate-400 mb-1">Formatting Rules (Optional)</label>
                                <input 
                                  type="text" 
                                  value={siteForm.formattingRules} 
                                  onChange={e => setSiteForm({...siteForm, formattingRules: e.target.value})}
                                  placeholder="e.g. Always include a pros/cons table"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleSaveSettings(site.id)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" /> Save Settings
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
