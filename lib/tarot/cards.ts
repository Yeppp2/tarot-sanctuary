export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  symbolism: string;
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
}

const majorData = [
  ['愚者', 'The Fool', '0', 'air', ['开始', '自由', '未知'], '新的旅程正在展开，适合轻一点地迈出第一步。', '可能有些冲动，也可能还没看清脚下的路。', '年轻人站在悬崖边，提醒人带着信任进入未知。'],
  ['魔术师', 'The Magician', 'I', 'air', ['行动', '资源', '显化'], '你手里其实已经有能开始的东西，只差把它用起来。', '想法很多，但可能缺少真正落地的一步。', '桌上的四元素象征可调用的资源与专注力。'],
  ['女祭司', 'The High Priestess', 'II', 'water', ['直觉', '沉默', '秘密'], '答案不急着说出来，先听身体和直觉的反应。', '你可能忽略了已经知道的事，或把真实感受压下去了。', '帷幕前的女祭司守着尚未揭开的真相。'],
  ['皇后', 'The Empress', 'III', 'earth', ['滋养', '创造', '感受'], '需要被照顾的部分正在浮现，也可能有新的创造力在生长。', '你给了别人很多，却忘了给自己留一点温柔。', '丰盛的花园象征身体、自然与养分。'],
  ['皇帝', 'The Emperor', 'IV', 'fire', ['边界', '秩序', '掌控'], '现在需要一点结构，先把边界和规则放清楚。', '过度控制会让事情变硬，也会让你更紧。', '石座上的皇帝象征秩序、责任和稳定。'],
  ['教皇', 'The Hierophant', 'V', 'earth', ['传统', '信念', '学习'], '可以向经验、规则或可信的人求助，不必一个人摸索。', '也许你正被某种“应该”困住，需要重新确认自己的信念。', '教皇象征传承、仪式和被教导的智慧。'],
  ['恋人', 'The Lovers', 'VI', 'air', ['选择', '关系', '价值'], '真正的问题也许不是爱不爱，而是你要站在哪个价值里。', '你可能在迎合、犹豫，或害怕承认自己的选择。', '两个人站在天使下方，象征关系与选择同时发生。'],
  ['战车', 'The Chariot', 'VII', 'water', ['前进', '意志', '方向'], '把相反的力量拉到同一个方向，事情就能往前走。', '越急着控制，越容易被情绪带偏。', '战车由两股力量牵引，考验驾驭内在冲突的能力。'],
  ['力量', 'Strength', 'VIII', 'fire', ['勇气', '耐心', '温柔'], '这不是硬撑的时候，温柔但坚定反而更有力量。', '你可能把脆弱误认为失败，其实只是需要休息。', '女人安抚狮子，象征柔软对本能的驯服。'],
  ['隐士', 'The Hermit', 'IX', 'earth', ['独处', '寻找', '内省'], '退后一步不是逃避，而是为了听清自己的声音。', '孤立太久会让答案变窄，必要时也要让别人靠近。', '隐士提灯走在雪山上，寻找自己的光。'],
  ['命运之轮', 'Wheel of Fortune', 'X', 'fire', ['转折', '循环', '机会'], '局面正在转动，你不必抓住每一个细节。', '抗拒变化会让你更辛苦，先看清循环在哪里。', '转动的轮盘象征变化、因果和时机。'],
  ['正义', 'Justice', 'XI', 'air', ['真相', '公平', '决定'], '把事实和情绪分开摆，你会更接近清楚的判断。', '如果一直回避责任，事情会用别的方式回来。', '天平和剑象征判断、真相与后果。'],
  ['倒吊人', 'The Hanged Man', 'XII', 'water', ['暂停', '换角度', '放手'], '暂时停住也许是必要的，换个角度会看到别的路。', '你可能在无意义地牺牲，却没有真正选择。', '倒挂的人平静等待，象征暂停中的领悟。'],
  ['死神', 'Death', 'XIII', 'water', ['结束', '转化', '放下'], '某个阶段正在结束，这不一定坏，只是不能再照旧。', '拖着不放会让新的东西进不来。', '白马上的死神象征不可避免的转化。'],
  ['节制', 'Temperance', 'XIV', 'fire', ['平衡', '调和', '耐心'], '别急着走极端，慢慢调和反而更有效。', '失衡来自太用力，也可能来自长期忽略自己的节奏。', '天使在两个杯子之间倒水，象征分寸和融合。'],
  ['恶魔', 'The Devil', 'XV', 'earth', ['束缚', '欲望', '依赖'], '看清是什么让你离不开，比立刻挣脱更重要。', '某种关系、习惯或执念正在消耗你的自由。', '松动的锁链提醒人：束缚有时比想象中脆弱。'],
  ['高塔', 'The Tower', 'XVI', 'fire', ['崩塌', '真相', '释放'], '有些结构撑不住了，倒下之后才会露出真实。', '越想维持表面的稳定，冲击可能越大。', '被闪电击中的高塔象征突然醒来。'],
  ['星星', 'The Star', 'XVII', 'air', ['希望', '疗愈', '安静'], '你需要一点恢复的时间，不必立刻证明自己没事。', '失望遮住了希望，但希望并没有完全消失。', '星光下倒水的女人象征疗愈与信任。'],
  ['月亮', 'The Moon', 'XVIII', 'water', ['不安', '梦境', '迷雾'], '现在还看不清全部，先别急着给自己定罪。', '恐惧可能放大了问题，也可能提醒你留意细节。', '月光、狗与水中的生物象征潜意识和不确定。'],
  ['太阳', 'The Sun', 'XIX', 'fire', ['清晰', '喜悦', '坦然'], '事情会变得更明亮，简单一点反而接近答案。', '你可能暂时看不见光，但不是没有光。', '太阳下的孩子象征坦率、生命力和清楚。'],
  ['审判', 'Judgement', 'XX', 'fire', ['唤醒', '回应', '重生'], '有个声音在叫你醒来，不是催你，是提醒你别再装作没听见。', '你可能还在害怕做出回应。', '号角声象征内在召唤与重新开始。'],
  ['世界', 'The World', 'XXI', 'earth', ['完成', '整合', '圆满'], '一个阶段正在收束，你可以承认自己走了很远。', '差最后一点整合，不必急着开启下一段。', '花环中的舞者象征完成、循环与新的起点。'],
] as const;

