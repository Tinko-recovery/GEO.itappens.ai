'use client';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import ChannelCard from './ChannelCard';
import PostPreview from './PostPreview';

export default function SocialDashboard() {
  const [engineActive, setEngineActive] = useState(false);
  const [checking, setChecking] = useState(true);
  const [configs, setConfigs] = useState<any>(null);

  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/social/health');
        const data = await res.json();
        if (data.status === 'ok') {
          setEngineActive(true);
          setConfigs(data.configured || {});
        }
      } catch (e) {
        console.error("Engine offline");
      } finally {
        setChecking(false);
      }
    }
    fetchHealth();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic,
          brand_name: "itappens.ai",
          brand_voice: "Professional, Authoritative, Engineering-led",
          persona: "AI Search Experts"
        }),
      });
      const data = await res.json();
      if (data.content) {
        const newDrafts = [
          { platform: 'linkedin', text: data.content.linkedin_personal || data.content.linkedin_agency, id: data.content_id },
          { platform: 'instagram', text: data.content.instagram, imageUrl: data.content.image_url, id: data.content_id }
        ];
        setDrafts(newDrafts);
      }
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setIsGenerating(false);
    }
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
          <span className="overline" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Account Status — PRO</span>
          <h2 className="headline-sm" style={{ color: '#fff', marginBottom: '16px' }}>Your Agentic Content Engine is <span style={{ color: '#818cf8' }}>{checking ? 'Checking...' : engineActive ? 'Active.' : 'Offline.'}</span></h2>
          <p style={{ opacity: 0.9, fontSize: '15px', maxWidth: '400px', marginBottom: '24px' }}>
            Generation credits reset on April 15th. You have 12 automation runs remaining this month.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ backgroundColor: '#fff', color: 'var(--accent)', border: 'none' }}>
              View Usage
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
          <span className="overline">Quick Stats</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>124k</div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Monthly reach</p>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>82</div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>scheduled posts</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid: Channels & Approval Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
        
        {/* Sidebar: Social Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <span className="overline">CONNECTED CHANNELS</span>
           <ChannelCard 
            name="LinkedIn" 
            icon="🔗" 
            status={configs?.linkedin_personal ? "connected" : "disconnected"} 
            followers="12,402" 
            lastPost="2 hours ago" 
           />
           <ChannelCard 
            name="Instagram" 
            icon="📸" 
            status={configs?.instagram ? "connected" : "disconnected"} 
            followers="8,920" 
            lastPost="Yesterday" 
           />
           <ChannelCard 
            name="Facebook" 
            icon="👥" 
            status="disconnected" 
           />
           
           <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '12px 0' }} />

           <div className="card-bento" style={{ padding: '20px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--accent)' }}>
             <span className="overline" style={{ color: 'var(--accent)', fontSize: '10px' }}>POSTING ENGINE</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 900 }}>B</div>
                <div>
                   <div style={{ fontSize: '12px', fontWeight: 700 }}>Buffer Verified</div>
                   <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Secure API Connected</div>
                </div>
             </div>
           </div>
        </div>

        {/* Main: Approval Queue & Idea Bucket */}
        <div>
           {/* Idea Bucket Input */}
           <div className="card-bento" style={{ marginBottom: '40px', padding: '32px' }}>
              <span className="overline">FEED THE ENGINE</span>
              <h3 className="headline-sm" style={{ marginBottom: '16px' }}>What's on your mind?</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Drop a topic, trend, or raw idea here..." 
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
                  {isGenerating ? 'Generating...' : 'Generate Posts'}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                {engineActive ? 'Generating posts consumes **1 Credit**.' : 'Engine is currently offline. Start the Python server to enable generation.'}
              </p>
           </div>

           {/* Approval Queue */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <span className="overline">PENDING APPROVALS ({drafts.length + 3})</span>
             <button style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none' }}>
               Approve All →
             </button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {drafts.map((draft, idx) => (
                <PostPreview 
                  key={`draft-${idx}`}
                  platform={draft.platform}
                  status="pending"
                  text={draft.text}
                  imageUrl={draft.imageUrl}
                  scheduledAt="Just now"
                  isPaid={true}
                />
              ))}
              <PostPreview 
                platform="linkedin"
                status="pending"
                text="AI brand visibility isn't about search terms anymore. It's about entity corroboration. Here's how we helped a SaaS company get cited in 80% of Perplexity queries..."
                scheduledAt="Tomorrow, 09:00 AM"
                isPaid={true}
              />
              <PostPreview 
                platform="instagram"
                status="pending"
                text="5 Steps to AI Clarity 💎\n1. Map your brand\n2. Clean your metadata\n3. Deploy GEO hooks..."
                imageUrl="auto"
                scheduledAt="Tomorrow, 11:00 AM"
                isPaid={true}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
