import { DrawnCard } from '@/lib/tarot/draw';
import { ReadingContext, topicLabels } from '@/lib/tarot/context';
import { SpreadDefinition } from '@/lib/tarot/spreads';

const suitVoice: Record<string, string> = {
  wands: '权杖是火。它说的通常不是情绪本身，而是行动、冲动、热度，以及一个人还想不想继续往前。',
  cups: '圣杯是水。它更靠近感情、依恋、期待，以及那些说出口之前先在心里起伏的东西。',
  swords: '宝剑是风。它关心事实、判断、沟通和刺痛人的念头，也关心你是不是把一句话反复想了太久。',
  pentacles: '星币是土。它落在现实里，关心时间、身体、钱、工作、安全感，以及一件事到底能不能稳稳地落下来。',
};

const contextVoice: Record<string, string> = {
  love: '放到感情里，它更像是在问：你是在靠近真实的人，还是在靠近自己脑中反复补完的画面。',
  career: '放到事业里，它提醒你先看清手里真正能动的部分，不要把所有重量都压在一次决定上。',
  study: '放到学业里，它更像是在看节奏、耐心和复盘方式，而不是只看一个结果。',
  wealth: '放到财运里，它不会替你判断某个产品一定涨跌，更像是在提醒资金节奏、风险暴露和投入边界。',
  self: '放到自我状态里，它不急着给结论，而是让你看见自己最近一直绕开的那一点。',
};

function orientationText(card: DrawnCard) {
  if (card.isReversed) {
    return `逆位的${card.card.name}会把这张牌的力量往里收。它不一定代表坏结果，更像是说：这件事还没有顺畅地表达出来，可能被拖延、压住，或者被某种防御挡住了。`;
  }

  return `正位的${card.card.name}表达得比较直接。它像是把这件事摆到桌面上，让你先看见它正在发生，而不是继续绕开。`;
}

function familyText(card: DrawnCard['card']) {
  if (card.arcana === 'major') {
    return '这是一张大阿尔卡纳。它通常不会只指向一个小细节，而是指向你正在经过的主题：一种选择、一段关系里的位置，或者你心里已经隐约知道却还没完全承认的事。';
  }

  return `这是一张小阿尔卡纳。${suitVoice[card.suit || 'wands']}`;
}

function contextLine(question: string, context: ReadingContext = {}) {
  if (context.topic && contextVoice[context.topic]) return contextVoice[context.topic];

  const q = question.toLowerCase();
  if (/[爱|喜欢|关系|暧昧|分手|复合|他|她|想念]/.test(q)) return contextVoice.love;
  if (/[钱|财|投资|股票|基金|币|收入|支出]/.test(q)) return contextVoice.wealth;
  if (/[工作|offer|实习|简历|事业|项目|选择]/i.test(q)) return contextVoice.career;
  if (/[学业|考试|学习|备考|论文|成绩]/.test(q)) return contextVoice.study;
  return contextVoice.self;
}

function positionIntro(card: DrawnCard, question: string, context: ReadingContext = {}) {
  const position = card.positionLabel || '这张牌';
  const orientation = card.isReversed ? '逆位' : '正位';
  const keywords = card.card.keywords.slice(0, 4).join('、');
  const meaning = card.isReversed ? card.card.meaningReversed : card.card.meaningUpright;

  return `${position}这里出现的是${card.card.name}，${orientation}。${familyText(card.card)}它的关键词是${keywords}。\n\n${orientationText(card)}放到这一次的问题里，它更像是在说：${meaning}\n\n${contextLine(question, context)}`;
}

function opening(question: string, context: ReadingContext = {}) {
  const topic = context.topic ? topicLabels[context.topic] : '这件事';
  const timeRange = context.timeRange ? `，时间放在${context.timeRange}` : '';
  const background = context.background?.trim();
  const correction = context.correction?.trim();

  if (!question || question.includes('暂时不想说出具体的问题')) {
    return `结论先轻轻放在前面：这组牌更像是在提醒你，${topic}${timeRange}里最重要的不是抢一个确定答案，而是先把范围收窄。你没有急着把问题讲清楚，这本身就是这次牌面的一部分。`;
  }

  return `结论先放在前面：围绕“${question}”${timeRange}，这组牌给出的更像是一种趋势，不是保证。${background ? `你补充的背景是：“${background}”，这会影响解读的重心。` : '你没有给太多背景，所以我会只贴着问题和牌位说，不替你编故事。'}${correction ? `你后面补充的“${correction}”要优先算进来，前面的假设需要跟着校准。` : ''}`;
}

