'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CardFace from './CardFace';
import { allCards, TarotCard } from '@/lib/tarot/cards';
import { DrawnCard, shuffleCards } from '@/lib/tarot/draw';
import { SpreadPosition } from '@/lib/tarot/spreads';

interface CardDeckProps {
  drawCount: number;
  positions: SpreadPosition[];
  spreadName: string;
  onAllRevealed: (cards: DrawnCard[]) => void;
}

type Phase = 'cut' | 'choose' | 'ready';

const cutOptions = [
  { id: 0, label: '左手边' },
  { id: 1, label: '中间' },
  { id: 2, label: '右手边' },
];

function touchFeedback() {
  if (typeof window === 'undefined') return;
  window.navigator.vibrate?.(18);
}

function getRandomReversal() {
  return Math.random() > 0.5;
}

export default function CardDeck({
  drawCount,
  positions,
  spreadName,
  onAllRevealed,
}: CardDeckProps) {
  const fullDeck = useMemo(() => shuffleCards(allCards), []);
  const [phase, setPhase] = useState<Phase>('cut');
  const [cutIndex, setCutIndex] = useState(0);
  const [selected, setSelected] = useState<DrawnCard[]>([]);
  const [lastPickedId, setLastPickedId] = useState<number | null>(null);

  const visibleDeck = useMemo(() => {
    const start = cutIndex * 18;
    const section = fullDeck.slice(start, start + 24);
    return section.length >= 18 ? section : fullDeck.slice(0, 24);
  }, [cutIndex, fullDeck]);

  const selectCard = (card: TarotCard) => {
    if (phase !== 'choose') return;
    if (selected.some((item) => item.card.id === card.id)) return;
    if (selected.length >= drawCount) return;

    touchFeedback();
    setLastPickedId(card.id);

    const next: DrawnCard[] = [
      ...selected,
      {
        card,
        isReversed: getRandomReversal(),
        positionLabel: positions[selected.length]?.label || '',
      },
    ];

    setSelected(next);
    if (next.length === drawCount) setPhase('ready');
  };

  if (phase === 'cut') {
    return (
      <div className="flex w-full max-w-3xl flex-col items-center gap-9 px-4">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.24em] text-white/20">{spreadName}</p>
          <h2 className="mt-4 text-lg font-normal tracking-[0.2em] text-white/70">
            先切牌
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/34">
            像现实里的占卜一样，先把牌堆分开。不用想太久，选你第一眼想触碰的那一叠。
          </p>
        </div>

        <div className="grid w-full max-w-xl grid-cols-3 gap-3">
          {cutOptions.map((option, index) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => {
                touchFeedback();
                setCutIndex(option.id);
                setPhase('choose');
              }}
              className="group relative flex h-36 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/18 hover:bg-white/[0.04]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.96 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              {[0, 1, 2].map((layer) => (
                <div
                  key={layer}
                  className="absolute h-24 w-16 rounded-lg border border-white/[0.08] bg-[#0c1228] transition-transform duration-500 group-hover:-translate-y-1"
                  style={{
                    transform: `translate(${layer * 4 - 4}px, ${layer * -5 + 5}px) rotate(${layer * 4 - 4}deg)`,
                    background:
                      'radial-gradient(circle at 50% 42%, rgba(185,204,255,0.13), transparent 34%), linear-gradient(145deg, #111731 0%, #050815 54%, #151b37 100%)',
                  }}
                />
              ))}
              <span className="absolute bottom-4 text-[10px] tracking-[0.18em] text-white/34 group-hover:text-white/62">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8 px-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.24em] text-white/20">{spreadName}</p>
        <h2 className="mt-4 text-xl font-normal tracking-[0.2em] text-white/72 md:text-2xl">
          {phase === 'ready' ? '牌已经到位' : `选择 ${drawCount} 张牌`}
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/34">
          {phase === 'ready'
            ? '你可以在这里多停一会儿。准备好了，再让回声开始解读。'
            : `已选择 ${selected.length} / ${drawCount}。在牌列里滑动，点你想翻开的牌。`}
        </p>
      </div>

      <div className="flex min-h-48 flex-wrap justify-center gap-4">
        {Array.from({ length: drawCount }).map((_, index) => {
          const item = selected[index];

          return (
            <div key={positions[index]?.label || index} className="flex flex-col items-center gap-2">
              <p className="text-[10px] tracking-[0.2em] text-white/[0.26]">
                {positions[index]?.label}
              </p>
              {item ? (
                <CardFace
                  card={item.card}
                  isReversed={item.isReversed}
                  isRevealed
                  compact
                  glowIntensity={0.8}
                />
              ) : (
                <div className="flex aspect-[7/12] w-[98px] items-center justify-center rounded-[10px] border border-dashed border-white/[0.08] text-[10px] tracking-[0.15em] text-white/16 md:w-[116px]">
                  待选
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phase !== 'ready' && (
        <div className="w-full max-w-5xl">
          <div className="mb-3 text-center text-[10px] tracking-[0.18em] text-white/18">
            向下滚动查看更多牌
          </div>
          <div
            data-card-grid-scroll
            className="grid max-h-[min(58vh,620px)] grid-cols-2 justify-items-center gap-3 overflow-y-auto overscroll-contain rounded-2xl border border-white/[0.055] bg-white/[0.018] p-3 pr-2 [scrollbar-width:thin] sm:grid-cols-3 md:max-h-none md:grid-cols-6 md:overflow-visible md:p-0 lg:grid-cols-8"
          >
            {visibleDeck.map((card, index) => {
              const used = selected.some((item) => item.card.id === card.id);
              const justPicked = lastPickedId === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: used ? 0.2 : 1,
                    y: 0,
                    scale: justPicked ? [1, 1.08, 1] : 1,
                  }}
                  transition={{ delay: index * 0.015, duration: 0.35 }}
                  className={`flex justify-center ${used ? 'pointer-events-none' : ''}`}
                >
                  <CardFace
                    card={card}
                    isReversed={false}
                    isRevealed={false}
                    compact
                    onClick={() => selectCard(card)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="max-w-md text-center text-sm leading-7 text-white/30">
              如果你想多看一会儿牌，也可以先停在这里。占卜不是抢答案，很多时候是等自己准备好听。
            </p>
            <button
              type="button"
              onClick={() => {
                touchFeedback();
                onAllRevealed(selected);
              }}
              className="rounded-full border border-white/12 bg-white/[0.055] px-7 py-3 text-sm tracking-[0.18em] text-white/72 transition-all duration-500 hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
            >
              开始解读
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
