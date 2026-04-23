'use client';
import { motion } from 'framer-motion';

interface ChannelProps {
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  followers?: string;
  lastPost?: string;
}

export default function ChannelCard({ name, icon, status, followers, lastPost }: ChannelProps) {
  const isConnected = status === 'connected';

  return (
    <div className="card-bento" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          backgroundColor: isConnected ? 'var(--accent-soft)' : 'var(--surface-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
        <div style={{ 
          padding: '4px 10px', 
          borderRadius: '20px', 
          fontSize: '11px', 
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          backgroundColor: isConnected ? '#dcfce7' : '#fee2e2',
          color: isConnected ? '#166534' : '#991b1b'
        }}>
          {status}
        </div>
      </div>

      <div>
        <h3 className="headline-sm" style={{ marginBottom: '4px', fontSize: '18px' }}>{name}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {isConnected ? `${followers || '0'} followers` : 'Action required'}
        </p>
      </div>

      <div style={{ marginTop: 'auto' }}>
        {isConnected ? (
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            Last post: <span style={{ color: 'var(--text)' }}>{lastPost || 'N/A'}</span>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '16px', lineHeight: 1.5 }}>
            Connect your {name} profile to start automated GEO-posting.
          </p>
        )}
        
        <button 
          className={isConnected ? "btn-secondary" : "btn-primary"} 
          style={{ width: '100%', fontSize: '13px', padding: '10px' }}
        >
          {isConnected ? 'Manage Integration' : `Connect ${name}`}
        </button>
      </div>
    </div>
  );
}
