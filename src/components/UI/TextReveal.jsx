"use client";
import { useEffect, useRef, useState } from 'react';

/**
 * TextReveal — Cinematic word-by-word heading reveal.
 * Triggered when scrolled into view via IntersectionObserver.
 * 
 * Props:
 *   text: string — The heading text
 *   tag: string — HTML tag (default 'h2')
 *   style: object — Inline styles for the container
 *   className: string — Additional classes
 *   charMode: boolean — If true, animate character by character
 *   delay: number — Initial delay in ms (default 0)
 *   staggerMs: number — Delay between each word/char in ms (default 60)
 */
export default function TextReveal({
  text,
  tag: Tag = 'h2',
  style = {},
  className = '',
  charMode = false,
  delay = 0,
  staggerMs = 60,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const units = charMode ? text.split('') : text.split(' ');

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        overflow: 'hidden',
      }}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: charMode ? 0 : '0.3em',
            verticalAlign: 'top',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              opacity: isVisible ? 1 : 0,
              transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * staggerMs}ms, opacity 0.5s ease ${delay + i * staggerMs}ms`,
              willChange: 'transform, opacity',
            }}
          >
            {unit === ' ' ? '\u00A0' : unit}
          </span>
        </span>
      ))}
    </Tag>
  );
}
