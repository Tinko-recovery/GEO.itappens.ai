'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Stable star nodes
const STARS = [
    { id: 0, x: 8.2, y: 7.4, r: 1.2, delay: 0.4, dur: 4.2 },
    { id: 1, x: 21.7, y: 14.1, r: 0.8, delay: 1.8, dur: 3.5 },
    { id: 2, x: 37.3, y: 5.6, r: 1.5, delay: 0.7, dur: 5.1 },
    { id: 3, x: 55.8, y: 18.2, r: 0.9, delay: 2.3, dur: 3.8 },
    { id: 4, x: 71.4, y: 9.7, r: 1.3, delay: 0.9, dur: 4.7 },
    { id: 5, x: 86.2, y: 13.5, r: 0.7, delay: 3.2, dur: 3.2 },
    { id: 6, x: 14.6, y: 32.8, r: 1.0, delay: 1.7, dur: 4.9 },
    { id: 7, x: 44.2, y: 25.4, r: 1.4, delay: 0.4, dur: 5.3 },
    { id: 8, x: 62.1, y: 41.4, r: 0.8, delay: 2.8, dur: 3.6 },
    { id: 9, x: 78.7, y: 28.1, r: 1.1, delay: 1.5, dur: 4.4 },
    { id: 10, x: 93.3, y: 44.6, r: 0.6, delay: 3.8, dur: 3.1 },
    { id: 11, x: 5.4, y: 58.2, r: 1.3, delay: 0.6, dur: 4.6 },
    { id: 12, x: 29.8, y: 47.5, r: 0.9, delay: 2.3, dur: 3.9 },
    { id: 13, x: 50.2, y: 63.9, r: 1.1, delay: 1.0, dur: 5.2 },
    { id: 14, x: 67.2, y: 55.7, r: 0.7, delay: 3.4, dur: 3.3 },
    { id: 15, x: 82.4, y: 71.1, r: 1.5, delay: 0.2, dur: 4.1 },
    { id: 16, x: 18.5, y: 79.2, r: 0.8, delay: 2.1, dur: 3.7 },
    { id: 17, x: 38.6, y: 84.7, r: 1.2, delay: 1.3, dur: 5.0 },
    { id: 18, x: 58.1, y: 75.4, r: 0.6, delay: 3.7, dur: 3.4 },
    { id: 19, x: 74.3, y: 88.6, r: 1.0, delay: 0.5, dur: 4.8 },
    { id: 20, x: 91.4, y: 81.2, r: 1.3, delay: 2.5, dur: 3.6 },
    { id: 21, x: 11.9, y: 92.7, r: 0.8, delay: 1.4, dur: 4.3 },
    { id: 22, x: 45.5, y: 96.4, r: 1.1, delay: 0.8, dur: 5.4 },
    { id: 23, x: 68.4, y: 93.8, r: 0.7, delay: 3.1, dur: 3.2 },
];

export default function BackgroundMesh() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

    return (
        <div className="layer-bg" aria-hidden="true">
            <div className="mesh-bg" />
            <div className="grain-overlay" />
            <div className="cursor-spotlight" />
            {/* Star field — parallax 0.2x speed */}
            <motion.div style={{ position: 'absolute', inset: 0, y }}>
                <svg
                    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    preserveAspectRatio="xMidYMid slice"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {STARS.map(s => (
                        <motion.circle
                            key={s.id}
                            cx={`${s.x}%`} cy={`${s.y}%`} r={`${s.r * 0.22}%`}
                            fill="#00F5FF"
                            initial={{ opacity: 0.1 }}
                            animate={{ opacity: [0.1, 0.6, 0.1] }}
                            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}
                </svg>
            </motion.div>
        </div>
    );
}
