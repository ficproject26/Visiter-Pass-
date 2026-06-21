import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSmoothScroll — Provides smooth scroll progress (0→1)
 * and a lerped scrollY value for parallax calculations.
 * Uses requestAnimationFrame for buttery updates.
 */
export default function useSmoothScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothY, setSmoothY] = useState(0);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const raf = useRef(null);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    targetY.current = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      currentY.current = lerp(currentY.current, targetY.current, 0.1);
      setSmoothY(currentY.current);
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return { scrollProgress, smoothY };
}
