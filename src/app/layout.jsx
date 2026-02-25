/* eslint-env node */
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  metadataBase: new URL("https://nextra.site"),
  title: {
    default: "Anuma Docs",
    template: "%s - Anuma Docs",
  },
  description: "Anuma SDK Documentation",
  applicationName: "Anuma Docs",
  generator: "Next.js",
  appleWebApp: {
    title: "Anuma Docs",
  },
  icons: {
    icon: "/icon.svg",
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
  const logo = (
    <svg viewBox="40 430 944 164" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: 'auto' }}>
      <path d="M46.5459 586.827L122.875 436.18L199.203 586.827H164.858L122.875 504.335L80.8916 586.827H46.5459Z" fill="currentColor"/>
      <path d="M260.055 486.382V586.799H229.528V443.352H260.055L351.637 543.769V443.352H382.164V586.82H351.637L260.055 486.403V486.382Z" fill="currentColor"/>
      <path d="M420.772 515.075V443.352H451.3V515.096C451.3 527.054 455.74 537.216 464.665 545.585C473.568 553.953 484.38 558.147 497.101 558.147C509.823 558.147 520.635 553.974 529.538 545.585C538.44 537.196 542.903 527.054 542.903 515.096V443.352H573.43V515.096C573.43 534.984 565.993 551.908 551.14 565.868C536.287 579.829 518.259 586.82 497.123 586.82C475.988 586.82 457.982 579.829 443.107 565.868C428.232 551.887 420.817 534.963 420.817 515.096L420.772 515.075Z" fill="currentColor"/>
      <path d="M644.033 500.739V586.82H613.506V443.352H644.033L705.087 550.948L766.141 443.352H796.668V586.82H766.141V500.739L720.362 586.82H689.835L644.055 500.739H644.033Z" fill="currentColor"/>
      <path d="M824.818 586.827L901.125 436.18L977.453 586.827H943.108L901.125 504.335L859.142 586.827H824.796H824.818Z" fill="currentColor"/>
    </svg>
  );
  const navbar = (
    <Navbar logo={logo} logoLink="/">
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
      <Head />
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
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
