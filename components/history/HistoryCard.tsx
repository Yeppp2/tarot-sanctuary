'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReadingRecord } from '@/lib/store/history';

interface HistoryCardProps {
  reading: ReadingRecord;
  index: number;
}

export default function HistoryCard({ reading, index }: HistoryCardProps) {
  const date = new Date(reading.timestamp);
  const timeStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const question = reading.question || '没有说出口的问题';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <Link href={`/reading/${reading.id}`}>
        <div className="group cursor-pointer rounded-xl border border-white/[0.05] bg-white/[0.01] p-4 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/50 transition-colors group-hover:text-white/65">
                {question}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[10px] tracking-[0.15em] text-white/[0.2]">
                  {timeStr}
                </span>
                <span className="truncate text-[10px] text-white/[0.15]">
                  {reading.cards.map((card) => card.card.name).join(' / ')}
                </span>
              </div>
            </div>
            <span className="ml-4 text-xs text-white/[0.12] transition-colors group-hover:text-white/[0.3]">
              查看
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
