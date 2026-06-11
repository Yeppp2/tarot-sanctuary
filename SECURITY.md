# Security Policy

## 支持范围

当前只维护 `main` 分支上的最新版本。

## 敏感信息

请不要在 issue、PR、commit、截图或日志中公开以下内容：

- `.env.local`
- `DEEPSEEK_API_KEY`
- Netlify 访问令牌
- 任何第三方 API Key 或 Secret

本项目的真实 API Key 应只保存在本地 `.env.local` 或 Netlify 后台环境变量中。

## 报告安全问题

如果你发现可能导致 API Key 泄露、服务端接口滥用或用户数据风险的问题，请不要直接创建公开 issue 暴露细节。

建议做法：

1. 先在 GitHub 上发起一个不包含敏感细节的 issue，说明“存在潜在安全问题”。
2. 等维护者确认联系方式后，再提供复现步骤和影响范围。

## 部署安全说明

正式网站通过 Netlify 部署。DeepSeek API 调用发生在服务端 API route 中，前端不应读取或暴露真实 API Key。
