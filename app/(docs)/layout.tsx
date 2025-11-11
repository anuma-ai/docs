import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon } from "lucide-react";

export default function Layout({ children }: LayoutProps<"/[[...slug]]">) {
  return (
    <DocsLayout
      sidebar={{
        tabs: {
          transform: (option, node) => ({
            ...option,
            icon: <BookIcon />,
          }),
        },
      }}
      tree={source.pageTree}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
