export interface SpreadDefinition {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
  drawCount: number;
  bestFor?: string;
  tradeoff?: string;
  topicTags?: string[];
}

export interface SpreadPosition {
  label: string;
  description: string;
}

export const spreads: Record<string, SpreadDefinition> = {
  single: {
    id: 'single',
    name: '单牌指引',
    description: '一张牌，一个当下的回应。适合只想先听一句话的时候。',
    bestFor: '适合问题还没整理好、只想先确认此刻的核心感受。',
    tradeoff: '速度最快，但信息量少，不适合拆复杂关系或长期趋势。',
    topicTags: ['self'],
    positions: [
      { label: '当下的回应', description: '这张牌回应你此刻最需要看见的部分' },
    ],
    drawCount: 1,
  },
  pastPresentFuture: {
    id: 'pastPresentFuture',
    name: '时间之河',
    description: '过去、现在、可能的方向。适合梳理一件事的来龙去脉。',
    bestFor: '适合看一件事从哪里来、现在卡在哪里、照这样走会往哪里去。',
    tradeoff: '结构清楚，适合三到六个月内的趋势；时间拉太长会变模糊。',
    topicTags: ['career', 'study', 'wealth', 'self'],
    positions: [
      { label: '过去', description: '已经发生，或仍在影响你的力量' },
      { label: '现在', description: '你此刻真正站着的位置' },
      { label: '可能的方向', description: '如果照这样走下去，接下来会浮现什么' },
    ],
    drawCount: 3,
  },
  love: {
    id: 'love',
    name: '关系回声',
    description: '适合关系、暧昧、想念、放不下，或你不知道该不该靠近的人。',
    bestFor: '适合看你、对方和关系本身三方状态。',
    tradeoff: '适合已有对象或具体关系；如果只是问桃花，信息会偏少。',
    topicTags: ['love'],
    positions: [
      { label: '你的心', description: '你此刻真实的感受和需求' },
      { label: '对方的位置', description: '对方在这段关系里的状态或能量' },
      { label: '关系本身', description: '你们之间正在形成的连接' },
    ],
    drawCount: 3,
  },
  emotion: {
    id: 'emotion',
    name: '情绪深处',
    description: '适合说不清、心里乱，只是想知道自己怎么了的时候。',
    bestFor: '适合情绪不清楚、想先被接住，再慢慢看触发点。',
    tradeoff: '更偏内在整理，不负责给外部事件做强预测。',
    topicTags: ['self'],
    positions: [
      { label: '情绪的源头', description: '真正触发你的地方' },
      { label: '它想告诉你', description: '这份情绪下面藏着的信号' },
      { label: '可以怎么相处', description: '今天可以先做的一点点事' },
    ],
    drawCount: 3,
  },
  destiny: {
    id: 'destiny',
    name: '路口十字',
    description: '适合选择、转折、卡住很久的问题。',
    bestFor: '适合看选择、阻碍、资源和下一步方向。',
    tradeoff: '信息比较全面，但需要用户给出一个明确处境。',
    topicTags: ['career', 'study', 'self'],
    positions: [
      { label: '你在哪里', description: '当下的处境' },
      { label: '挡住你的', description: '阻碍、担心，或你还没承认的东西' },
      { label: '托住你的', description: '支持、资源，或你已经拥有的力量' },
      { label: '前方的路', description: '下一步更可能打开的方向' },
    ],
    drawCount: 4,
  },
  loveFuture: {
    id: 'loveFuture',
    name: '桃花之镜',
    description: '适合看未来几个月是否会出现关系机会，以及自己是否准备好靠近。',
    bestFor: '适合“未来几个月会不会脱单、会遇到什么样的人、我该怎么调整”这类问题。',
    tradeoff: '五张牌能看见更多层次，但更适合一个主题内的连续问题。',
    topicTags: ['love'],
    positions: [
      { label: '你对关系的期待', description: '你心里真正筛选关系的标准' },
      { label: '外界机会', description: '未来时间范围里可能出现的接触机会' },
      { label: '行动状态', description: '你是否会主动进入社交或回应关系' },
      { label: '阻碍/消耗', description: '让关系进展变慢的现实或心理因素' },
      { label: '未来趋势', description: '这段时间内桃花与关系发展的整体走向' },
    ],
    drawCount: 5,
  },
  relationshipHeart: {
    id: 'relationshipHeart',
    name: '心之念',
    description: '适合围绕一个具体对象，看真心、想法、未来和关系阻碍。',
    bestFor: '适合“对方对我是否真心、我们有没有未来、关系能不能长久”这类问题。',
    tradeoff: '信息细，但必须有一个具体对象；不适合泛泛看桃花。',
    topicTags: ['love'],
    positions: [
      { label: '对方对我的心', description: '对方对你的真实态度或在意点' },
      { label: '他此刻的想法', description: '对方目前对关系的理解和顾虑' },
      { label: '未来意愿', description: '对方是否愿意把关系往未来推进' },
      { label: '阻碍/挑战', description: '关系之间正在卡住或消耗的地方' },
      { label: '关系能否长久', description: '如果照现状发展，关系的未来承载力' },
    ],
    drawCount: 5,
  },
  wealthTimeline: {
    id: 'wealthTimeline',
    name: '财运时间线',
    description: '适合看未来三到六个月的资金节奏、投入风险和保守建议。',
    bestFor: '适合“未来几个月财运如何、投资是否该谨慎、资金压力会不会变化”。',
    tradeoff: '三张牌适合看三到六个月趋势；如果要逐月看九个月，需要更长牌阵。',
    topicTags: ['wealth'],
    positions: [
      { label: '近期资金状态', description: '现在到未来一两个月的钱与安全感' },
      { label: '中段风险', description: '未来三到四个月需要警惕的投入或消耗' },
      { label: '后段走向', description: '未来五到六个月可能形成的结果和心态' },
    ],
    drawCount: 3,
  },
};

export function getSpread(id: string): SpreadDefinition | undefined {
  return spreads[id];
}

export const spreadList = Object.values(spreads);
