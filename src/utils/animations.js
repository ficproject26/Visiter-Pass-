// src/utils/animations.js

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

export const fadeUpBounce = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 }
  }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 18 }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 }
  }
};

// --- NEW ZERO GRAVITY ANIMATIONS ---

// Subtle vertical bobbing (like floating in space)
export const zeroGravityFloat = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Subtle horizontal and vertical drifting with rotation
export const zeroGravityDrift = {
  animate: {
    y: [-12, 12, -12],
    x: [-6, 6, -6],
    rotate: [-1.5, 1.5, -1.5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
