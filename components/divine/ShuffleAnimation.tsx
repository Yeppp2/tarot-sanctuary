'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ShuffleAnimationProps {
  isShuffling: boolean;
  onComplete: () => void;
}

const cardPaths = Array.from({ length: 16 }, (_, i) => {
  const angle = i * 2.399963229728653;
  const startRadius = 78 + (i % 5) * 24;
  const middleRadius = 46 + (i % 4) * 20;

  return {
    id: i,
    start: {
      x: Math.cos(angle) * startRadius,
      y: Math.sin(angle * 1.31) * startRadius * 0.82,
      rotate: (i * 47) % 360,
    },
    middle: {
      x: Math.cos(angle * 1.7) * middleRadius,
      y: Math.sin(angle * 1.13) * middleRadius,
      rotate: (i * 73 + 40) % 360,
    },
  };
});

function ShuffleOverlay({ onComplete }: Pick<ShuffleAnimationProps, 'onComplete'>) {
  const [phase, setPhase] = useState<'start' | 'middle' | 'end'>('start');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('middle'), 700);
    const t2 = setTimeout(() => setPhase('end'), 3600);
    const t3 = setTimeout(() => onComplete(), 4700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#05080f]/94"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex h-[28rem] w-[28rem] items-center justify-center">
        {cardPaths.map((path) => (
          <motion.div
            key={path.id}
            className="absolute h-28 w-20 rounded-lg border border-white/[0.08] bg-[#111731]"
            style={{
              transformOrigin: 'center center',
              background:
                'radial-gradient(circle at 50% 42%, rgba(185,204,255,0.13), transparent 34%), linear-gradient(145deg, #111731 0%, #050815 54%, #151b37 100%)',
            }}
            animate={
              phase === 'start'
                ? {
                    ...path.start,
                    opacity: [0, 0.72],
                  }
                : phase === 'middle'
                  ? {
                      ...path.middle,
                      opacity: 0.72,
                    }
                  : {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      opacity: [0.72, 0],
                    }
            }
            transition={{
              duration: phase === 'end' ? 0.9 : 2.6,
              ease: 'easeInOut',
            }}
          />
        ))}

        <motion.div
          className="z-10 rounded-full border border-white/[0.08] bg-black/20 px-8 py-4"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.7, repeat: Infinity }}
        >
          <p className="text-sm tracking-[0.3em] text-white/58">
            正在洗牌
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ShuffleAnimation({ isShuffling, onComplete }: ShuffleAnimationProps) {
  return (
    <AnimatePresence>
      {isShuffling && <ShuffleOverlay onComplete={onComplete} />}
    </AnimatePresence>
  );
}
