'use client';

export default function BrandLogo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Geometric "Node" Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#6366F1" strokeWidth="2.5" />
                <circle cx="12" cy="12" r="3" fill="#6366F1" />
                <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            
            {/* Text Logo */}
            <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 800, 
                fontSize: '18px', 
                color: 'var(--text)',
                letterSpacing: '-0.05em'
            }}>
                it<span style={{ color: '#6366F1' }}>appens</span>.ai
            </span>
        </div>
    );
}
