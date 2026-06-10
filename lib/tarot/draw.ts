import { allCards, TarotCard } from './cards';

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
}

export function shuffleCards(cards: TarotCard[] = allCards): TarotCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(count: number): DrawnCard[] {
  return shuffleCards().slice(0, count).map((card) => ({
    card,
    isReversed: Math.random() > 0.5,
  }));
}

export function describeDrawnCard(dc: DrawnCard): string {
  const { card, isReversed } = dc;
  const orientation = isReversed ? '逆位' : '正位';
  const meaning = isReversed ? card.meaningReversed : card.meaningUpright;

  return `${card.name}（${orientation}）：关键词：${card.keywords.slice(0, 3).join('、')}；含义：${meaning}；象征：${card.symbolism}`;
}