const majorArcana: TarotCard[] = majorData.map(
  ([name, nameEn, number, element, keywords, meaningUpright, meaningReversed, symbolism], id) => ({
    id,
    name,
    nameEn,
    arcana: 'major',
    number,
    element,
    keywords: [...keywords],
    meaningUpright,
    meaningReversed,
    symbolism,
  })
);

const suitConfig = {
  wands: {
    cn: '权杖',
    en: 'Wands',
    element: 'fire' as const,
    keywords: ['行动', '热情', '创造'],
    theme: '行动力、热情、欲望和开始做的冲动',
  },
  cups: {
    cn: '圣杯',
    en: 'Cups',
    element: 'water' as const,
    keywords: ['情感', '关系', '感受'],
    theme: '情绪、亲密、关系和心里的波动',
  },
  swords: {
    cn: '宝剑',
    en: 'Swords',
    element: 'air' as const,
    keywords: ['想法', '真相', '冲突'],
    theme: '思考、沟通、判断和刺痛人的真相',
  },
  pentacles: {
    cn: '星币',
    en: 'Pentacles',
    element: 'earth' as const,
    keywords: ['现实', '资源', '稳定'],
    theme: '现实生活、身体、金钱、工作和安全感',
  },
};

const ranks = [
  { number: '1', cn: '王牌', en: 'Ace', keywords: ['开始', '机会'], upright: '一颗新的种子已经出现，先认真看见它。', reversed: '机会还在，但能量没有完全落地。', symbol: '云端伸出的手递来第一份礼物。' },
  { number: '2', cn: '二', en: 'Two', keywords: ['选择', '平衡'], upright: '你站在两个方向之间，需要先承认自己的犹豫。', reversed: '摇摆太久会让身体比头脑更紧。', symbol: '两股力量并排出现，等待你决定如何回应。' },
  { number: '3', cn: '三', en: 'Three', keywords: ['展开', '合作'], upright: '事情开始向外展开，别一个人闷着做完全部。', reversed: '沟通或协作里有些地方还没对齐。', symbol: '第三个点出现后，局面有了结构。' },
  { number: '4', cn: '四', en: 'Four', keywords: ['稳定', '边界'], upright: '先把基础稳住，安全感会从秩序里回来。', reversed: '稳定可能变成僵硬，留一点呼吸的空间。', symbol: '四角撑起一个暂时可靠的空间。' },
  { number: '5', cn: '五', en: 'Five', keywords: ['冲突', '缺口'], upright: '不舒服的地方正在提醒你：这里需要被处理。', reversed: '冲突可以慢慢收束，但别假装它没发生。', symbol: '中间的缺口让真实问题露出来。' },
  { number: '6', cn: '六', en: 'Six', keywords: ['修复', '流动'], upright: '你正在从紧绷里慢慢过渡，不用一步到位。', reversed: '旧事还牵着你，离开需要一点时间。', symbol: '水面或道路把人带向较平静的地方。' },
  { number: '7', cn: '七', en: 'Seven', keywords: ['试炼', '立场'], upright: '你需要守住自己的位置，即使别人暂时不理解。', reversed: '太久的防御会耗尽你，先分清哪些值得守。', symbol: '一个人站在压力面前，确认自己的立场。' },
  { number: '8', cn: '八', en: 'Eight', keywords: ['推进', '练习'], upright: '重复不是白费，它正在让你更熟、更稳。', reversed: '进展卡住时，先看节奏是不是太满。', symbol: '八个符号排成节奏，像持续向前的练习。' },
  { number: '9', cn: '九', en: 'Nine', keywords: ['临界', '积累'], upright: '你已经走了很久，别否认这份积累。', reversed: '疲惫是真的，休息不是退步。', symbol: '接近完成的地方，也最容易感到紧。' },
  { number: '10', cn: '十', en: 'Ten', keywords: ['完成', '负荷'], upright: '一个周期快到头了，也许该卸下一些重量。', reversed: '放手不是失败，是让自己从过载里回来。', symbol: '十个符号堆到极限，提醒人收束。' },
  { number: 'Page', cn: '侍从', en: 'Page', keywords: ['学习', '消息'], upright: '新的理解正在形成，先允许自己像初学者。', reversed: '好奇心还在，但方向需要再清楚一点。', symbol: '年轻的信使带来某种刚开始的可能。' },
  { number: 'Knight', cn: '骑士', en: 'Knight', keywords: ['行动', '追寻'], upright: '这股能量想要往前走，关键是别失去方向。', reversed: '冲得太快时，容易忘了自己为什么出发。', symbol: '骑士带着一种正在移动的力量。' },
  { number: 'Queen', cn: '王后', en: 'Queen', keywords: ['成熟', '照料'], upright: '你可以更温柔也更清醒地照顾这件事。', reversed: '把所有人都照顾好之前，先看看自己还剩多少。', symbol: '王后守着一种成熟、细腻的力量。' },
  { number: 'King', cn: '国王', en: 'King', keywords: ['掌控', '承担'], upright: '成熟的力量不是压住一切，而是承担该承担的部分。', reversed: '掌控欲可能正在遮住真正的需求。', symbol: '国王坐在王座上，考验人如何使用力量。' },
];

