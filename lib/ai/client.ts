interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

type DeepSeekMessage = {
  role: 'system' | 'user';
  content: string;
};

export type DeepSeekErrorCode =
  | 'missing_api_key'
  | 'auth_failed'
  | 'timeout'
  | 'rate_limited'
  | 'service_unavailable'
  | 'bad_response'
  | 'request_failed';

interface DeepSeekErrorOptions {
  code: DeepSeekErrorCode;
  message: string;
  retryable: boolean;
  status?: number;
  cause?: unknown;
}

const REQUIRED_READING_SECTIONS = ['总体结论', '逐张牌分析', '综合判断', '行动建议'];
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 32000;
const RETRY_DELAYS_MS = [650, 1400];

export class DeepSeekError extends Error {
  code: DeepSeekErrorCode;
  retryable: boolean;
  status?: number;

  constructor(options: DeepSeekErrorOptions) {
    super(options.message);
    this.name = 'DeepSeekError';
    this.code = options.code;
    this.retryable = options.retryable;
    this.status = options.status;
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

function getDeepSeekConfig(): DeepSeekConfig {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
  };
}

export async function getAIResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const config = getDeepSeekConfig();

  if (!config.apiKey) {
    throw new DeepSeekError({
      code: 'missing_api_key',
      message: 'Missing DEEPSEEK_API_KEY',
      retryable: false,
    });
  }

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
  const firstPass = normalizeReadingOutput(await callDeepSeekAPIWithRetry(config, messages));

  if (hasRequiredSections(firstPass) && !hasBannedTerms(firstPass)) {
    return firstPass;
  }

  const repaired = normalizeReadingOutput(
    await callDeepSeekAPIWithRetry(config, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: buildRepairPrompt(userPrompt, firstPass) },
    ])
  );

  if (!hasRequiredSections(repaired)) {
    throw new DeepSeekError({
      code: 'bad_response',
      message: 'DeepSeek response did not include the required reading sections',
      retryable: true,
    });
  }

  return softenBannedTerms(repaired);
}

async function callDeepSeekAPIWithRetry(
  config: DeepSeekConfig,
  messages: DeepSeekMessage[]
): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await callDeepSeekAPI(config, messages);
    } catch (error) {
      lastError = error;
      const normalized = normalizeDeepSeekError(error);
      const shouldRetry = normalized.retryable && attempt < MAX_ATTEMPTS;

      if (!shouldRetry) {
        throw normalized;
      }

      await wait(RETRY_DELAYS_MS[attempt - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]);
    }
  }

  throw normalizeDeepSeekError(lastError);
}

async function callDeepSeekAPI(
  config: DeepSeekConfig,
  messages: DeepSeekMessage[]
): Promise<string> {
  const response = await fetchWithTimeout(
    `${config.baseUrl.replace(/\/$/, '')}/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 1900,
        temperature: 0.32,
        stream: false,
      }),
    },
    REQUEST_TIMEOUT_MS
  );

  if (!response.ok) {
    throw await createResponseError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new DeepSeekError({
      code: 'bad_response',
      message: 'DeepSeek response did not include reading content',
      retryable: true,
    });
  }

  return content.trim();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new DeepSeekError({
        code: 'timeout',
        message: 'DeepSeek request timed out',
        retryable: true,
        cause: error,
      });
    }

    throw new DeepSeekError({
      code: 'request_failed',
      message: 'Could not connect to DeepSeek',
      retryable: true,
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function createResponseError(response: Response): Promise<DeepSeekError> {
  const detail = await response.text().catch(() => '');
  const status = response.status;
  const detailSuffix = detail ? ` ${detail.slice(0, 240)}` : '';

  if (status === 401 || status === 403) {
    return new DeepSeekError({
      code: 'auth_failed',
      message: `DeepSeek authentication failed:${detailSuffix}`,
      retryable: false,
      status,
    });
  }

  if (status === 429) {
    return new DeepSeekError({
      code: 'rate_limited',
      message: `DeepSeek rate limit reached:${detailSuffix}`,
      retryable: true,
      status,
    });
  }

  if (status >= 500) {
    return new DeepSeekError({
      code: 'service_unavailable',
      message: `DeepSeek service unavailable:${detailSuffix}`,
      retryable: true,
      status,
    });
  }

  return new DeepSeekError({
    code: 'request_failed',
    message: `DeepSeek API error ${status}:${detailSuffix}`,
    retryable: false,
    status,
  });
}

function normalizeDeepSeekError(error: unknown): DeepSeekError {
  if (error instanceof DeepSeekError) return error;

  return new DeepSeekError({
    code: 'request_failed',
    message: error instanceof Error ? error.message : 'DeepSeek request failed',
    retryable: true,
    cause: error,
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeReadingOutput(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function hasRequiredSections(content: string): boolean {
  return REQUIRED_READING_SECTIONS.every((section) =>
    new RegExp(`(^|\\n)\\s*${section}\\s*[：:]`).test(content)
  );
}

function hasBannedTerms(content: string): boolean {
  return /必然|一定|注定/.test(content);
}

function softenBannedTerms(content: string): string {
  return content
    .replaceAll('不一定', '未必')
    .replaceAll('一定程度', '某种程度')
    .replaceAll('一定', '比较建议')
    .replaceAll('必然', '倾向于')
    .replaceAll('注定', '固定');
}

function buildRepairPrompt(originalPrompt: string, draft: string): string {
  return `请把下面这次塔罗解析整理成稳定的前端展示文本。

要求：
1. 不新增输入中没有的事实。
2. 不要使用“必然”“一定”“注定”等绝对词。
3. 只输出纯文本，不要 Markdown。
4. 必须保留且只保留四个段落标题：总体结论、逐张牌分析、综合判断、行动建议。
5. 每段控制在清晰、克制、可阅读的长度。

原始占卜输入：
${originalPrompt}

需要整理的草稿：
${draft}`;
}
