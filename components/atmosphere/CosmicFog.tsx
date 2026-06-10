'use client';

import { motion } from 'framer-motion';

export default function CosmicFog() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top-right fog */}
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(100,140,220,0.6) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -30, 15, -10, 0],
          y: [0, 20, -15, 25, 0],
          scale: [1, 1.08, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Bottom-left fog */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(60,80,160,0.5) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{
          x: [0, 20, -25, 10, 0],
          y: [0, -15, 10, -20, 0],
          scale: [1, 0.95, 1.06, 1.02, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center horizon glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[30vh] rounded-full opacity-[0.02]"
        style={{
          background: 'radial-gradient(ellipse, rgba(80,100,180,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          opacity: [0.015, 0.025, 0.018, 0.022, 0.015],
          scale: [1, 1.04, 0.97, 1.02, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
