'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingRitualProps {
  isVisible: boolean;
}

const readingSteps = [
  '正在确认你的问题和时间范围',
  '正在读取每张牌所在的位置',
  '正在把正位、逆位和背景连起来',
  '正在写下更贴近你的剖析',
  '正在收束提醒和可追问的问题',
];

function LoadingOverlay() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, readingSteps.length - 1));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05080f]/96 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-10 rounded-[32px] border border-white/[0.08] bg-white/[0.025] px-6 py-10 text-center shadow-[0_40px_160px_rgba(0,0,0,0.45)]">
        <motion.div
          className="relative flex h-28 w-28 items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-4 rounded-full border border-white/[0.12]" />
          <div className="h-3 w-3 rounded-full bg-white/45 shadow-[0_0_42px_rgba(190,210,255,0.45)]" />
          {[0, 1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
              style={{
                top: dot < 2 ? 12 : 'auto',
                bottom: dot >= 2 ? 12 : 'auto',
                left: dot % 2 === 0 ? 18 : 'auto',
                right: dot % 2 === 1 ? 18 : 'auto',
              }}
            />
          ))}
        </motion.div>

        <div>
          <p className="text-[10px] tracking-[0.28em] text-white/20">
            READING IN PROGRESS
          </p>
          <h2 className="mt-4 text-xl font-normal tracking-[0.18em] text-white/76">
            回声正在解读
          </h2>
        </div>

        <div className="h-9 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              className="text-sm leading-8 tracking-[0.12em] text-white/45"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55 }}
            >
              {readingSteps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-white/35"
            initial={{ width: '8%' }}
            animate={{ width: `${20 + stepIndex * 20}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function LoadingRitual({ isVisible }: LoadingRitualProps) {
  if (!isVisible) return null;

  return <LoadingOverlay />;
}
