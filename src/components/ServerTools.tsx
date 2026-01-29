import { PORTAL_API_URL } from "../lib/config";
import { ReferenceTable } from "./ReferenceTable";

interface Tool {
  name: string;
  description: string;
  parameters: unknown;
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
  const tools = Object.values(data).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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

  return <ReferenceTable columns={columns} data={tools} />;
}
