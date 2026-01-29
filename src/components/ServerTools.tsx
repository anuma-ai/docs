interface Tool {
  name: string;
  description: string;
  parameters: unknown;
}

interface ToolsResponse {
  [key: string]: Tool;
}

function parseMarkdown(text: string) {
  const parts: any[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Match ``code`` (double backticks first)
    const doubleCodeMatch = remaining.match(/^``([^`]+)``/);
    if (doubleCodeMatch) {
      parts.push(<code key={key++}>{doubleCodeMatch[1]}</code>);
      remaining = remaining.slice(doubleCodeMatch[0].length);
      continue;
    }

    // Match `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(<code key={key++}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Match **bold**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Match newlines
    if (remaining.startsWith("\n")) {
      parts.push(<br key={key++} />);
      remaining = remaining.slice(1);
      continue;
    }

    // Find next special character
    const nextSpecial = remaining.search(/[`*\n]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      // Special char didn't match a pattern, treat as text
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

export async function ServerTools() {
  const res = await fetch("https://portal.anuma-dev.ai/api/v1/tools", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return <p>Failed to load tools.</p>;
  }

  const data: ToolsResponse = await res.json();
  const tools = Object.values(data).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <style>{`
        .server-tools-table td {
          border-bottom: 1px solid var(--x-color-gray-200);
        }
        .server-tools-table .desc {
          color: var(--x-color-slate-700);
        }
        .server-tools-table .desc code {
          font-size: 0.75rem;
          background: var(--x-color-gray-100);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .dark .server-tools-table td {
          border-bottom: 1px solid var(--x-color-neutral-800);
        }
        .dark .server-tools-table .desc {
          color: var(--x-color-slate-200);
        }
        .dark .server-tools-table .desc code {
          background: var(--x-color-neutral-800);
        }
      `}</style>
      <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
        <table className="server-tools-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 1rem" }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: "0.75rem", paddingRight: "1.5rem", textAlign: "left", fontSize: "0.875rem", fontWeight: 600 }}>Name</th>
              <th style={{ paddingBottom: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: 600 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.name}>
                <td style={{ paddingRight: "1.5rem", paddingBottom: "1.5rem", verticalAlign: "top" }}>
                  <code style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>{tool.name}</code>
                </td>
                <td className="desc" style={{ fontSize: "0.875rem", paddingBottom: "1.5rem" }}>
                  {parseMarkdown(tool.description)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
