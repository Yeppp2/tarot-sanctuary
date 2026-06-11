import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekError, getAIResponse } from '@/lib/ai/client';
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
      return NextResponse.json(
        {
          error: '牌面信息不完整',
          message: '牌面信息不完整',
          code: 'invalid_cards',
          retryable: false,
        },
        { status: 400 }
      );
    }

    const spread = getSpread(spreadType);
    if (!spread) {
      return NextResponse.json(
        {
          error: '未知的牌阵类型',
          message: '未知的牌阵类型',
          code: 'invalid_spread',
          retryable: false,
        },
        { status: 400 }
      );
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
    const normalized = normalizeReadingError(error);

    return NextResponse.json(
      {
        error: normalized.message,
        message: normalized.message,
        code: normalized.code,
        retryable: normalized.retryable,
      },
      { status: normalized.status }
    );
  }
}

function normalizeReadingError(error: unknown) {
  if (error instanceof DeepSeekError) {
    if (error.code === 'missing_api_key') {
      return {
        message: 'DeepSeek 解析尚未配置，请先添加 DEEPSEEK_API_KEY。',
        code: error.code,
        retryable: false,
        status: 503,
      };
    }

    if (error.code === 'auth_failed') {
      return {
        message: 'DeepSeek 解析认证失败，请检查服务端 API Key 配置。',
        code: error.code,
        retryable: false,
        status: 503,
      };
    }

    if (error.code === 'timeout') {
      return {
        message: 'DeepSeek 解析连接超时。牌面已经保留，可以稍后继续重试同一组牌。',
        code: error.code,
        retryable: true,
        status: 504,
      };
    }

    if (error.code === 'rate_limited') {
      return {
        message: 'DeepSeek 当前请求较多。牌面已经保留，可以稍后继续重试同一组牌。',
        code: error.code,
        retryable: true,
        status: 503,
      };
    }

    return {
      message: error.retryable
        ? 'DeepSeek 解析暂时失败。牌面已经保留，可以稍后继续重试同一组牌。'
        : 'DeepSeek 解析暂时无法完成，请稍后重试。',
      code: error.code,
      retryable: error.retryable,
      status: error.retryable ? 502 : 503,
    };
  }

  return {
    message: 'DeepSeek 解析暂时失败。牌面已经保留，可以稍后继续重试同一组牌。',
    code: 'request_failed',
    retryable: true,
    status: 502,
  };
}
