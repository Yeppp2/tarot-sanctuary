# Contributing

感谢你愿意关注这个项目。这个仓库是一个已通过 Netlify 上线的 Next.js 塔罗牌阵解析应用，正式体验地址是：

[https://tarot-sanctuary.netlify.app/](https://tarot-sanctuary.netlify.app/)

## 开发环境

```bash
npm install
npm run dev
```

本地访问：

```text
http://localhost:3000
```

如果需要测试真实 AI 解析，请复制 `.env.example` 为 `.env.local`，并填入自己的 DeepSeek API Key。

## 提交前检查

提交代码前请尽量运行：

```bash
npm run lint
npm run typecheck
npm run build
```

GitHub Actions 也会在 push 和 pull request 时自动运行这些检查。

## 贡献原则

- 不要提交 `.env.local`、真实 API Key、访问令牌或任何敏感信息。
- 不要随意重命名 Next.js 路由文件、组件文件或资源文件。
- 修改功能时尽量保持范围清晰，并说明修改原因。
- 涉及 DeepSeek、Netlify 或部署配置时，请在 PR 中说明是否需要额外环境变量。

## Pull Request 建议

PR 描述中请包含：

- 修改内容
- 验证方式
- 是否影响线上 Netlify 部署
- 是否新增或修改环境变量

## 正式部署

本项目正式部署在 Netlify。GitHub Pages 不承载完整应用，因为项目依赖服务端 API 来安全调用 DeepSeek。
