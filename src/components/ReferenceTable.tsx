interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => any;
}

interface ReferenceTableProps {
  columns: Column[];
  data: any[];
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

export function ReferenceTable({ columns, data }: ReferenceTableProps) {
  return (
    <>
      <style>{`
        .reference-table td {
          border-bottom: 1px solid var(--x-color-gray-200);
        }
        .reference-table .text-col {
          color: var(--x-color-slate-700);
        }
        .reference-table .text-col code {
          font-size: 0.75rem;
          background: var(--x-color-gray-100);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .dark .reference-table td {
          border-bottom: 1px solid var(--x-color-neutral-800);
        }
        .dark .reference-table .text-col {
          color: var(--x-color-slate-200);
        }
        .dark .reference-table .text-col code {
          background: var(--x-color-neutral-800);
        }
      `}</style>
      <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
        <table className="reference-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 1rem" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    paddingBottom: "0.75rem",
                    paddingRight: "1.5rem",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={colIndex > 0 ? "text-col" : undefined}
                    style={{
                      paddingRight: "1.5rem",
                      paddingBottom: "1.5rem",
                      verticalAlign: "top",
                      fontSize: "0.875rem",
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : typeof row[col.key] === "string"
                        ? parseMarkdown(row[col.key])
                        : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
