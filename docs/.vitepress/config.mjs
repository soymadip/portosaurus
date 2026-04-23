import { withMermaid } from "vitepress-plugin-mermaid";
import taskLists from "markdown-it-task-lists";
import { readFileSync } from "fs";
import { resolve } from "path";
import { resolveVars } from "./plugins/resolveVars.js";

// Read package.json metadata (Node-only environment)
const pkgPath = resolve(process.cwd(), "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const metadata = {
  project: {
    title: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
    desc: "for your digital personality",
    tagLine: pkg.description,
    repo: pkg.repository.url ? pkg.homepage.replace(/\/$/, "") : "",
  },

  // Versions & Requirements
  versions: {
    porto: pkg.version || "0.0.0",
    node_min: pkg.engines?.node || "20.0+",
  },

  // Package Information
  pkg: pkg.name,

  // Tools & Ecosystem
  tools: {
    bun: "https://bun.sh/",
    docusaurus: "https://docusaurus.io/",
    vitepress: "https://vitepress.dev/",
    yaml: "https://yaml.org/",
    staticShort: "https://github.com/soymadip/staticshort",
  },
};

export default withMermaid({
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
    : "/",

  vite: {
    publicDir: "../public",

    build: {
      chunkSizeWarningLimit: 1000,
    },
  },

  markdown: {
    config: (md) => {
      md.use((mdInstance) => resolveVars(mdInstance, metadata));
      md.use(taskLists);
    },
  },

  srcDir: "md",
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/img/svg/icon.svg" }],
  ],

  title: metadata.project.title,
  description: metadata.project.desc,

  transformPageData(pageData) {
    resolveVars(pageData, metadata);
  },

  themeConfig: {
    logo: "/img/svg/icon.svg",
    outline: [2, 3],

    search: {
      provider: "local",
      options: {
        miniSearch: {},
      },
    },

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "CLI", link: "/reference/cli" },
      { text: "Roadmap", link: "/roadmap" },
    ],

    sidebar: [
      {
        text: "User Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Dynamic Variables", link: "/guide/variables" },
          { text: "Configuration", link: "/guide/config" },
          { text: "Markdown Features", link: "/guide/markdown" },
        ],
      },
      {
        text: "CLI Reference",
        items: [
          { text: "Overview", link: "/reference/cli" },
          { text: "init", link: "/reference/cli#init" },
          { text: "dev", link: "/reference/cli#dev" },
          { text: "build", link: "/reference/cli#build" },
        ],
      },
      {
        text: "More",
        items: [{ text: "Roadmap", link: "/roadmap" }],
      },
    ],

    socialLinks: [{ icon: "github", link: metadata.project.repo }],

    metadata: metadata,
  },
});
