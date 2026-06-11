# 回声 Tarot Sanctuary

一个已经上线的塔罗牌阵解析 Web 应用。普通用户可以直接打开网站使用，不需要在本地安装或运行项目。

- 线上网站：[https://tarot-sanctuary.netlify.app/](https://tarot-sanctuary.netlify.app/)
- GitHub 仓库：[https://github.com/Yeppp2/tarot-sanctuary](https://github.com/Yeppp2/tarot-sanctuary)

## 项目简介

回声 Tarot Sanctuary 面向情绪陪伴、关系思考、财运趋势、事业学业和自我状态等场景。用户可以先选择主题和时间范围，再选择合适的牌阵，经过洗牌、切牌、抽牌后，由服务端调用 DeepSeek 生成克制、客观、偏心理分析风格的塔罗牌阵解析。

项目已通过 GitHub + Netlify 部署为公开网站。访问者只需要打开线上地址即可使用；本地运行主要用于开发、调试和二次开发。

## 核心功能

- 主题选择：感情关系、财运投资、事业工作、学业考试、自我状态。
- 时间范围：支持未来一个月、三个月、六个月、一年内等范围。
- 牌阵选择：根据问题场景选择不同牌阵，展示每张牌的牌位含义。
- 抽牌流程：包含洗牌、切牌、选牌和结果等待，贴近真实占卜流程。
- AI 解析：后端服务端调用 DeepSeek API，结合用户问题、背景、牌阵位置、牌名和正逆位生成解析。
- 结构化结果：输出总体结论、逐张牌分析、综合判断和行动建议。
- 历史记录：在本地保留近期占卜记录，方便回看。
- 移动端适配：支持手机端选牌、滑动和阅读体验。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- DeepSeek API
- Netlify

## 线上部署

本项目使用 GitHub + Netlify 自动部署：

- 生产网站：[https://tarot-sanctuary.netlify.app/](https://tarot-sanctuary.netlify.app/)
- 生产分支：`main`
- 构建命令：`npm run build`
- 发布目录：`.next`

每次推送到 GitHub 的 `main` 分支后，Netlify 会自动拉取代码、构建并发布最新版本。

项目根目录包含 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

## 环境变量

正式解析由服务端调用 DeepSeek API。真实 API Key 不会写入代码，也不会暴露给前端。

本地开发时，将 `.env.example` 复制为 `.env.local`：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-v4-flash
```

可选配置：

```env
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

部署到 Netlify 时，请在 Netlify 后台配置：

- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`，可选，默认使用 `deepseek-v4-flash`
- `DEEPSEEK_BASE_URL`，可选，默认使用 `https://api.deepseek.com`

安全说明：

- `.env.local` 只用于本地开发，不会提交到 GitHub。
- GitHub 仓库只保留 `.env.example` 作为占位示例。
- API Key 只存在于本地环境变量或 Netlify 后台环境变量中。
- 前端代码不会读取或展示真实 API Key。

## 本地开发

如果你想在本地调试或二次开发，可以运行：

```bash
npm install
npm run dev
```

然后打开：

```text
http://localhost:3000
```

本地抽牌解析需要在 `.env.local` 中配置 `DEEPSEEK_API_KEY`。如果没有配置，解析接口会提示配置缺失，不会生成假解析。

## 简历描述参考

> 独立开发并部署上线一款基于 Next.js 的塔罗牌阵解析 Web 应用，设计了从主题选择、时间范围确认、牌阵选择、洗牌切牌、抽牌到 AI 解析的完整交互流程。项目接入 DeepSeek API，并将系统提示词和 API Key 放在服务端处理，避免敏感信息暴露到前端。使用 TypeScript、Tailwind CSS 和 Framer Motion 构建响应式界面，适配移动端选牌与阅读体验；通过 GitHub + Netlify 实现公开部署和 `main` 分支自动发布。

## 后续计划

- 用户系统和跨设备历史同步。
- 使用 Supabase 或 Netlify Blobs 持久化保存占卜记录。
- 增加更细的牌义语料和不同主题的解析策略。
- 支持解读收藏、删除单条记录和导出分享图。
- 持续优化移动端选牌与结果页阅读体验。
