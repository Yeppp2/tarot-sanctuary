'use client';

import { motion } from 'framer-motion';

export default function BreathingGlow() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      animate={{
        opacity: [0.3, 0.6, 0.35, 0.55, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(30,40,100,0.08) 0%, transparent 60%)',
        }}
      />
    </motion.div>
  );
}
