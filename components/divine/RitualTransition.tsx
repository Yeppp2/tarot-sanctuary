'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { randomRitualPhrase } from '@/lib/language';
import { useState, useEffect } from 'react';

interface RitualTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function RitualTransition({ isActive, onComplete }: RitualTransitionProps) {
  const [phrase] = useState(randomRitualPhrase);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(onComplete, 6200);
    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05080f]/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-10">
            {/* Animated constellation dots */}
            <div className="relative w-24 h-24">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'rgba(160,190,240,0.5)',
                    top: `${20 + i * 15}%`,
                    left: `${30 + (i % 2) * 30}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.7, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <motion.line
                  x1="35" y1="35" x2="50" y2="50" stroke="rgba(160,190,240,0.08)" strokeWidth="0.3"
                  animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.line
                  x1="50" y1="50" x2="65" y2="35" stroke="rgba(160,190,240,0.08)" strokeWidth="0.3"
                  animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 2.5, delay: 0.5, repeat: Infinity }}
                />
                <motion.line
                  x1="65" y1="35" x2="80" y2="50" stroke="rgba(160,190,240,0.06)" strokeWidth="0.3"
                  animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2.5, delay: 1, repeat: Infinity }}
                />
              </svg>
            </div>

            {/* Ritual phrase */}
            <motion.p
              className="text-white/35 text-sm tracking-[0.2em] text-center leading-relaxed max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              {phrase}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
