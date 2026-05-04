'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function OrbitalLogo({ size = 300 }: { size?: number }) {
    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                width: '60%',
                height: '60%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
            }} />

            {/* Inner Core */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    width: '35%',
                    height: '35%',
                    borderRadius: '50%',
                    border: '1px solid var(--accent-border)',
                    background: 'rgba(0, 245, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                }}
            >
                <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 800,
                    fontSize: '2.5rem',
                    color: 'var(--accent)',
                    letterSpacing: '-0.05em'
                }}>
                    ia
                </span>
            </motion.div>

            {/* Orbiting Elements - Using SVG for precision */}
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(-45deg)', overflow: 'visible' }}>
                {/* Connection lines */}
                <motion.circle
                    cx="50" cy="50" r="28"
                    fill="none"
                    stroke="rgba(0, 245, 255, 0.15)"
                    strokeWidth="0.5"
                />
                <motion.circle
                    cx="50" cy="50" r="38"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="0.5"
                    strokeDasharray="2 4"
                />

                {/* Nodes & Particles */}
                {[
                    { r: 35, a: 0, s: 1.5, c: 'var(--accent)' },
                    { r: 42, a: 45, s: 1, c: '#fff' },
                    { r: 28, a: -90, s: 2, c: 'var(--accent)' },
                    { r: 45, a: 160, s: 1.2, c: '#fff' },
                    { r: 32, a: 220, s: 0.8, c: 'var(--accent)' },
                ].map((node, i) => {
                    const rad = (node.a * Math.PI) / 180;
                    const x = 50 + node.r * Math.cos(rad);
                    const y = 50 + node.r * Math.sin(rad);

                    return (
                        <motion.circle
                            key={i}
                            cx={x} cy={y} r={node.s}
                            fill={node.c}
                            initial={{ opacity: 0.2 }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 2 + i,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        />
                    );
                })}

                {/* Arrow-ish lines from mockup */}
                <motion.path
                    d="M 50 15 L 53 19 M 50 15 L 47 19"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.path
                    d="M 50 22 L 53 26 M 50 22 L 47 26"
                    stroke="rgba(0, 245, 255, 0.4)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                />
            </svg>

            {/* Subtle Rotating Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute',
                    width: '90%',
                    height: '90%',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(0, 245, 255, 0.05) 50%, transparent 100%)',
                }}
            />
        </div>
    );
}
