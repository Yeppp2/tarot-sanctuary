'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import HistoryCard from '@/components/history/HistoryCard';
import { clearHistory, getHistory, subscribeHistory } from '@/lib/store/history';
import CosmicButton from '@/components/shared/CosmicButton';

export default function HistoryPage() {
  const readings = useSyncExternalStore(subscribeHistory, getHistory, () => []);

  const handleClear = () => {
    clearHistory();
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-lg tracking-[0.3em] text-white/50">过往回声</h1>
          <p className="mt-3 text-[10px] tracking-[0.15em] text-white/[0.15]">
            你曾经停下来听过的那些答案。
          </p>
        </div>

        <div className="w-full max-w-lg">
          {readings.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-8 text-sm tracking-[0.15em] text-white/[0.15]">
                这里暂时还没有记录。
              </p>
              <Link href="/">
                <CosmicButton variant="secondary">回到首页</CosmicButton>
              </Link>
            </div>
          ) : (
            <div className="mb-12 space-y-2">
              {readings.map((reading, index) => (
                <HistoryCard key={reading.id} reading={reading} index={index} />
              ))}
            </div>
          )}
        </div>

        {readings.length > 0 && (
          <div className="flex items-center gap-6">
            <Link href="/">
              <CosmicButton variant="secondary">再占一次</CosmicButton>
            </Link>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs tracking-[0.15em] text-white/[0.12] transition-colors duration-500 hover:text-white/[0.3]"
            >
              清空记录
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
