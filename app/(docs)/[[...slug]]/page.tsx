import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { DocData } from "fumadocs-mdx";
import type { PageData } from "fumadocs-core/source";

type DocsPageData = PageData &
  DocData & {
    full?: boolean;
  };

function isDocsPageData(data: PageData): data is DocsPageData {
  return typeof (data as Partial<DocData>).body !== "undefined";
}

export default async function Page(props: PageProps<"/[[...slug]]">) {
  const params = await props.params;

  // Redirect root path to /platform
  if (!params.slug || params.slug.length === 0) {
    redirect("/platform");
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();

  if (!isDocsPageData(page.data)) {
    notFound();
  }

  const { body: MDX, toc, full, title, description } = page.data;

  return (
    <DocsPage toc={toc} full={full}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
