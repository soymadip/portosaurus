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
    repo: pkg.repository.url,
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

const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
  : "/";

export default withMermaid({
  base: base,

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
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: `${base}img/svg/icon.svg`,
      },
    ],
  ],

  title: metadata.project.title,
  description: metadata.project.desc,

  transformPageData(pageData) {
    resolveVars(pageData, metadata);
  },

  themeConfig: {
    logo: "/img/svg/icon.svg",
    outline: [2, 3],
    metadata: metadata,

    banner: {
      enabled: true,
      text: "⚠️ This documentation is Work In Progress!",
    },

    search: {
      provider: "local",
      options: {
        miniSearch: {},
      },
    },

    nav: [
      { text: "User Guide", link: "/user/getting-started" },
      { text: "Configuration", link: "/user/config/overview" },
      { text: "Roadmap", link: "/roadmap" },
    ],

    sidebar: [
      {
        text: "User Guide",
        items: [
          { text: "Getting Started", link: "/user/getting-started" },
          {
            text: "Configuration",
            link: "/user/config/overview",
            collapsed: true,
            items: [
              { text: "Variables", link: "/user/config/variables" },
              { text: "Reference", link: "/user/config/reference" },
            ],
          },
          {
            text: "Markdown Features",
            link: "/user/markdown/overview",
            collapsed: true,
            items: [
              {
                text: "Interactive Previews",
                link: "/user/markdown/previews",
              },
              { text: "Tabs", link: "/user/markdown/tabs" },
              { text: "Details", link: "/user/markdown/details" },
              { text: "Tooltips", link: "/user/markdown/tooltips" },
              {
                text: "Note Cards",
                link: "/user/markdown/note-cards",
              },
            ],
          },
          {
            text: "Deployment",
            link: "/user/deploy/overview",
            collapsed: true,
            items: [
              { text: "GitHub Pages", link: "/user/deploy/github-pages" },
              { text: "GitLab Pages", link: "/user/deploy/gitlab-pages" },
              { text: "Codeberg Pages", link: "/user/deploy/codeberg-pages" },
              { text: "Surge", link: "/user/deploy/surge" },
              {
                text: "Other Providers",
                link: "/user/deploy/others",
              },
            ],
          },
        ],
      },
      {
        text: "Developer Guide",
        link: "/dev/overview",
        collapsed: false,
        items: [{ text: "Custom Templates", link: "/dev/templates" }],
      },
      {
        text: "More",
        collapsed: true,
        items: [{ text: "Roadmap", link: "/roadmap" }],
      },
    ],

    socialLinks: [{ icon: "github", link: metadata.project.repo }],
  },
});
