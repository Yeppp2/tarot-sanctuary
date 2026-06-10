'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface OracleTextProps {
  text: string;
}

export default function OracleText({ text }: OracleTextProps) {
  const paragraphs = useMemo(
    () => text.split('\n').map((p) => p.trim()).filter(Boolean),
    [text]
  );
  const [visibleCount, setVisibleCount] = useState(Math.min(4, paragraphs.length));
  const done = visibleCount >= paragraphs.length;

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="space-y-5 rounded-[28px] border border-white/[0.07] bg-[#090d19]/70 px-5 py-7 shadow-[0_30px_120px_rgba(0,0,0,0.34)] md:px-10 md:py-10">
        <AnimatePresence initial={false}>
          {paragraphs.slice(0, visibleCount).map((para, index) => (
            <motion.p
              key={`${index}-${para.slice(0, 12)}`}
              className="text-[15px] leading-[1.95] tracking-[0.02em] text-white/66 md:text-[17px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: index === visibleCount - 1 ? 0.15 : 0,
                ease: [0.25, 0, 0, 1],
              }}
            >
              {para}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        {!done ? (
          <>
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + 2, paragraphs.length))}
              className="rounded-full border border-white/12 bg-white/[0.045] px-7 py-3 text-sm tracking-[0.18em] text-white/70 transition-all duration-500 hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
            >
              继续听
            </button>
            <p className="text-[10px] tracking-[0.16em] text-white/18">
              {visibleCount} / {paragraphs.length}
            </p>
          </>
        ) : (
          <p className="text-center text-xs leading-6 tracking-[0.12em] text-white/24">
            可以停在这里，也可以再问一张补充牌。
          </p>
        )}
      </div>
    </div>
  );
}
