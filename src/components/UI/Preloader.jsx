"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Preloader — Premium brand-based loading screen.
 * Animated logo wipe, counter 0→100%, curtain reveal.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | revealing | done

  useEffect(() => {
    let start = null;
    const duration = 2000; // 2s loading

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      // Ease out cubic for natural feel
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Transition to reveal phase
        setTimeout(() => setPhase('revealing'), 300);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (phase === 'revealing') {
      const t = setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B1020',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,137,26,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }} />

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 72, height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #D4891A, #E8A020)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px rgba(212,137,26,0.4)',
              marginBottom: 32,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: [-80, 120] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: 40, height: '200%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                transform: 'rotate(15deg)',
              }}
            />
            <span style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#0B1020',
              letterSpacing: '-1px',
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-primary)',
            }}>
              FIC
            </span>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#FAF6F0',
              letterSpacing: '-0.5px',
              marginBottom: 40,
              fontFamily: 'var(--font-primary)',
            }}
          >
            Forge India Connect
          </motion.div>

          {/* Progress bar */}
          <div style={{
            width: 200,
            height: 2,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #D4891A, #E8A020)',
                borderRadius: 2,
                width: `${progress}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Counter */}
          <motion.span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(250,246,240,0.4)',
              letterSpacing: '2px',
              fontFamily: 'var(--font-primary)',
            }}
          >
            {progress}%
          </motion.span>

          {/* Curtain reveal effect */}
          {phase === 'revealing' && (
            <>
              <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '50%',
                  background: '#0B1020',
                  transformOrigin: 'top',
                  zIndex: 2,
                }}
              />
              <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '50%',
                  background: '#0B1020',
                  transformOrigin: 'bottom',
                  zIndex: 2,
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
