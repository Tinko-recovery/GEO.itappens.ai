'use client';
import { useEffect } from 'react';

export default function CursorSpotlight() {
    useEffect(() => {
        const el = document.documentElement;
        const move = (e: MouseEvent) => {
            el.style.setProperty('--cursor-x', `${e.clientX}px`);
            el.style.setProperty('--cursor-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', move, { passive: true });
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return null; // spotlight rendered as CSS fixed div in BackgroundMesh
}
