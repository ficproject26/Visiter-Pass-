"use client";
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * PremiumCursor — Custom cursor system with dot + ring follower,
 * magnetic attraction, dynamic states, and subtle trail.
 * Disabled on touch devices.
 */
export default function PremiumCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ]);
  const scale = useRef(1);
  const ringScale = useRef(1);
  const targetRingScale = useRef(1);
  const isHovering = useRef(false);
  const magnetTarget = useRef(null);
  const raf = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Detect touch device
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (!isVisible) setIsVisible(true);
  }, [isVisible]);

  const handleMouseDown = useCallback(() => {
    scale.current = 0.75;
    targetRingScale.current = 0.85;
  }, []);

  const handleMouseUp = useCallback(() => {
    scale.current = 1;
    targetRingScale.current = isHovering.current ? 1.8 : 1;
  }, []);

  const handleMouseEnterInteractive = useCallback((e) => {
    isHovering.current = true;
    const tag = e.target.tagName;
    const isButton = tag === 'BUTTON' || e.target.closest('button') || e.target.classList.contains('magnetic-target');
    targetRingScale.current = isButton ? 2.2 : 1.6;
    magnetTarget.current = e.target.closest('button') || e.target.closest('a') || e.target.closest('.magnetic-target');
  }, []);

  const handleMouseLeaveInteractive = useCallback(() => {
    isHovering.current = false;
    targetRingScale.current = 1;
    magnetTarget.current = null;
  }, []);

  // Attach event listeners
  useEffect(() => {
    if (isTouch) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Delegate hover detection for interactive elements
    const handleOver = (e) => {
      if (e.target.closest('button, a, .magnetic-target, input, [role="button"]')) {
        handleMouseEnterInteractive(e);
      }
    };
    const handleOut = (e) => {
      if (e.target.closest('button, a, .magnetic-target, input, [role="button"]')) {
        handleMouseLeaveInteractive(e);
      }
    };

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [isTouch, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnterInteractive, handleMouseLeaveInteractive]);

  // Animation loop
  useEffect(() => {
    if (isTouch) return;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      // Dot follows mouse tightly
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.35);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.35);

      // Ring follows with more lag
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      // Magnetic snap to target element center
      if (magnetTarget.current) {
        const rect = magnetTarget.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(rect.width, rect.height);
        if (dist < maxDist) {
          const pull = 0.35;
          targetX = mouse.current.x - dx * pull;
          targetY = mouse.current.y - dy * pull;
        }
      }

      ringPos.current.x = lerp(ringPos.current.x, targetX, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, targetY, 0.15);
      ringScale.current = lerp(ringScale.current, targetRingScale.current, 0.12);



      // Apply transforms
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(${scale.current})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) scale(${ringScale.current})`;
        ringRef.current.style.opacity = isHovering.current ? '0.9' : '0.5';
      }


      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        .premium-cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 99999;
          width: 8px; height: 8px; margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: #D4891A;
          pointer-events: none;
          will-change: transform;
          transition: background 0.2s;
          mix-blend-mode: difference;
        }
        .premium-cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 99998;
          width: 36px; height: 36px; margin: -18px 0 0 -18px;
          border-radius: 50%;
          border: 1.5px solid rgba(212, 137, 26, 0.5);
          pointer-events: none;
          will-change: transform, opacity;
          transition: border-color 0.3s, opacity 0.3s;
        }

        @media (pointer: coarse) {
          .premium-cursor-dot,
          .premium-cursor-ring,
          .premium-cursor-trail { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .premium-cursor-dot,
          .premium-cursor-ring,
          .premium-cursor-trail { display: none !important; }
        }
      `}</style>



      {/* Ring */}
      <div
        ref={ringRef}
        className="premium-cursor-ring"
        style={{ opacity: isVisible ? 0.5 : 0 }}
      />

      {/* Dot */}
      <div
        ref={dotRef}
        className="premium-cursor-dot"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
}
