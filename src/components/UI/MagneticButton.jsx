"use client";
import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * MagneticButton — Wrapper that magnetically attracts content toward cursor.
 * Includes glow pulse on hover and liquid press animation.
 *
 * Props:
 *   children: ReactNode
 *   strength: number — magnetic pull strength in px (default 15)
 *   className: string
 *   style: object
 *   glowColor: string — color for the hover glow (default '#D4891A')
 */
export default function MagneticButton({
  children,
  strength = 15,
  className = '',
  style = {},
  glowColor = '#D4891A',
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setOffset({
      x: dx * (strength / Math.max(rect.width / 2, 1)),
      y: dy * (strength / Math.max(rect.height / 2, 1)),
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    });
    setTimeout(() => setRipple(null), 600);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`magnetic-target ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      animate={{
        x: offset.x,
        y: offset.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.5,
      }}
      whileTap={{ scale: 0.96 }}
      style={{
        display: 'inline-flex',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'inherit',
        ...style,
      }}
    >
      {children}

      {/* Glow effect on hover */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          opacity: isHovered ? 0.5 : 0,
          boxShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Ripple on click */}
      {ripple && (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: `${glowColor}30`,
            transform: 'translate(-50%, -50%)',
            animation: 'magneticRipple 0.6s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <style>{`
        @keyframes magneticRipple {
          0% { width: 0; height: 0; opacity: 0.6; }
          100% { width: 300px; height: 300px; opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