function practicalAdvice(context: ReadingContext = {}) {
  if (context.topic === 'wealth') {
    return '现实建议放得具体一点：未来这段时间，别把塔罗当成买卖信号。它更适合提醒你控制仓位、减少冲动投入、提前想好最坏情况下自己能承受多少。';
  }

  if (context.topic === 'love') {
    return '现实建议是：先不要把“有没有结果”压成唯一答案。你可以观察自己是否真的愿意接触，也观察对方有没有稳定、具体、持续的回应。';
  }

  if (context.topic === 'career') {
    return '现实建议是：把能验证的事先拆小。不要只问方向对不对，先看下一步是否能带来更多信息、资源或行动空间。';
  }

  if (context.topic === 'study') {
    return '现实建议是：不要用一次状态判断整段学习。把节奏、薄弱点和复盘方式拉出来看，会比单纯焦虑结果更有用。';
  }

  return '现实建议是：先不要急着修复全部状态。把这组牌里最刺眼的一点记下来，今天只处理那一点就够了。';
}

function closing(cards: DrawnCard[], context: ReadingContext = {}) {
  const hasReversed = cards.some((card) => card.isReversed);
  const majorCount = cards.filter((card) => card.card.arcana === 'major').length;
  const timeRange = context.timeRange || '这段时间';

  if (cards.length === 1) {
    const card = cards[0];
    return [
      `如果只看这一张牌，重点不在“答案已经出来了”，而在它把你的注意力放到了${card.card.keywords[0] || '一个主题'}上。你可以先问自己：我现在是在逃开它，还是已经被它推着走了一段？`,
      hasReversed
        ? '逆位牌适合慢一点看。它常常不是叫你立刻行动，而是先承认哪里卡住了。承认卡住，本身就会让人松一点。'
        : '正位牌适合把事情看清楚一点。不是马上做决定，而是先别再假装自己什么都没感觉到。',
      practicalAdvice(context),
      `边界也要说清楚：一张牌只能看见${timeRange}里的一个核心提醒，它不是 100% 准确的预言。你可以继续问：这张牌让我最不舒服的地方，是不是正好也是我最需要看见的地方？`,
    ];
  }

  return [
    `把这几张牌放在一起看，${majorCount > 0 ? '大牌让这件事显得不只是日常小波动，它牵到了更深一点的选择或心理位置。' : '这组牌更贴近日常层面，说明答案可能藏在具体的沟通、行动、作息或关系互动里。'}`,
    hasReversed
      ? '里面出现逆位，说明有些能量没有顺着表达出来。也许你知道自己在意什么，但还没准备好承认；也许你已经累了，却还在逼自己保持清醒。'
      : '牌面整体比较顺，说明这件事不是完全无解。你更需要的是把已经看见的东西慢慢排好，而不是继续寻找一个更神奇的答案。',
    practicalAdvice(context),
    `边界也要说清楚：牌面显示的是${timeRange}里的趋势和提醒，不是保证。时间越远，现实变量越多，牌面就越应该被当成参考，而不是判决。`,
    '目前能从牌面里读出的主要信息就到这里。你可以停在这里，也可以补充背景来校准：刚才哪一句最贴近你，哪一句明显偏了？',
  ];
}

export function buildHumanReading(
  question: string,
  drawnCards: DrawnCard[],
  spreadOrName: SpreadDefinition | string,
  context: ReadingContext = {}
) {
  const spreadName = typeof spreadOrName === 'string' ? spreadOrName : spreadOrName.name;
  const spreadDescription =
    typeof spreadOrName === 'string' ? '' : `它的取舍是：${spreadOrName.tradeoff || spreadOrName.description}`;
  const sections = [
    opening(question, context),
    `这次用的是“${spreadName}”。牌阵给牌一个位置，所以同一张牌落在不同地方，说话的重心也会变。${spreadDescription}`,
    ...drawnCards.map((card) => positionIntro(card, question, context)),
    ...closing(drawnCards, context),
  ];

  return sections.join('\n\n');
}
