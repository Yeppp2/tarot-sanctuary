# 回声 Tarot Sanctuary

一个面向情绪陪伴场景的塔罗占卜 Web 应用。用户不必一开始就说清楚自己的问题，可以选择沉默、选择当下状态，或者写下一段话，再通过切牌、抽牌、等待解读的流程得到回应。

## 核心功能

- 三种入口：不说具体问题、选择情绪、自由输入问题
- 多种牌阵：单牌、时间之河、关系回声、情绪深处、路口十字
- 真实抽牌流程：洗牌、切牌、选牌、等待解读
- Rider-Waite-Smith 高清牌面，78 张完整塔罗牌
- AI 解读接口，支持 DeepSeek、Claude、OpenAI/Netlify AI Gateway
- 本地兜底解读：模型不可用时仍能根据牌位、正逆位、元素、问题语境生成回应
- 历史记录：保留最近 50 次占卜
- 移动端抽牌体验：横向滑动牌列、触摸反馈、适配手机阅读

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Netlify deployment

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 配置真实模型

复制 `.env.example` 为 `.env.local`，然后选择一个 provider。

DeepSeek:

```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_key
DEEPSEEK_MODEL=deepseek-chat
```

Claude:

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_key
CLAUDE_MODEL=claude-sonnet-4-5-20250929
```

OpenAI or Netlify AI Gateway:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
```

在 Netlify AI Gateway 场景中，启用站点 AI Gateway 后，`OPENAI_BASE_URL` 可由 Netlify 注入。

## Netlify 部署

项目已经包含 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

部署前在 Netlify 后台配置环境变量：

- `AI_PROVIDER`
- `DEEPSEEK_API_KEY` 或 `ANTHROPIC_API_KEY` 或 OpenAI/Gateway 相关变量

## 简历描述参考

> 独立开发一款基于 Next.js 的塔罗情绪陪伴 Web 应用，设计了从情绪入口、洗牌切牌、抽牌到 AI 解读的完整交互流程。项目接入多模型 AI 解读接口，并实现本地兜底解读逻辑，保证模型不可用时仍能基于牌义、牌位、正逆位和用户语境生成回应。使用 TypeScript、Tailwind CSS 和 Framer Motion 构建响应式界面，并通过 Netlify 配置完成部署准备。

## 后续规划

- 用户系统和跨设备历史同步
- Supabase 或 Netlify Blobs 持久化存储
- 更细的牌义语料库：关系、事业、自我状态、行动建议
- 解读收藏、删除单条记录、导出分享图
- 更完整的移动端视觉 QA
