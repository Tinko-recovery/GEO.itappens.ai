'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoSrc: string;
  thumbnailSrc?: string;
}

export default function VideoPlayer({ videoSrc, thumbnailSrc }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Thumbnail Trigger */}
      <div 
        className="video-thumbnail-container" 
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          background: '#000',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {thumbnailSrc ? (
            <img 
                src={thumbnailSrc} 
                alt="Play Video" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    opacity: isHovered ? 0.7 : 0.9, 
                    transition: 'opacity 0.3s ease',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transitionDuration: '0.5s'
                }} 
            />
        ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0a0f1e 0%, #1a2a4a 100%)' }} />
        )}

        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.05 : 1})`,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(0, 194, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered ? '0 0 40px rgba(0, 194, 255, 0.7)' : '0 0 20px rgba(0, 194, 255, 0.4)',
          transition: 'all 0.3s ease',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '6px' }}>
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            }}
          >
            {/* Close Button */}
            <button 
                onClick={() => setIsOpen(false)}
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    zIndex: 10000
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Close
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '1200px',
                aspectRatio: '16/9',
                backgroundColor: '#000',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              <video 
                src={videoSrc}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', outline: 'none' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
