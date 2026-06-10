interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
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
    throw new Error('Missing DEEPSEEK_API_KEY');
  }

  return callDeepSeekAPI(config, systemPrompt, userPrompt);
}

async function callDeepSeekAPI(
  config: DeepSeekConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1400,
      temperature: 0.42,
      thinking: { type: 'disabled' },
      stream: false,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`DeepSeek API error: ${response.status}${detail ? ` ${detail}` : ''}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek response did not include reading content');
  }

  return content.trim();
}
