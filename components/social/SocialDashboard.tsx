'use client';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

export default function SocialDashboard() {
  const [engineActive, setEngineActive] = useState(false);
  const [checking, setChecking] = useState(true);

  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([{ url: "https://yourbrand.com", status: "connected" }]);

  useEffect(() => {
    // Simulate checking connection
    setTimeout(() => {
      setEngineActive(true);
      setChecking(false);
    }, 1000);
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    // Simulate generation queue
    setTimeout(() => {
      const newArticles = [
        { title: `Complete Guide to ${topic}`, status: "pending", scheduledAt: "Today, 14:00" },
        ...articles
      ];
      setArticles(newArticles);
      setIsGenerating(false);
      setTopic("");
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 160px' }}>
      
      {/* Dashboard Top: Status & Pro Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '48px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-bento" 
          style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, #4338ca 100%)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px'
          }}
        >
          <span className="overline" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Account Status — AEO PRO</span>
          <h2 className="headline-sm" style={{ color: '#fff', marginBottom: '16px' }}>Your Content Engine is <span style={{ color: '#818cf8' }}>{checking ? 'Checking...' : engineActive ? 'Active.' : 'Offline.'}</span></h2>
          <p style={{ opacity: 0.9, fontSize: '15px', maxWidth: '400px', marginBottom: '24px' }}>
            You have 142 AEO article credits remaining. Credits do not expire.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ backgroundColor: '#fff', color: 'var(--accent)', border: 'none' }}>
              Buy Credits
            </button>
            <button className="btn-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Upgrade Plan
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-bento" 
          style={{ backgroundColor: 'var(--surface)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <span className="overline">Content Overview</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>8</div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Articles Published</p>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>12</div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Scheduled / Drafts</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid: Channels & Approval Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
        
        {/* Sidebar: Connected Sites */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <span className="overline">CONNECTED SITES</span>
           {sites.map((site, i) => (
             <div key={i} className="card-bento" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-blue)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                 W
               </div>
               <div>
                 <div style={{ fontSize: '14px', fontWeight: 700 }}>{site.url}</div>
                 <div style={{ fontSize: '12px', color: 'var(--brand-green)' }}>API Connected</div>
               </div>
             </div>
           ))}
           <button 
             className="btn-secondary" 
             style={{ width: '100%', fontSize: '13px', padding: '10px' }}
             onClick={() => {
               const newUrl = prompt("Enter WordPress Site URL:");
               const appUser = prompt("Enter WordPress Application Username:");
               const appToken = prompt("Enter WordPress Application Password (we encrypt this):");
               if (newUrl && appToken) {
                 setSites([...sites, { url: newUrl.replace(/^https?:\/\//, ''), status: 'connected' }]);
               }
             }}
           >
             + Connect New WordPress Site
           </button>
           
           <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '12px 0' }} />

           <div className="card-bento" style={{ padding: '20px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--accent)' }}>
             <span className="overline" style={{ color: 'var(--accent)', fontSize: '10px' }}>PUBLISHING ENGINE</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 900 }}>AI</div>
                <div>
                   <div style={{ fontSize: '12px', fontWeight: 700 }}>Claude 3.5 Sonnet</div>
                   <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Writing Engine Active</div>
                </div>
             </div>
           </div>
        </div>

        {/* Main: Topic Queue & Idea Bucket */}
        <div>
           {/* Idea Bucket Input */}
           <div className="card-bento" style={{ marginBottom: '40px', padding: '32px' }}>
              <span className="overline">PLAN A TOPIC</span>
              <h3 className="headline-sm" style={{ marginBottom: '16px' }}>What should we write about?</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Best AEO tools for 2026..." 
                  style={{ 
                    flex: 1, 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px'
                  }}
                />
                <button 
                  className="btn-primary" 
                  onClick={handleGenerate}
                  disabled={isGenerating || !engineActive}
                >
                  {isGenerating ? 'Queuing...' : 'Queue Article'}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                {engineActive ? 'Generating an article consumes **1 Credit** and takes ~3 minutes.' : 'Engine is currently offline.'}
              </p>
           </div>

           {/* Content Queue */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <span className="overline">CONTENT PIPELINE</span>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {articles.map((art, idx) => (
                <div key={idx} className="card-bento" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{art.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Scheduled: {art.scheduledAt}</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                    PENDING GENERATION
                  </span>
                </div>
              ))}

              <div className="card-bento" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>How Generative Engine Optimization is Replacing SEO</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Published: Today, 09:00 AM</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                    PUBLISHED
                  </span>
              </div>
              
              <div className="card-bento" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>Top 5 LLMs for Content Extraction</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drafted: Yesterday</span>
                  </div>
                  <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
                    READY FOR REVIEW
                  </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
