import { themes } from "prism-react-renderer";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const internalUtils = path.resolve(__dirname, "../internal/src/utils");

/**
 * Resolves the site URL based on config value and environment.
 * @param {string} configValue - The site_url value from user config.
 * @returns {string} Resolved URL.
 */
function resolveSiteUrl(configValue) {
  if (configValue === "auto") {
    if (process.env.GITHUB_ACTIONS === "true") {
      const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
      return `https://${repoOwner}.github.io`;
    }
    return "http://localhost";
  }
  return configValue;
}

/**
 * Resolves the base path based on config value and environment.
 * @param {string} configValue - The site_path value from user config.
 * @returns {string} Resolved base path.
 */
function resolveBasePath(configValue) {
  if (configValue === "auto") {
    if (process.env.GITHUB_ACTIONS === "true") {
      const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
      const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;

      // User/org pages use root path, project pages use /repo-name/
      return repoName === `${repoOwner}.github.io` ? "/" : `/${repoName}/`;
    }
    return "/";
  }
  return configValue;
}

/**
 * Creates a Docusaurus config from the Portosaurus user config.
 * @param {Object} userConfig - The user configuration object (export of config.js).
 * @returns {Object} Docusaurus configuration object.
 **/
export function createConfig(userConfig, projectRoot = process.cwd()) {
  const usrConf = userConfig.usrConf || {};

  //------------- Basic mapping -------------

  const projName = usrConf.hero_section?.title || "Portosaurus Site";
  const projDesc =
    usrConf.hero_section?.description ||
    "Complete portfolio cum personal website solution for your digital personality.";

  const siteUrl = resolveSiteUrl(usrConf.site_url);
  const sitePath = resolveBasePath(usrConf.site_path);
  const faviconPath =
    usrConf.hero_section?.profile_pic || "https://github.com/soymadip.png";

  const title = usrConf.hero_section?.title || projName;
  const tagline = usrConf.hero_section?.description || projDesc;

  // Resolve paths relative to .portosaurus (the build context)
  const dotPorto = path.resolve(projectRoot, ".portosaurus");
  const notesPath = path.resolve(dotPorto, "notes");
  const blogPath = path.resolve(dotPorto, "blog");
  const staticPath = path.resolve(dotPorto, "static");

  // ---------- Docusaurus Config -----------
  const config = {
    projectName: projName,

    title: projName,
    tagline: projDesc,

    favicon: faviconPath,
    url: siteUrl,
    baseUrl: sitePath,

    onBrokenLinks: "warn",
    organizationName: projName,

    customFields: {
      heroSection: usrConf.hero_section || {},
      aboutMe: usrConf.about_section || {},
      projects: usrConf.projects_section || {},
      socialLinks: usrConf.social_links || {},
      experience: usrConf.experience_section || {},
      tasksPage: usrConf.tasks_page || {},
    },

    // Markdown configuration
    markdown: {
      hooks: {
        onBrokenMarkdownLinks: "warn",
      },
    },

    presets: [
      [
        "classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            path: notesPath,
            routeBasePath: "notes",
            sidebarPath: "./src/config/sidebars.js", // Inside .portosaurus
            // editUrl: '...',
          },
          blog: {
            path: blogPath,
            showReadingTime: true,
            onUntruncatedBlogPosts: "ignore",
            // editUrl: '...',
          },
          theme: {
            customCss: "./src/css/custom.css", // Inside .portosaurus
          },
        }),
      ],
    ],

    staticDirectories: [staticPath],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        // Replace with your project's social card
        image: usrConf.social_card || "img/social-card.jpg",

        docs: {
          sidebar: {
            hideable: usrConf.collapsable_sidebar ?? true,
          },
        },

        imageZoom: {
          options: {
            margin: 2,
            background: "rgba(var(--ifm-background-color-rgb), 0.9)",
          },
        },

        // Default: Dark mode
        colorMode: {
          defaultMode: usrConf.dark_mode ? "dark" : "light",
          disableSwitch: usrConf.disable_theme_switch || false,
        },

        navbar: {
          title: projName,
          hideOnScroll: usrConf.hide_navbar_on_scroll ?? true,
          logo: {
            alt: "Logo",
            src: usrConf.hero_section?.profile_pic || "img/logo.svg",
          },
          items: [
            // Search will be added by plugin
            {
              type: "search",
              position: "right",
              className: "navbar-search-bar",
            },
            {
              // About/Projects/Experience handled by home page logic
              label: "About Me",
              to: "/#about",
              position: "right",
            },
            {
              label: "Projects",
              to: "/#projects",
              position: "right",
            },
            {
              type: "docSidebar",
              sidebarId: "notes",
              position: "right",
              label: "Notes",
            },
            { to: "/blog", label: "Blog", position: "right" },
            // TODO: Add Tasks link
          ],
        },
        footer: {
          style: "dark",
          links: [
            // TODO: Add footer links based on config
          ],
          copyright: `Copyright © ${new Date().getFullYear()} ${projName}. Built with Portosaurus.`,
        },
        prism: {
          theme: themes.github,
          darkTheme: themes.dracula,
          additionalLanguages: ["java", "php", "bash"],
        },
      }),

    plugins: [
      // require.resolve(`${internalUtils}/generateFavicon.js`),
      require.resolve(`${internalUtils}/generateRobotsTxt.js`),
      [
        require.resolve("@easyops-cn/docusaurus-search-local"),
        {
          hashed: true,
          indexDocs: true,
          docsDir: notesPath,
          blogDir: blogPath,
          docsRouteBasePath: "notes",
          highlightSearchTermsOnTargetPage: true,
          explicitSearchResultPath: true,
          hideSearchBarWithNoSearchContext: true,
          searchContextByPaths: ["notes", "blog"],
          language: ["en"],
        },
      ],
      "plugin-image-zoom",
    ],
  };

  return config;
}
