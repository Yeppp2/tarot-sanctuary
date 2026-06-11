import { DrawnCard } from '@/lib/tarot/draw';
import { SpreadDefinition } from '@/lib/tarot/spreads';
import { ReadingContext, topicLabels } from '@/lib/tarot/context';

function normalizePromptText(text: string): string {
  return text
    .replaceAll('不一定', '未必')
    .replaceAll('一定程度', '某种程度')
    .replaceAll('一定', '较强')
    .replaceAll('必然', '明显')
    .replaceAll('注定', '固定');
}

export function buildSystemPrompt(): string {
  return `你是一名克制、客观、偏心理分析风格的塔罗牌阵解读师。你的解读应基于牌义、正逆位、牌位关系和用户问题进行分析。

要求：
- 不要神化，不要绝对化预测未来。
- 不要使用“必然”“一定”“注定”等绝对词。
- 输出里不要出现这些词本身，即使是否定表达也避免；可以改用“未必”“倾向于”“可能”“显示出”等表达。
- 语气中肯、清晰、有边界感。
- 可以指出积极和消极倾向，但不要故意讨好用户。
- 感情、财运、事业类问题，只做趋势分析和自我反思建议。
- 涉及医疗、法律、投资等高风险问题时，提醒用户寻求专业人士意见。
- 输出必须稳定保留四个标题：总体结论、逐张牌分析、综合判断、行动建议。
- 每段要精简，避免长篇铺陈；重点解释牌位、牌义、用户背景之间的关系。
- 语言风格自然，不要像AI模板文。`;
}

export function buildReadingPrompt(
  question: string,
  drawnCards: DrawnCard[],
  spread: SpreadDefinition,
  context: ReadingContext = {}
): string {
  const cardDescriptions = drawnCards
    .map((dc, index) => {
      const pos = spread.positions[index];
      const orientation = dc.isReversed ? '逆位' : '正位';
      const meaning = normalizePromptText(dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright);
      const keywords = dc.card.keywords.join('、');

      return [
        `第 ${index + 1} 张牌`,
        `牌名：${dc.card.name}（${dc.card.nameEn}）`,
        `正逆位：${orientation}`,
        `牌位：${dc.positionLabel || pos.label}`,
        `牌位含义：${pos.description}`,
        `关键词：${keywords}`,
        `基础牌义：${meaning}`,
        `象征信息：${normalizePromptText(dc.card.symbolism)}`,
      ].join('\n');
    })
    .join('\n\n');

  const entryDescription =
    context.mode === 'quiet'
      ? '用户选择了不说出具体问题。尊重这种沉默，不要追问，不要假装知道发生了什么。'
      : context.mode === 'feeling'
        ? `用户没有说具体问题，只选择了当前心情：“${context.mood || '说不清'}”。围绕这个状态回应，不要编造具体事件。`
        : '用户愿意说一点。回应用户说出的内容，但不要把它分析得像报告。';

  const topic = context.topic ? topicLabels[context.topic] : '未限定';
  const background = context.background?.trim() || '用户没有提供更多背景。不要编造事实，只能根据牌面和问题谨慎推断。';
  const correction = context.correction?.trim()
    ? `\n用户后续补充/纠正：${context.correction.trim()}\n请优先用这条信息校准解读，不要继续沿用被纠正前的假设。`
    : '';

  return `请基于以下信息完成一次塔罗牌阵解析。不要补充输入中没有的事实。

【用户问题】
${question || '用户没有说出口的问题'}

【问题主题】
${topic}

【时间范围】
${context.timeRange || '未限定'}

【用户入口状态】
${entryDescription}

【用户背景】
${background}${correction}

【牌阵类型】
${spread.name}

【牌阵说明】
${spread.description}

【牌阵取舍】
${spread.tradeoff || '问题越具体，解读越容易贴近现实。'}

【抽到的牌】
${cardDescriptions}

【输出要求】
请只输出纯文本，不要输出 Markdown 符号。
必须按以下四个标题输出，标题文字不要改：
总体结论：用 2-4 句话直接回答用户问题，说明主要趋势和不确定性。
逐张牌分析：按抽牌顺序逐张分析。每张牌都必须提到牌名、正逆位、牌位含义、基础牌义，以及它对用户问题和背景的对应判断。
综合判断：把牌位关系串联起来，说明整体倾向、矛盾点和需要留意的边界。
行动建议：给出 3-5 条克制、现实、可执行的建议。涉及医疗、法律、投资等高风险问题时，提醒寻求专业人士意见。

不要寒暄，不要自称 AI，不要使用“必然”“一定”“注定”等词。`;
}
