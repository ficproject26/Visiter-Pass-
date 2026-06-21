"use client";
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a fluid, physics-based feel
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map normalized mouse position (-0.5 to 0.5) to rotation angles (degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the center of the card (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Reset to center on leave
    x.set(0);
    y.set(0);
  };

  // Create a dynamic radial gradient glare that follows the mouse
  const glareBackground = useMotionTemplate`radial-gradient(
    circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])},
    rgba(255, 255, 255, 0.12) 0%,
    transparent 60%
  )`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
        ...style,
      }}
      className={className}
    >
      {/* Glare effect overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: glareBackground,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Content wrapper translated slightly on Z to pop out */}
      <div style={{ transform: "translateZ(40px)", height: '100%', width: '100%' }}>
        {children}
      </div>
    </motion.div>
  );
}
