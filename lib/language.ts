const replacements: [string, string][] = [
  ['正在加载', '正在靠近那张牌'],
  ['提交成功', '这次占卜已经完成'],
  ['Error', '回应暂时断开了'],
  ['error', '回应暂时断开了'],
  ['AI助手', '回声'],
  ['系统提示', '提示'],
  ['分析结果', '解读'],
  ['历史记录', '过往回声'],
  ['开始占卜', '开始这次占卜'],
  ['提交', '开始'],
  ['请输入问题', '把话放在这里'],
  ['暂无数据', '暂时还没有回声'],
  ['正在生成', '回声正在整理这次牌面'],
  ['加载中', '请稍等'],
];

export function ritualize(text: string): string {
  let result = text;
  for (const [from, to] of replacements) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  return result;
}

export const ritualPhrases = [
  '先停一下，不用急着得到答案。',
  '牌面已经出现，回声正在把它说成人话。',
  '有些话需要慢一点，才不会伤到人。',
  '这次回应正在靠近你现在的状态。',
  '如果你还没准备好说清楚，也没关系。',
  '把呼吸放轻一点，答案会自己浮上来。',
  '回声正在整理牌面里的线索。',
  '有些问题不用立刻解决，先看见它就好。',
];

export function randomRitualPhrase(): string {
  return ritualPhrases[Math.floor(Math.random() * ritualPhrases.length)];
}
