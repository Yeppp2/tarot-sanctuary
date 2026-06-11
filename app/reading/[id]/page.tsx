'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';
import CardReveal from '@/components/reading/CardReveal';
import OracleText from '@/components/reading/OracleText';
import { getReadingById, subscribeHistory, updateReading } from '@/lib/store/history';
import CosmicButton from '@/components/shared/CosmicButton';
import { ReadingContext, topicLabels } from '@/lib/tarot/context';

export default function ReadingPage() {
  const params = useParams();
  const id = params.id as string;

  const storedReading = useSyncExternalStore(
    subscribeHistory,
    () => getReadingById(id) || null,
    () => null
  );

  const reading = storedReading;

  const encodedQuestion = useMemo(
    () => encodeURIComponent(reading?.question || ''),
    [reading?.question]
  );
  const [correction, setCorrection] = useState('');
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrateError, setRecalibrateError] = useState('');

  const supplementHref = useMemo(() => {
    if (!reading) return '/';
    const context = reading.context || {};
    const params = new URLSearchParams({
      q: reading.question || '',
      spread: 'single',
      mode: 'words',
      topic: context.topic || 'self',
      timeRange: context.timeRange || '',
      background: context.background || '',
      mood: context.mood || '',
    });

    return `/divine?${params.toString()}`;
  }, [reading]);

  const handleRecalibrate = async () => {
    if (!reading || !correction.trim()) return;

    const nextContext: ReadingContext = {
      ...(reading.context || {}),
      question: reading.question,
      spreadId: reading.spreadType,
      correction: correction.trim(),
    };

    setIsRecalibrating(true);
    setRecalibrateError('');
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: reading.question,
          mode: nextContext.mode,
          mood: nextContext.mood,
          topic: nextContext.topic,
          timeRange: nextContext.timeRange,
          background: nextContext.background,
          correction: nextContext.correction,
          spreadType: reading.spreadType,
          cards: reading.cards.map((dc) => ({
            id: dc.card.id,
            name: dc.card.name,
            isReversed: dc.isReversed,
            positionLabel: dc.positionLabel,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.reading) {
        throw new Error(
          data.message ||
            data.error ||
            'DeepSeek 解析暂时失败。原解读已保留，可以稍后重试校准。'
        );
      }

      updateReading({
        ...reading,
        reading: data.reading,
        context: nextContext,
        timestamp: Date.now(),
      });
      setCorrection('');
    } catch (error) {
      console.warn('DeepSeek recalibration unavailable:', error);
      setRecalibrateError(
        error instanceof Error && error.message
          ? error.message
          : 'DeepSeek 解析暂时失败，请稍后重试。'
      );
    } finally {
      setIsRecalibrating(false);
    }
  };

  if (!reading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
          <p className="text-sm tracking-[0.2em] text-white/30">
            这次回声似乎已经散开了。
          </p>
          <Link href="/">
            <CosmicButton variant="secondary">回到首页</CosmicButton>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-10 md:py-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <header className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-[10px] tracking-[0.28em] text-white/[0.18]">
                READING
              </p>
              <h1 className="mt-4 text-2xl font-normal tracking-[0.18em] text-white/82 md:text-4xl">
                这次牌面已经打开
              </h1>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
              <p className="mb-3 text-[10px] tracking-[0.2em] text-white/22">
                你带来的问题
              </p>
              <p className="text-sm leading-7 text-white/52">
                {reading.question || '没有说出口的问题'}
              </p>
              {reading.context && (
                <div className="mt-5 grid gap-2 border-t border-white/[0.06] pt-4 text-[11px] leading-6 text-white/32">
                  <p>
                    {topicLabels[reading.context.topic || 'self']} / {reading.context.timeRange || '未限定时间'}
                  </p>
                  {reading.context.background && <p>{reading.context.background}</p>}
                  {reading.context.correction && (
                    <p className="text-white/46">已校准：{reading.context.correction}</p>
                  )}
                </div>
              )}
            </div>
          </header>

          <section className="w-full rounded-[30px] border border-white/[0.06] bg-white/[0.018] px-4 py-8 md:px-8 md:py-10">
            <CardReveal cards={reading.cards} />
          </section>

          <section className="w-full">
            <OracleText text={reading.reading} />
          </section>

          <section className="mx-auto w-full max-w-3xl rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-5 md:p-7">
            <p className="text-[10px] tracking-[0.24em] text-white/22">补充背景 / 校准解读</p>
            <p className="mt-3 text-sm leading-7 text-white/36">
              如果刚才有背景说少了，或者某个假设偏了，可以在这里补一句。回声会用同一组牌重新剖析，不会让你重抽。
            </p>
            <textarea
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder="例如：不是只有炒股，也有基金和加密货币；或者：我不是不主动，是最近准备实习没精力。"
              rows={3}
              className="mt-4 w-full resize-none rounded-2xl border border-white/[0.08] bg-[#080c17]/70 px-4 py-3 text-sm leading-7 text-white/66 placeholder:text-white/[0.18] transition-all duration-500 focus:border-white/[0.18] focus:bg-white/[0.04] focus:outline-none"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleRecalibrate}
                disabled={!correction.trim() || isRecalibrating}
                className="rounded-full border border-white/12 bg-white/[0.055] px-5 py-2.5 text-xs tracking-[0.16em] text-white/64 transition-all duration-500 hover:border-white/24 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {isRecalibrating ? '正在校准' : '重新校准'}
              </button>
            </div>
            {recalibrateError && (
              <p className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm leading-7 text-white/42">
                {recalibrateError}
              </p>
            )}
          </section>

          <footer className="flex flex-col items-center gap-6 pb-12">
            <div className="text-[10px] tracking-[0.2em] text-white/[0.14]">
              {new Date(reading.timestamp).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={supplementHref || `/divine?q=${encodedQuestion}&spread=single&mode=words`}>
                <CosmicButton variant="secondary">补充一张</CosmicButton>
              </Link>
              <Link href="/">
                <CosmicButton variant="secondary">再占一次</CosmicButton>
              </Link>
              <Link href="/history">
                <CosmicButton variant="secondary">暂时结束</CosmicButton>
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}
