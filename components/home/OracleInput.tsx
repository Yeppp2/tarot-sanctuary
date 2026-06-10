'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CosmicButton from '@/components/shared/CosmicButton';
import SpreadSelector from '@/components/divine/SpreadSelector';
import { getSpread } from '@/lib/tarot/spreads';
import {
  backgroundPrompts,
  getRecommendedSpreads,
  hasConcreteQuestion,
  ReadingTopic,
  timeRangeOptions,
  topicExamples,
  topicLabels,
} from '@/lib/tarot/context';

type EntryMode = 'quiet' | 'feeling' | 'words';

const entryModes: Array<{
  id: EntryMode;
  title: string;
  description: string;
}> = [
  {
    id: 'quiet',
    title: '先不说',
    description: '不用解释问题，让牌先回应此刻。',
  },
  {
    id: 'feeling',
    title: '带着一种感觉',
    description: '选一个现在的状态，不必讲原因。',
  },
  {
    id: 'words',
    title: '把话放在这里',
    description: '写一句也好，写很多也好。',
  },
];

const moods = ['迷茫', '焦虑', '想念', '犹豫', '疲惫', '期待'];
const topics: ReadingTopic[] = ['love', 'wealth', 'career', 'study', 'self'];

export default function OracleInput() {
  const [question, setQuestion] = useState('');
  const [entryMode, setEntryMode] = useState<EntryMode>('quiet');
  const [topic, setTopic] = useState<ReadingTopic>('love');
  const [timeRange, setTimeRange] = useState('未来六个月');
  const [background, setBackground] = useState('');
  const [selectedMood, setSelectedMood] = useState('迷茫');
  const [showSpreads, setShowSpreads] = useState(false);
  const recommendedSpreads = useMemo(() => getRecommendedSpreads(topic), [topic]);
  const recommendedIds = useMemo(
    () => recommendedSpreads.map((spread) => spread.spreadId),
    [recommendedSpreads]
  );
  const [selectedSpread, setSelectedSpread] = useState(recommendedSpreads[0].spreadId);
  const selectedSpreadInfo = useMemo(() => getSpread(selectedSpread), [selectedSpread]);
  const router = useRouter();

  const handleSubmit = () => {
    const trimmed = question.trim();
    const fallbackQuestion =
      entryMode === 'quiet'
        ? `我暂时没有具体问题，想先看看${topicLabels[topic]}在${timeRange}的趋势。`
        : `我现在更接近“${selectedMood}”这种状态，想看看${topicLabels[topic]}在${timeRange}的趋势。`;
    const finalQuestion = entryMode === 'words' && trimmed ? trimmed : fallbackQuestion;
    const mood = entryMode === 'feeling' ? selectedMood : '';
    const params = new URLSearchParams({
      q: finalQuestion,
      spread: selectedSpread,
      mode: entryMode,
      mood,
      topic,
      timeRange,
      background: background.trim(),
    });

    router.push(`/divine?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-4">
      <motion.h1
        className="text-center text-2xl font-normal leading-relaxed tracking-[0.18em] text-white/85 md:text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        不用急着解释自己
      </motion.h1>

      <motion.p
        className="max-w-xl text-center text-sm leading-8 text-white/38 md:text-base"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45, ease: 'easeOut' }}
      >
        可以先选主题，再慢慢把问题说清楚。回声会先确认范围，再让牌回应你真实的处境。
      </motion.p>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.52, ease: 'easeOut' }}
      >
        <p className="mb-3 text-center text-[10px] tracking-[0.24em] text-white/22">
          这次想看什么
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {topics.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTopic(item);
                setSelectedSpread(getRecommendedSpreads(item)[0].spreadId);
              }}
              className={`min-h-12 rounded-xl border px-3 text-xs tracking-[0.12em] transition-all duration-300 ${
                topic === item
                  ? 'border-white/22 bg-white/[0.07] text-white/76'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/36 hover:border-white/14'
              }`}
            >
              {topicLabels[item]}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid w-full grid-cols-1 gap-3 md:grid-cols-3"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.62, ease: 'easeOut' }}
      >
        {entryModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setEntryMode(mode.id)}
            className={`min-h-28 rounded-2xl border p-4 text-left transition-all duration-500 ${
              entryMode === mode.id
                ? 'border-white/22 bg-white/[0.07] shadow-[0_0_60px_rgba(154,180,255,0.08)]'
                : 'border-white/[0.06] bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.04]'
            }`}
          >
            <span className="block text-sm tracking-[0.16em] text-white/75">{mode.title}</span>
            <span className="mt-3 block text-xs leading-6 text-white/34">{mode.description}</span>
          </button>
        ))}
      </motion.div>

      {entryMode === 'feeling' && (
        <motion.div
          className="flex w-full flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={`rounded-full border px-4 py-2 text-xs tracking-[0.12em] transition-all duration-300 ${
                selectedMood === mood
                  ? 'border-white/24 bg-white/[0.08] text-white/80'
                  : 'border-white/[0.07] bg-white/[0.02] text-white/38 hover:border-white/14 hover:text-white/60'
              }`}
            >
              {mood}
            </button>
          ))}
        </motion.div>
      )}

      <motion.div
        className="grid w-full gap-4 md:grid-cols-[180px_1fr]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.72, ease: 'easeOut' }}
      >
        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-white/22">时间范围</p>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTimeRange(option)}
                className={`rounded-xl border px-3 py-2 text-xs tracking-[0.1em] transition-all duration-300 ${
                  timeRange === option
                    ? 'border-white/22 bg-white/[0.07] text-white/72'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/34 hover:border-white/14'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-white/22">相关背景</p>
          <textarea
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder={backgroundPrompts[topic]}
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/66 placeholder:text-white/[0.2] transition-all duration-500 focus:border-white/[0.18] focus:bg-white/[0.05] focus:outline-none"
          />
        </div>
      </motion.div>

      {entryMode === 'words' && (
        <motion.div
          className="relative w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="不用讲清楚。写一句、一个名字，或者一个你反复想起的画面。"
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 text-base leading-7 text-white/72 placeholder:text-white/[0.22] transition-all duration-700 focus:border-white/[0.18] focus:bg-white/[0.055] focus:outline-none"
            autoFocus
          />

          {question && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                boxShadow: '0 0 60px rgba(80,120,200,0.06), 0 0 120px rgba(80,120,200,0.03)',
              }}
            />
          )}

          {!hasConcreteQuestion(question) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topicExamples[topic].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuestion(example)}
                  className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] leading-5 text-white/38 transition-all duration-300 hover:border-white/14 hover:text-white/62"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="w-full text-center"
      >
        <button
          type="button"
          onClick={() => setShowSpreads(!showSpreads)}
          className="text-xs tracking-[0.2em] text-white/30 transition-colors duration-500 hover:text-white/50"
        >
          {showSpreads
            ? '收起牌阵'
            : `选择牌阵：${selectedSpreadInfo?.name || '未选择'} · ${selectedSpreadInfo?.drawCount || '?'} 张牌`}
        </button>

        {showSpreads && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 text-left"
          >
            <SpreadSelector
              selected={selectedSpread}
              recommendedIds={recommendedIds}
              onSelect={(id) => {
                setSelectedSpread(id);
                setShowSpreads(false);
              }}
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <CosmicButton onClick={handleSubmit}>开始这次占卜</CosmicButton>
      </motion.div>
    </div>
  );
}
