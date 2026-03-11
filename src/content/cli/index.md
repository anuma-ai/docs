# Anuma CLI

Command-line interface for the [Anuma](https://dashboard.anuma.ai) platform. Manage your apps, API keys, models, credits, and subscriptions from the terminal.

## Install

```bash
npm install -g anuma@next
```

Or run directly with npx:

```bash
npx anuma@next --help
```

## Create a New App

Scaffold a project from a starter template:

```bash
anuma new --starter mini
```

Available starters: `mini`, `next`, `telegram`. If you have a Privy app ID, pass it with `--privy <id>` to auto-configure the environment.

## Login

Authenticate with your API key:

```bash
anuma auth login --api-key <your-key>
```

You can get an API key from the [Anuma Developer Dashboard](https://dashboard.anuma.ai).

Once authenticated, explore available commands:

```bash
anuma --help
anuma <command> --help
```

## Configuration

The CLI stores configuration in `~/.anuma/config.json`. You can override the API base URL per invocation with `--api-url <url>`:

```bash
anuma api models list --api-url https://portal.anuma.ai
```
