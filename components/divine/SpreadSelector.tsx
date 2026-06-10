'use client';

import { motion } from 'framer-motion';
import { SpreadDefinition, spreadList } from '@/lib/tarot/spreads';

interface SpreadSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
  recommendedIds?: string[];
}

export default function SpreadSelector({
  selected,
  onSelect,
  recommendedIds = [],
}: SpreadSelectorProps) {
  const orderedSpreads = [
    ...recommendedIds
      .map((id) => spreadList.find((spread) => spread.id === id))
      .filter((spread): spread is SpreadDefinition => Boolean(spread)),
    ...spreadList.filter((spread) => !recommendedIds.includes(spread.id)),
  ];

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {orderedSpreads.map((spread, i) => (
        <motion.button
          key={spread.id}
          type="button"
          onClick={() => onSelect(spread.id)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className={`rounded-xl border p-3 text-left transition-all duration-500 ${
            selected === spread.id
              ? 'border-white/20 bg-white/[0.05]'
              : 'border-white/[0.04] bg-transparent hover:border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className={`text-xs tracking-[0.15em] ${
                selected === spread.id ? 'text-white/70' : 'text-white/40'
              }`}
            >
              {spread.name}
            </div>
            {recommendedIds.includes(spread.id) && (
              <span className="shrink-0 rounded-full border border-white/[0.08] px-2 py-1 text-[9px] tracking-[0.16em] text-white/30">
                推荐
              </span>
            )}
          </div>
          <div className="mt-1 text-[10px] leading-relaxed text-white/20">
            {spread.drawCount} 张牌 / {spread.description}
          </div>
          <div className="mt-2 text-[10px] leading-relaxed text-white/28">
            {spread.tradeoff}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
