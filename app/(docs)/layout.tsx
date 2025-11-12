import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { Code2, Server, Webhook } from "lucide-react";
import React, { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      sidebar={{
        tabs: {
          transform: (option, node) => {
            // Determine icon based on tab title or URL
            let icon: React.ReactNode;

            if (option.title === "Client" || option.url?.includes("/client")) {
              icon = <Code2 size={16} />;
            } else if (
              option.title === "Platform" ||
              option.url?.includes("/platform")
            ) {
              icon = <Server size={16} />;
            } else if (option.title === "API" || option.url?.includes("/api")) {
              icon = <Webhook size={16} />;
            } else {
              icon = <Webhook size={16} />;
            }

            return {
              ...option,
              icon: icon,
            };
          },
        },
      }}
      tree={source.pageTree}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
