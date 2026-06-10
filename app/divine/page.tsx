'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTransition from '@/components/shared/PageTransition';
import ShuffleAnimation from '@/components/divine/ShuffleAnimation';
import CardDeck from '@/components/divine/CardDeck';
import RitualTransition from '@/components/divine/RitualTransition';
import LoadingRitual from '@/components/shared/LoadingRitual';
import { DrawnCard } from '@/lib/tarot/draw';
import { getSpread } from '@/lib/tarot/spreads';
import { saveReading } from '@/lib/store/history';
import { ReadingContext, topicLabels } from '@/lib/tarot/context';

type Phase = 'prepare' | 'shuffle' | 'select' | 'ritual' | 'ai-wait' | 'error';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DivinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const question = searchParams.get('q') || '';
  const spreadId = searchParams.get('spread') || 'single';
  const mode = searchParams.get('mode') || 'quiet';
  const mood = searchParams.get('mood') || '';
  const topic = (searchParams.get('topic') || 'self') as ReadingContext['topic'];
  const timeRange = searchParams.get('timeRange') || '';
  const background = searchParams.get('background') || '';
  const context: ReadingContext = useMemo(
    () => ({
      mode,
      mood,
      topic,
      timeRange,
      background,
      question,
      spreadId,
    }),
    [mode, mood, topic, timeRange, background, question, spreadId]
  );

  const [phase, setPhase] = useState<Phase>('prepare');
  const spread = useMemo(() => getSpread(spreadId), [spreadId]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShuffleComplete = useCallback(() => {
    setPhase('select');
  }, []);

  const handleAllRevealed = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setPhase('ritual');
  }, []);

  const handleRitualComplete = useCallback(async () => {
    setErrorMessage('');
    setPhase('ai-wait');

    try {
      const [res] = await Promise.all([
        fetch('/api/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            mode,
            mood,
            topic,
            timeRange,
            background,
            cards: drawnCards.map((dc) => ({
              id: dc.card.id,
              name: dc.card.name,
              isReversed: dc.isReversed,
              positionLabel: dc.positionLabel,
            })),
            spreadType: spreadId,
          }),
        }),
        wait(7600),
      ]);

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reading) {
        throw new Error(data.error || 'Reading request failed');
      }

      saveReading({
        id: data.id,
        question,
        spreadType: spreadId,
        cards: drawnCards,
        reading: data.reading,
        context,
        timestamp: data.timestamp,
      });

      router.push(`/reading/${data.id}`);
    } catch (err) {
      console.error('Reading API error:', err);
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : 'DeepSeek 解析暂时失败，请稍后重试。'
      );
      setPhase('error');
    }
  }, [question, mode, mood, topic, timeRange, background, drawnCards, spreadId, context, router]);

  if (!spread) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm tracking-[0.2em] text-white/30">
            这组牌阵暂时没有回应。
          </p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className={`flex min-h-screen flex-col items-center px-4 py-16 ${
          phase === 'select' ? 'justify-start' : 'justify-center'
        }`}
      >
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <p className="text-[10px] tracking-[0.3em] text-white/[0.15]">
            {spread.name}
          </p>
          {mode === 'feeling' && mood && (
            <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-white/[0.24]">
              当前心情：{mood}
            </p>
          )}
        </div>

        {phase === 'prepare' && (
          <div className="flex w-full max-w-2xl flex-col items-center gap-7 rounded-[32px] border border-white/[0.07] bg-[#080c17]/72 px-5 py-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.35)] md:px-9 md:py-10">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-white/[0.18]">
                BEFORE SHUFFLE
              </p>
              <h1 className="mt-4 text-xl font-normal tracking-[0.18em] text-white/78 md:text-2xl">
                先把问题放稳
              </h1>
            </div>

            <div className="grid w-full gap-3 text-left md:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] tracking-[0.2em] text-white/22">主题与范围</p>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  {topicLabels[topic || 'self']} / {timeRange || '暂未限定'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] tracking-[0.2em] text-white/22">使用牌阵</p>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  {spread.name}，{spread.drawCount} 张牌
                </p>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left">
              <p className="text-[10px] tracking-[0.2em] text-white/22">确认的问题</p>
              <p className="mt-3 text-sm leading-7 text-white/58">
                {question || '没有说出口的问题'}
              </p>
              {background && (
                <>
                  <p className="mt-5 text-[10px] tracking-[0.2em] text-white/22">相关背景</p>
                  <p className="mt-3 text-sm leading-7 text-white/46">{background}</p>
                </>
              )}
            </div>

            <p className="max-w-lg text-sm leading-8 text-white/36">
              {mood === '焦虑' || mood === '迷茫'
                ? '不着急。先让呼吸慢一点，再在心里默念这个问题 6 遍。等你准备好了，再开始洗牌。'
                : '在心里默念这个问题 6 遍。不是为了让它变准，而是让这次抽牌有一个清楚的焦点。'}
            </p>

            <button
              type="button"
              onClick={() => setPhase('shuffle')}
              className="rounded-full border border-white/12 bg-white/[0.055] px-7 py-3 text-sm tracking-[0.18em] text-white/72 transition-all duration-500 hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
            >
              我准备好了，开始洗牌
            </button>
          </div>
        )}

        <ShuffleAnimation
          isShuffling={phase === 'shuffle'}
          onComplete={handleShuffleComplete}
        />

        {phase === 'select' && (
          <CardDeck
            drawCount={spread.drawCount}
            positions={spread.positions}
            spreadName={spread.name}
            onAllRevealed={handleAllRevealed}
          />
        )}

        <RitualTransition
          isActive={phase === 'ritual'}
          onComplete={handleRitualComplete}
        />

        <LoadingRitual isVisible={phase === 'ai-wait'} />

        {phase === 'error' && (
          <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-[28px] border border-white/[0.08] bg-[#090d19]/78 px-6 py-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.34)]">
            <p className="text-[10px] tracking-[0.28em] text-white/[0.18]">
              DEEPSEEK UNAVAILABLE
            </p>
            <h2 className="text-xl font-normal tracking-[0.14em] text-white/78">
              解析暂时没有连上
            </h2>
            <p className="text-sm leading-7 text-white/42">
              {errorMessage || 'DeepSeek 解析暂时失败，请稍后重试。'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleRitualComplete}
                className="rounded-full border border-white/12 bg-white/[0.055] px-5 py-2.5 text-xs tracking-[0.16em] text-white/70 transition-all duration-500 hover:border-white/24 hover:bg-white/[0.08] hover:text-white"
              >
                重试解析
              </button>
              <button
                type="button"
                onClick={() => setPhase('select')}
                className="rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-xs tracking-[0.16em] text-white/42 transition-all duration-500 hover:border-white/18 hover:text-white/62"
              >
                回到抽牌
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
