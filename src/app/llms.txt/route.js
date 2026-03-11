export function GET() {
  const body = `# Anuma SDK

> Developer documentation for the Anuma SDK. Build AI apps with multi-model chat, persistent memory, streaming, and tools — one SDK across OpenAI, Anthropic, Google, xAI, and open-source models.

## Key Pages

- [Overview](https://docs.anuma.ai/): Getting started with the Anuma SDK
- [Authentication](https://docs.anuma.ai/authentication): How to authenticate users and obtain tokens
- [Conversations](https://docs.anuma.ai/conversations): Persistent conversation management
- [Streaming](https://docs.anuma.ai/streaming): Real-time streaming responses from AI models
- [Files and Images](https://docs.anuma.ai/files): File upload, image input, and multimodal support
- [Memory](https://docs.anuma.ai/memory): AI memory that persists across conversations and models
- [Tools](https://docs.anuma.ai/tools): Give AI models tools to call functions and APIs
- [Models](https://docs.anuma.ai/models/overview): Supported AI models and providers

## Tutorials

- [Quickstart](https://docs.anuma.ai/tutorials/quickstart): Build your first AI app with Anuma
- [Next.js Integration](https://docs.anuma.ai/tutorials/nextjs): Full Next.js tutorial
- [Telegram Bot](https://docs.anuma.ai/tutorials/telegram): Build an AI Telegram bot
- [AI Agent](https://docs.anuma.ai/tutorials/agent): Build an autonomous AI agent with tools

## SDK Packages

- [React SDK](https://docs.anuma.ai/sdk/react): React hooks for chat, memory, and streaming
- [Next.js SDK](https://docs.anuma.ai/sdk/next): Server-side helpers for Next.js
- [Expo SDK](https://docs.anuma.ai/sdk/expo): React Native / Expo integration
- [Vercel AI SDK](https://docs.anuma.ai/sdk/vercel): Vercel AI SDK adapter
- [API Client](https://docs.anuma.ai/sdk/client): Low-level TypeScript API client

## Links

- [Anuma Website](https://www.anuma.ai)
- [Anuma Web App](https://chat.anuma.ai)
- [Developer Dashboard](https://dashboard.anuma.ai)
- [GitHub](https://github.com/anuma-ai/sdk)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
