import React from "react";

interface Tool {
  name: string;
  description: string;
  parameters: unknown;
}

interface ToolsResponse {
  [key: string]: Tool;
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
        .dark .server-tools-table td {
          border-bottom: 1px solid var(--x-color-neutral-800);
        }
        .dark .server-tools-table .desc {
          color: var(--x-color-slate-200);
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
                  {tool.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
