export function GET() {
  const body = `# Anuma SDK — Full Documentation for LLMs

> Developer documentation for the Anuma SDK. Build AI apps with multi-model chat, persistent memory, streaming, and tools — one SDK across OpenAI, Anthropic, Google, xAI, and open-source models.

## Overview

The Anuma SDK lets developers build AI-powered applications with a unified API across multiple model providers. Switch providers without changing code. Add memory that persists across sessions. Give models tools to search the web, manage calendars, and call custom functions.

Website: https://www.anuma.ai
Documentation: https://docs.anuma.ai
Developer Dashboard: https://dashboard.anuma.ai
GitHub: https://github.com/anuma-ai/sdk

## Quick Start

\`\`\`tsx
import { useChat } from "@anuma/sdk/react";

const { sendMessage, isLoading } = useChat({
  getToken: async () => authToken,
  onData: (chunk) => setResponse((prev) => prev + chunk),
});

await sendMessage({
  messages: [{ role: "user", content: [{ type: "text", text: "Hello!" }] }],
  model: "gpt-4o-mini",
});
\`\`\`

For persistent conversations with message history, use \`useChatStorage\` which adds automatic storage on top of \`useChat\`.

## Authentication

Apps authenticate via tokens obtained from the Anuma developer dashboard at dashboard.anuma.ai. Create an app, get an API key, and use it to generate user tokens. Supports Privy for end-user authentication with email, Google, Apple login, and embedded wallets.

## Conversations

Conversations are persistent chat threads with full message history. The SDK handles creation, retrieval, message storage, and deletion. Messages support text, images, files, and tool calls. Use \`useChatStorage\` for automatic conversation persistence or \`useChat\` for ephemeral sessions.

## Streaming

All model responses stream by default. The SDK provides real-time token-by-token streaming via callbacks (\`onData\`), with support for abort/cancel, error handling, and automatic retries. Works with all supported model providers.

## Files and Images

Upload files and images to include in conversations. Supports image input for vision-capable models (GPT-4o, Claude, Gemini). File types include images (JPEG, PNG, WebP, GIF), PDFs, and text documents. Files are stored securely and referenced by URL in message content.

## Memory

### Memory Engine
AI memory that persists across conversations and models. The memory engine automatically extracts and stores relevant context from conversations, making it available to future sessions. Memory works across different AI models — context learned with GPT-4o is available when switching to Claude or Gemini.

### Memory Vault
Encrypted memory storage where users own their data. Memory is encrypted client-side before storage. Users can export, delete, or migrate their memory at any time. The vault ensures privacy while maintaining cross-session context.

## Tools

### Overview
Give AI models the ability to call functions, APIs, and external services. Tools follow the OpenAI function calling format and work across all supported models. Define tool schemas, handle invocations, and return results.

### Server-Side Tools
Built-in tools that run server-side: web search, calendar management, email, and more. These are managed by Anuma and require no additional setup.

### Client-Side Tools
Custom tools defined in your application code. Register tool schemas and handlers, and the SDK routes tool calls to your implementation. Supports synchronous and asynchronous handlers.

### Available Tools
Pre-built tools include: web search, Google Calendar, Gmail, file management, code execution, and more. Each tool has configurable permissions and scoping.

## Models

### Supported Providers
- **OpenAI**: GPT-4o, GPT-4o-mini, o1, o3, o4-mini
- **Anthropic**: Claude Sonnet, Claude Opus, Claude Haiku
- **Google**: Gemini Pro, Gemini Flash
- **xAI**: Grok
- **Open Source**: DeepSeek, Llama, Qwen
- **Others**: Additional models added regularly

### Model Routing
Anuma can automatically select the best model for each prompt based on task type. Developers can also specify models explicitly or let users choose.

## SDK Packages

### React SDK (@anuma/sdk/react)
React hooks for building AI chat interfaces:
- \`useChat\`: Core chat hook with streaming, tool calls, and model selection
- \`useChatStorage\`: Chat with automatic conversation persistence
- \`useMemory\`: Access and manage AI memory
- \`useConversations\`: List, create, and delete conversations

### Next.js SDK (@anuma/sdk/next)
Server-side utilities for Next.js applications:
- Token generation and validation
- API route helpers
- Server-side rendering support

### Expo SDK (@anuma/sdk/expo)
React Native / Expo integration:
- Same hooks as React SDK, optimized for mobile
- Offline-first with local storage
- Push notification support

### Vercel AI SDK Adapter (@anuma/sdk/vercel)
Drop-in adapter for the Vercel AI SDK:
- Use Anuma as a provider in the Vercel AI SDK
- Compatible with \`ai\` package hooks and utilities

### API Client (@anuma/sdk/client)
Low-level TypeScript client for direct API access:
- Full API coverage
- Type-safe request/response types
- Supports all endpoints

## CLI

The Anuma CLI (\`@anuma/cli\`) provides command-line tools for managing apps, generating tokens, and testing integrations. Install via npm and authenticate with your dashboard credentials.

## Tutorials

### Quickstart
Step-by-step guide to building your first AI app with Anuma. Covers project setup, authentication, sending messages, and handling streaming responses. Takes approximately 10 minutes.

### Next.js Integration
Complete Next.js tutorial covering server-side token generation, client-side chat components, conversation persistence, and deployment. Includes full source code.

### Telegram Bot
Build an AI-powered Telegram bot using the Anuma SDK. Covers bot setup, message handling, conversation context, and tool integration.

### AI Agent
Build an autonomous AI agent with tools. The agent can search the web, manage files, and call custom functions based on user instructions.

## Links

- Anuma Website: https://www.anuma.ai
- Web App: https://chat.anuma.ai
- Developer Dashboard: https://dashboard.anuma.ai
- SDK GitHub: https://github.com/anuma-ai/sdk
- Starter Template (Next.js): https://github.com/anuma-ai/starter-next
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
