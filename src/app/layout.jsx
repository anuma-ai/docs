/* eslint-env node */
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  metadataBase: new URL("https://nextra.site"),
  title: {
    template: "%s - Nextra",
  },
  description: "Nextra: the Next.js site builder",
  applicationName: "Nextra",
  generator: "Next.js",
  appleWebApp: {
    title: "Nextra",
  },
  other: {
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "msapplication-TileColor": "#fff",
  },
  twitter: {
    site: "https://nextra.site",
  },
};

export default async function RootLayout({ children }) {
  const linkClass =
    "x:text-sm x:whitespace-nowrap x:text-gray-600 x:hover:text-black x:dark:text-gray-400 x:dark:hover:text-gray-200 x:transition-colors";
  const navbar = (
    <Navbar logo={<b>SDK</b>} logoLink="/">
      <a href="/" className={linkClass}>
        Docs
      </a>
      <a href="/spec" className={linkClass}>
        Spec
      </a>
    </Navbar>
  );
  const pageMap = await getPageMap();
  const filteredPageMap = pageMap.filter((item) => item.name !== "spec");
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer />}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/shuding/nextra/blob/main/examples/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={filteredPageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
