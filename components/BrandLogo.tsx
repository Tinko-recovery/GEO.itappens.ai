'use client';

export default function BrandLogo({ color = "white", suffix }: { color?: string, suffix?: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Corporate Spark Icon */}
            <svg 
                width="28" 
                height="28" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z" 
                    fill="var(--brand-primary, #8b5cf6)" 
                />
                <circle cx="16" cy="16" r="4" fill="white" fillOpacity="0.3" />
            </svg>
            
            <div style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 800, 
                fontSize: '22px', 
                color: color,
                letterSpacing: '-0.03em',
                display: 'flex',
                alignItems: 'center'
            }}>
                itappens.ai
                {suffix && <span style={{ color: 'var(--indigo-500, #6366f1)', marginLeft: '6px' }}>{suffix}</span>}
            </div>
        </div>
    );
}
