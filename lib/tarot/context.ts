import { spreads } from '@/lib/tarot/spreads';

export type ReadingTopic = 'love' | 'career' | 'study' | 'wealth' | 'self';

export interface ReadingContext {
  mode?: string;
  topic?: ReadingTopic;
  question?: string;
  timeRange?: string;
  background?: string;
  mood?: string;
  spreadId?: string;
  correction?: string;
}

export interface SpreadRecommendation {
  spreadId: string;
  name: string;
  cardCount: number;
  positions: string[];
  bestFor: string;
  tradeoff: string;
}

export const topicLabels: Record<ReadingTopic, string> = {
  love: '感情关系',
  career: '事业工作',
  study: '学业考试',
  wealth: '财运投资',
  self: '自我状态',
};

export const topicExamples: Record<ReadingTopic, string[]> = {
  love: [
    '未来半年我脱单的概率如何？',
    '对方对我是认真的吗？',
    '这段关系还有继续发展的空间吗？',
  ],
  career: [
    '未来三个月我的工作状态会怎么发展？',
    '现在这个机会值得继续投入吗？',
    '我该留在原方向，还是准备转向？',
  ],
  study: [
    '未来三个月我的学习状态如何？',
    '最近备考最需要注意什么？',
    '我和目标之间最大的阻碍是什么？',
  ],
  wealth: [
    '未来六个月我的财运如何？',
    '这段时间投资上最需要注意什么？',
    '目前的资金压力会怎么变化？',
  ],
  self: [
    '我最近为什么一直卡住？',
    '这份情绪真正想提醒我什么？',
    '我现在最需要先照顾哪一部分自己？',
  ],
};

export const backgroundPrompts: Record<ReadingTopic, string> = {
  love: '比如关系阶段、是否有暧昧/分开/追求、你现在最在意的点。',
  career: '比如目前岗位、机会来源、压力点、你正在犹豫的选择。',
  study: '比如考试节点、学习节奏、薄弱科目、你最近的状态。',
  wealth: '比如收入来源、投资类型、资金压力、是否有持仓或计划投入。',
  self: '比如最近反复出现的情绪、睡眠/关系/工作里的触发点。',
};

export const timeRangeOptions = ['未来一个月', '未来三个月', '未来六个月', '一年内'];

const recommendedByTopic: Record<ReadingTopic, string[]> = {
  love: ['loveFuture', 'relationshipHeart', 'love'],
  career: ['destiny', 'pastPresentFuture', 'single'],
  study: ['pastPresentFuture', 'destiny', 'single'],
  wealth: ['wealthTimeline', 'pastPresentFuture', 'single'],
  self: ['emotion', 'single', 'pastPresentFuture'],
};

export function getRecommendedSpreads(topic: ReadingTopic = 'self'): SpreadRecommendation[] {
  return recommendedByTopic[topic].map((spreadId) => {
    const spread = spreads[spreadId];

    return {
      spreadId,
      name: spread.name,
      cardCount: spread.drawCount,
      positions: spread.positions.map((position) => position.label),
      bestFor: spread.bestFor || spread.description,
      tradeoff: spread.tradeoff || '问题越具体，解读越容易贴近现实。',
    };
  });
}

export function hasConcreteQuestion(question = '') {
  const normalized = question.trim();
  if (!normalized) return false;

  return !/没有具体问题|不知道问什么|随便|都可以|先看看/.test(normalized);
}

export function normalizeReadingContext(input: Partial<ReadingContext>): ReadingContext {
  return {
    mode: input.mode || 'words',
    topic: input.topic || 'self',
    question: input.question || '',
    timeRange: input.timeRange || '',
    background: input.background || '',
    mood: input.mood || '',
    spreadId: input.spreadId || '',
    correction: input.correction || '',
  };
}
