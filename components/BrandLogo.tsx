'use client';

export default function BrandLogo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Inline Favicon Mark - Indigo #6366F1 */}
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background removed for transparent NavBar integration */}
                {/* Center circle */}
                <circle cx="32" cy="32" r="4" fill="#6366F1"/>
                
                {/* Spokes (lines from center) */}
                <line x1="32" y1="32" x2="32" y2="14" stroke="#6366F1" strokeWidth="2.5"/>
                <line x1="32" y1="32" x2="47" y2="22" stroke="#6366F1" strokeWidth="2.5"/>
                <line x1="32" y1="32" x2="47" y2="42" stroke="#6366F1" strokeWidth="2.5"/>
                <line x1="32" y1="32" x2="32" y2="50" stroke="#6366F1" strokeWidth="2.5"/>
                <line x1="32" y1="32" x2="17" y2="42" stroke="#6366F1" strokeWidth="2.5"/>
                <line x1="32" y1="32" x2="17" y2="22" stroke="#6366F1" strokeWidth="2.5"/>
                
                {/* Endpoint dots */}
                <circle cx="32" cy="14" r="3" fill="#6366F1"/>
                <circle cx="47" cy="22" r="3" fill="#6366F1"/>
                <circle cx="47" cy="42" r="3" fill="#6366F1"/>
                <circle cx="32" cy="50" r="3" fill="#6366F1"/>
                <circle cx="17" cy="42" r="3" fill="#6366F1"/>
                <circle cx="17" cy="22" r="3" fill="#6366F1"/>
            </svg>
            
            {/* Text Logo */}
            <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 800, 
                fontSize: '20px', 
                color: 'var(--text)',
                letterSpacing: '-0.05em'
            }}>
                it<span style={{ color: '#6366F1' }}>appens</span>.ai
            </span>
        </div>
    );
}
