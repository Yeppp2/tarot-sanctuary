import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ai/client';
import { buildReadingPrompt, buildSystemPrompt } from '@/lib/ai/prompt';
import { allCards, getCardByName } from '@/lib/tarot/cards';
import { DrawnCard } from '@/lib/tarot/draw';
import { getSpread } from '@/lib/tarot/spreads';
import { ReadingContext, normalizeReadingContext } from '@/lib/tarot/context';

interface ReadingRequestCard {
  id?: number;
  name: string;
  isReversed: boolean;
  positionLabel: string;
}

export async function POST(request: NextRequest) {
  const id = `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const body = await request.json();
    const {
      question = '',
      cards,
      spreadType = 'single',
      mode,
      mood,
      topic,
      timeRange,
      background,
      correction,
    } = body as {
      question?: string;
      mode?: string;
      mood?: string;
      topic?: ReadingContext['topic'];
      timeRange?: string;
      background?: string;
      correction?: string;
      cards?: ReadingRequestCard[];
      spreadType?: string;
    };

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: '牌面信息不完整' }, { status: 400 });
    }

    const spread = getSpread(spreadType);
    if (!spread) {
      return NextResponse.json({ error: '未知的牌阵类型' }, { status: 400 });
    }

    const drawnCards: DrawnCard[] = cards.map((c) => {
      const card =
        typeof c.id === 'number'
          ? allCards.find((item) => item.id === c.id)
          : getCardByName(c.name);

      return {
        card: card || allCards[0],
        isReversed: c.isReversed,
        positionLabel: c.positionLabel,
      };
    });

    const context = normalizeReadingContext({
      mode,
      mood,
      topic,
      timeRange,
      background,
      correction,
      question,
      spreadId: spreadType,
    });

    const reading = await getAIResponse(
      buildSystemPrompt(),
      buildReadingPrompt(question, drawnCards, spread, context)
    );

    return NextResponse.json({
      id,
      question,
      cards: drawnCards,
      reading,
      context,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Reading API error:', error);
    const message = error instanceof Error ? error.message : '';
    const isMissingKey = message.includes('DEEPSEEK_API_KEY');

    return NextResponse.json(
      {
        error: isMissingKey
          ? 'DeepSeek 解析尚未配置，请先添加 DEEPSEEK_API_KEY。'
          : 'DeepSeek 解析暂时失败，请稍后重试。',
      },
      { status: isMissingKey ? 503 : 502 }
    );
  }
}
