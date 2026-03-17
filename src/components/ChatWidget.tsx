"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

/** Render a subset of markdown inline: bold, code, links, and line breaks. */
/** Render inline markdown: bold, code, links. */
function renderInline(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    if (match[2]) {
      nodes.push(<strong key={`${keyPrefix}-${key++}`}>{match[2]}</strong>);
    } else if (match[4]) {
      nodes.push(<code key={`${keyPrefix}-${key++}`} className="chat-inline-code">{match[4]}</code>);
    } else if (match[6] && match[7]) {
      const href = match[7].replace(/\.mdx?$/, "");
      const isInternal = href.startsWith("/");
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-${key++}`} href={href} className="chat-md-link">
            {match[6]}
          </Link>
        ) : (
          <a key={`${keyPrefix}-${key++}`} href={href} className="chat-md-link" target="_blank" rel="noopener noreferrer">
            {match[6]}
          </a>
        )
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

/** Render markdown with code blocks, headings, and inline formatting. */
function renderMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);
  let blockKey = 0;

  for (const part of parts) {
    if (part.startsWith("```")) {
      // Code block — strip the fences and optional language tag
      const content = part.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      nodes.push(
        <pre key={`cb-${blockKey++}`} className="chat-code-block">
          <code>{content}</code>
        </pre>
      );
      continue;
    }

    const lines = part.split("\n");
    lines.forEach((line, li) => {
      // Headings
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        if (li > 0) nodes.push(<br key={`hbr-${blockKey}-${li}`} />);
        nodes.push(
          <strong key={`h-${blockKey}-${li}`} className="chat-heading">
            {headingMatch[2]}
          </strong>
        );
        nodes.push(<br key={`habr-${blockKey}-${li}`} />);
        return;
      }

      // Empty lines become breaks
      if (line.trim() === "") {
        nodes.push(<br key={`ebr-${blockKey}-${li}`} />);
        return;
      }

      // List items
      const listMatch = line.match(/^(\s*[-*]\s+|\s*\d+\.\s+)(.+)$/);
      if (listMatch) {
        nodes.push(
          <div key={`li-${blockKey}-${li}`} className="chat-list-item">
            {"• "}{...renderInline(listMatch[2], `${blockKey}-${li}`)}
          </div>
        );
        return;
      }

      // Regular line
      if (li > 0 && lines[li - 1]?.trim() !== "") {
        nodes.push(<br key={`lbr-${blockKey}-${li}`} />);
      }
      nodes.push(...renderInline(line, `${blockKey}-${li}`));
    });
    blockKey++;
  }

  return nodes;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ source: string; heading: string; score: number }>;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: err.error || "Something went wrong.",
          };
          return updated;
        });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;

          try {
            const data = JSON.parse(payload);
            if (data.type === "sources") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  sources: data.sources,
                };
                return updated;
              });
            } else if (data.type === "content") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + data.content,
                };
                return updated;
              });
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Failed to connect. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{chatStyles}</style>

      {/* Toggle button */}
      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={`chat-panel${expanded ? " chat-panel-expanded" : ""}`}>
          <div className="chat-header">
            <span>Ask about Anuma docs</span>
            <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
              <div ref={menuRef} style={{ position: "relative" }}>
                <button
                  className="chat-close"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menu"
                  title="Menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="chat-menu">
                    <button
                      className="chat-menu-item"
                      disabled={messages.length === 0}
                      onClick={() => { setMessages([]); setMenuOpen(false); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                      Clear chat
                    </button>
                  </div>
                )}
              </div>
              <button
                className="chat-close"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? "Collapse chat" : "Expand chat"}
                title={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
              <button
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                Ask a question about the Anuma documentation.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                <div className="chat-msg-content">{msg.content ? (msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content) : (loading && i === messages.length - 1 ? "Thinking..." : "")}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="chat-sources">
                    {msg.sources
                      .filter((s, j, arr) => arr.findIndex((x) => x.source === s.source) === j)
                      .map((s, j) => {
                        const segments = s.source.split("/").filter(Boolean);
                        const name = segments[segments.length - 1] || segments[segments.length - 2] || s.source;
                        const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
                        return (
                          <Link key={j} href={s.source} className="chat-source-link">
                            {label}
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              className="chat-send"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const chatStyles = `
  .chat-toggle {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 50;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid var(--x-color-gray-200);
    background: var(--x-color-gray-50, #fafafa);
    color: var(--x-color-gray-700, #374151);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: background 0.15s, box-shadow 0.15s;
  }
  .chat-toggle:hover {
    background: var(--x-color-gray-100, #f3f4f6);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .dark .chat-toggle {
    background: var(--x-color-neutral-800, #262626);
    border-color: var(--x-color-neutral-700, #404040);
    color: var(--x-color-gray-200, #e5e7eb);
  }
  .dark .chat-toggle:hover {
    background: var(--x-color-neutral-700, #404040);
  }

  .chat-panel {
    position: fixed;
    bottom: 5rem;
    right: 1.5rem;
    z-index: 50;
    width: 24rem;
    max-width: calc(100vw - 2rem);
    height: 32rem;
    max-height: calc(100vh - 8rem);
    border-radius: 0.75rem;
    border: 1px solid var(--x-color-gray-200);
    background: var(--x-color-gray-50, #fafafa);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 0.875rem;
    transition: height 0.2s ease, bottom 0.2s ease;
  }
  .chat-panel-expanded {
    bottom: 1.5rem;
    height: calc(100vh - 3rem);
    max-height: calc(100vh - 3rem);
  }
  .dark .chat-panel {
    background: var(--x-color-neutral-900, #171717);
    border-color: var(--x-color-neutral-700, #404040);
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--x-color-gray-200);
    font-weight: 600;
    font-size: 0.875rem;
  }
  .dark .chat-header {
    border-color: var(--x-color-neutral-700, #404040);
  }

  .chat-close {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    padding: 0.25rem;
    display: flex;
    opacity: 0.6;
  }
  .chat-close:hover { opacity: 1; }

  .chat-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.25rem;
    background: var(--x-color-gray-50, #fafafa);
    border: 1px solid var(--x-color-gray-200);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    min-width: 8rem;
    z-index: 60;
    overflow: hidden;
  }
  .dark .chat-menu {
    background: var(--x-color-neutral-800, #262626);
    border-color: var(--x-color-neutral-700, #404040);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  .chat-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    color: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .chat-menu-item:hover {
    background: var(--x-color-gray-100, #f3f4f6);
  }
  .dark .chat-menu-item:hover {
    background: var(--x-color-neutral-700, #404040);
  }
  .chat-menu-item:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .chat-empty {
    color: var(--x-color-slate-500, #64748b);
    text-align: center;
    margin-top: 2rem;
    font-size: 0.8125rem;
  }

  .chat-msg {
    max-width: 85%;
    line-height: 1.5;
  }
  .chat-msg-user {
    align-self: flex-end;
  }
  .chat-msg-assistant {
    align-self: flex-start;
  }

  .chat-msg-content {
    padding: 0.5rem 0.75rem;
    border-radius: 0.625rem;
    word-break: break-word;
    line-height: 1.5;
  }
  .chat-msg-user .chat-msg-content {
    white-space: pre-wrap;
  }
  .chat-inline-code {
    font-size: 0.75rem;
    background: rgba(0,0,0,0.06);
    padding: 0.1rem 0.3rem;
    border-radius: 0.2rem;
    font-family: ui-monospace, monospace;
  }
  .dark .chat-inline-code {
    background: rgba(255,255,255,0.1);
  }
  .chat-md-link {
    color: var(--x-color-primary-600, #2563eb);
    text-decoration: underline;
  }
  .dark .chat-md-link {
    color: var(--x-color-primary-400, #60a5fa);
  }
  .chat-code-block {
    background: rgba(0,0,0,0.05);
    border-radius: 0.375rem;
    padding: 0.5rem 0.625rem;
    margin: 0.375rem 0;
    overflow-x: auto;
    font-size: 0.75rem;
    font-family: ui-monospace, monospace;
    white-space: pre;
    display: block;
  }
  .dark .chat-code-block {
    background: rgba(255,255,255,0.07);
  }
  .chat-heading {
    font-size: 0.8125rem;
  }
  .chat-list-item {
    padding-left: 0.5rem;
  }
  .chat-msg-user .chat-msg-content {
    background: var(--x-color-primary-700, #1d4ed8);
    color: white;
    border-bottom-right-radius: 0.125rem;
  }
  .chat-msg-assistant .chat-msg-content {
    background: var(--x-color-gray-100, #f3f4f6);
    color: var(--x-color-gray-800, #1f2937);
    border-bottom-left-radius: 0.125rem;
  }
  .dark .chat-msg-assistant .chat-msg-content {
    background: var(--x-color-neutral-800, #262626);
    color: var(--x-color-gray-200, #e5e7eb);
  }

  .chat-sources {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.375rem;
    padding-left: 0.25rem;
  }
  .chat-source-link {
    font-size: 0.6875rem;
    color: var(--x-color-primary-600, #2563eb);
    text-decoration: none;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background: var(--x-color-primary-50, #eff6ff);
    transition: background 0.15s;
  }
  .chat-source-link:hover {
    background: var(--x-color-primary-100, #dbeafe);
  }
  .dark .chat-source-link {
    color: var(--x-color-primary-400, #60a5fa);
    background: rgba(59, 130, 246, 0.1);
  }
  .dark .chat-source-link:hover {
    background: rgba(59, 130, 246, 0.2);
  }

  .chat-input-form {
    display: flex;
    padding: 0.625rem;
    border-top: 1px solid var(--x-color-gray-200);
    gap: 0.5rem;
  }
  .dark .chat-input-form {
    border-color: var(--x-color-neutral-700, #404040);
  }

  .chat-input {
    flex: 1;
    border: 1px solid var(--x-color-gray-300, #d1d5db);
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    background: white;
    color: var(--x-color-gray-800, #1f2937);
    outline: none;
  }
  .chat-input:focus {
    border-color: var(--x-color-primary-500, #3b82f6);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
  .dark .chat-input {
    background: var(--x-color-neutral-800, #262626);
    border-color: var(--x-color-neutral-600, #525252);
    color: var(--x-color-gray-200, #e5e7eb);
  }
  .dark .chat-input:focus {
    border-color: var(--x-color-primary-500, #3b82f6);
  }

  .chat-send {
    border: none;
    background: var(--x-color-primary-600, #2563eb);
    color: white;
    border-radius: 0.5rem;
    padding: 0.5rem 0.625rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .chat-send:hover:not(:disabled) {
    background: var(--x-color-primary-700, #1d4ed8);
  }
  .chat-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
