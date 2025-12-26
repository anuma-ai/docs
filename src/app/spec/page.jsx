"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

export default function SpecPage() {
  return (
    <ApiReferenceReact
      configuration={{
        url: "https://ai-portal-dev.zetachain.com/api/v1/docs/swagger.json",
        theme: "none",
        hideModels: false,
        showDeveloperTools: "never",
        hideClientButton: true,
        defaultHttpClient: {
          targetKey: "node",
          clientKey: "fetch",
        },
      }}
    />
  );
}
