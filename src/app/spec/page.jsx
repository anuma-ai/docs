"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useTheme } from "nextra-theme-docs";
import { useEffect, useState } from "react";

export default function SpecPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <ApiReferenceReact
      key={resolvedTheme}
      configuration={{
        url: "https://ai-portal-dev.zetachain.com/api/v1/docs/swagger.json",
        theme: "none",
        darkMode: isDark,
        forceDarkModeState: isDark ? "dark" : "light",
        hideDarkModeToggle: true,
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
