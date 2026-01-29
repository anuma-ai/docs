import { PORTAL_API_URL } from "../lib/config";
import { ReferenceTable } from "./ReferenceTable";

interface Model {
  id: string;
  name?: string;
  created?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
  owned_by: string;
  modalities: string[];
}

interface ModelsResponse {
  data: Model[];
}

export async function ModelsList() {
  const res = await fetch(`${PORTAL_API_URL}/api/v1/models`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return <p>Failed to load models.</p>;
  }

  const data: ModelsResponse = await res.json();
  const models = data.data.sort((a, b) => a.id.localeCompare(b.id));

  const columns = [
    {
      key: "id",
      header: "Model ID",
      render: (value: string) => (
        <code style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>{value}</code>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (value: string | undefined) => value || "—",
    },
    {
      key: "modalities",
      header: "Modalities",
      render: (value: string[]) => value?.join(", ") || "—",
    },
  ];

  const sourceUrl = `${PORTAL_API_URL}/api/v1/models`;

  return (
    <>
      <ReferenceTable columns={columns} data={models} />
      <p style={{ fontSize: "0.75rem", color: "var(--x-color-slate-500)", marginTop: "1rem" }}>
        Source: <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceUrl}</a>
      </p>
    </>
  );
}
