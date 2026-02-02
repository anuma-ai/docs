import { PORTAL_API_URL } from "../lib/config";
import { ReferenceTable } from "./ReferenceTable";

interface Tool {
  name: string;
  description?: string;
  schema?: {
    name: string;
    description: string;
    parameters: unknown;
  };
}

interface ToolsResponse {
  [key: string]: Tool;
}

export async function ServerTools() {
  const res = await fetch(`${PORTAL_API_URL}/api/v1/tools`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return <p>Failed to load tools.</p>;
  }

  const data: ToolsResponse = await res.json();
  const tools = Object.values(data)
    .map((tool) => ({
      name: tool.name,
      description: tool.schema?.description ?? tool.description ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (value: string) => (
        <code style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>{value}</code>
      ),
    },
    {
      key: "description",
      header: "Description",
    },
  ];

  const sourceUrl = `${PORTAL_API_URL}/api/v1/tools`;

  return (
    <>
      <ReferenceTable columns={columns} data={tools} />
      <p style={{ fontSize: "0.75rem", color: "var(--x-color-slate-500)", marginTop: "1rem" }}>
        Source: <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceUrl}</a>
      </p>
    </>
  );
}
