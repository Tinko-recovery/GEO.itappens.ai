'use client';

import { motion } from 'framer-motion';

export default function BrandLogo() {
    const colors = {
        blue: '#3ABEF9',
        yellow: '#F9D949',
        red: '#F45050',
        green: '#39B549'
    };

    const logoText = "itappens.ai";

    const getLetterColor = (char: string, index: number) => {
        const colorSequence = [colors.blue, colors.yellow, colors.red, colors.green];
        return colorSequence[index % colorSequence.length];
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <motion.svg 
                width="36" 
                height="36" 
                viewBox="0 0 64 64" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
            >
                <circle cx="32" cy="14" r="6" fill={colors.blue}/>
                <circle cx="47" cy="42" r="6" fill={colors.red}/>
                <circle cx="17" cy="42" r="6" fill={colors.green}/>
                <circle cx="32" cy="32" r="4" fill="white" fillOpacity="0.2"/>
                <motion.path 
                    d="M32 14 L47 42 L17 42 Z" 
                    stroke="white" 
                    strokeOpacity="0.1" 
                    strokeWidth="1"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            </motion.svg>
            
            <div style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 900, 
                fontSize: '24px', 
                color: 'var(--text)',
                letterSpacing: '-0.04em',
                display: 'flex',
                alignItems: 'baseline'
            }}>
                {logoText.split('').map((char, index) => (
                    <motion.span
                        key={index}
                        initial={{ y: 0 }}
                        animate={{ 
                            y: [0, -3, 0],
                            color: [getLetterColor(char, index), getLetterColor(char, index + 1), getLetterColor(char, index)]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.1,
                            ease: "easeInOut"
                        }}
                        style={{ color: getLetterColor(char, index), display: 'inline-block' }}
                    >
                        {char}
                    </motion.span>
                ))}
            </div>
        </div>
    );
}