const minorArcana: TarotCard[] = (Object.entries(suitConfig) as Array<[NonNullable<TarotCard['suit']>, typeof suitConfig.wands]>)
  .flatMap(([suit, config], suitIndex) =>
    ranks.map((rank, rankIndex) => ({
      id: 22 + suitIndex * ranks.length + rankIndex,
      name: `${config.cn}${rank.cn}`,
      nameEn: `${rank.en} of ${config.en}`,
      arcana: 'minor' as const,
      suit,
      number: rank.number,
      element: config.element,
      keywords: [...rank.keywords, ...config.keywords].slice(0, 5),
      meaningUpright: `${rank.upright}这张牌也和${config.theme}有关。`,
      meaningReversed: `${rank.reversed}它提醒你重新看待${config.theme}。`,
      symbolism: `${rank.symbol}${config.cn}对应${config.theme}。`,
    }))
  );

export const allCards: TarotCard[] = [...majorArcana, ...minorArcana];
export const majorArcanaCards = majorArcana;
export const minorArcanaCards = minorArcana;

export function getCardByName(name: string): TarotCard | undefined {
  return allCards.find((c) => c.name === name);
}

export function getCardsByArcana(arcana: 'major' | 'minor'): TarotCard[] {
  return allCards.filter((c) => c.arcana === arcana);
}

export function getCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): TarotCard[] {
  return minorArcana.filter((c) => c.suit === suit);
}
