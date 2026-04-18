import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { logger } from "../utils/logger.mjs";

import {
  deepMerge,
  resolveVars,
  resolveSiteUrl,
  resolveBasePath,
  getVersion,
  useEnabled,
  createStaticAssetResolver,
} from "../utils/configUtils.mjs";
import { PortoRoot } from "./constants.mjs";

// ─── Main Config Generator ─────────────────────────────────

/**
 * Creates a Docusaurus config from a user's Portosaurus config.
 *
 * @param {Object} rawUserConfig - The user's config object (export of config.js).
 *                                 May be { usrConf: {...} } or just {...}.
 * @param {string} UserRoot      - Absolute path to the user's project root.
 * @returns {Object} Complete Docusaurus configuration object.
 */
export function buildDocuConfig(rawUserConfig, UserRoot) {
  // Support both { usrConf: {...} } and direct config objects
  const UserConfigRaw = rawUserConfig.usrConf ?? rawUserConfig;

  // Load master template defaults for fallback resolution
  const require = createRequire(import.meta.url);
  const templateDefaults = require("../template/config.js").usrConf;

  // Static directories — defined early so aliases can reference them
  const UserStaticDir = path.resolve(UserRoot, "static");
  const PortoAssetDir = path.resolve(PortoRoot, "src/assets");

  // Hydrate the configuration by deep-merging user config over the template defaults.
  // This ensures that even if the user deletes nested fields, the structure remains safe.
  const merged = deepMerge(templateDefaults, UserConfigRaw);

  // Find Docusaurus root for reference
  let docuRoot = "";
  try {
    docuRoot = path.dirname(require.resolve("@docusaurus/core/package.json"));
  } catch {
    // If not found (e.g. during some build stages), fallback to node_modules relative to PortoRoot
    docuRoot = path.resolve(PortoRoot, "node_modules/@docusaurus/core");
  }

  // Resolve {{...}} template variables path prefixes in one pass
  const UserConfig = resolveVars(merged, merged, {
    siteRoot: UserRoot,
    portoRoot: PortoRoot,
    docuRoot: docuRoot,
  });

  // Compute derived values
  const siteUrl = resolveSiteUrl(UserConfig.site_url);
  const basePath = resolveBasePath(UserConfig.site_path);
  const version = getVersion();

  const UserProjName = UserConfig.hero_section.title;

  // Resolve internal paths

  // Prism themes
  let catppuccinMocha, catppuccinLatte;
  try {
    const prism = require(path.resolve(PortoRoot, "src/theme/config/prism.js"));
    catppuccinMocha = prism.catppuccinMocha;
    catppuccinLatte = prism.catppuccinLatte;
  } catch {
    catppuccinMocha = {};
    catppuccinLatte = {};
  }

  // Meta tags
  let PortoMetaTags = [];
  try {
    const meta = require(
      path.resolve(PortoRoot, "src/theme/config/metaTags.js"),
    );
    PortoMetaTags = meta.PortoMetaTags ?? meta.metaTags ?? [];
  } catch {
    // OK — no meta tags
  }

  // Paths for content — these point directly to the user's project
  const UserNotesDir = path.resolve(UserRoot, "notes");
  const UserBlogDir = path.resolve(UserRoot, "blog");

  const PortoFaviconCacheDir = path.resolve(
    UserRoot,
    ".docusaurus/portosaurus/favicon",
  );
  const StaticDirs = [
    UserStaticDir,
    PortoAssetDir,
    PortoFaviconCacheDir,
  ].filter((d) => fs.existsSync(d));

  /**
   * Validates a static asset path with fallback.
   * Aliases (@porto/, @site/) are already resolved globally by resolveAliases().
   *   - Remote URLs (http/https) pass through as-is.
   *   - Local paths are checked against UserStaticDir, then PortoAssetDir.
   */
  const resolveStaticAsset = createStaticAssetResolver(
    UserStaticDir,
    PortoAssetDir,
  );

  // Pages
  const PortoPagesDir = path.resolve(PortoRoot, "src/theme/pages");

  // Theme overrides
  const PortoThemeDir = path.resolve(PortoRoot, "src/theme");

  // Sidebar config
  const sidebarPath = path.resolve(PortoRoot, "src/theme/config/sidebar.js");

  // CSS
  const PortoCustomCss = path.resolve(PortoRoot, "src/theme/css/custom.css");

  // ───────────────────────Build the Docusaurus config ───────────────────────

  const config = {
    projectName: UserConfig.hero_section.title,
    title: UserConfig.hero_section.title,
    tagline: UserConfig.hero_section.description,
    favicon: resolveStaticAsset(
      UserConfig.favicon,
      resolveStaticAsset("favicon/favicon.ico", "img/icon.png"),
    ),
    url: siteUrl,
    baseUrl: basePath,

    organizationName: UserConfig.hero_section.title,
    deploymentBranch: "gh-pages",
    onBrokenAnchors: "ignore",
    onBrokenLinks: "warn",

    i18n: {
      defaultLocale: "en",
      locales: ["en"],
    },

    headTags: PortoMetaTags,

    customFields: {
      version,

      heroSection: {
        profilePic: resolveStaticAsset(
          UserConfig.hero_section.profile_pic,
          "img/icon.png",
        ),
        intro: UserConfig.hero_section.intro,
        title: UserConfig.hero_section.title,
        subtitle: UserConfig.hero_section.subtitle,
        profession: UserConfig.hero_section.profession,
        description: UserConfig.hero_section.description,
        learnMoreButtonTxt: UserConfig.hero_section.learn_more_button_txt,
      },

      aboutMe: {
        enable: UserConfig.about_me.enable,
        image: resolveStaticAsset(
          UserConfig.about_me.image ?? UserConfig.hero_section.profile_pic,
          "img/icon.png",
        ),
        description: UserConfig.about_me.description,
        skills: UserConfig.about_me.skills,
        resumeLink: UserConfig.about_me.resume_link,
      },

      projects: UserConfig.project_shelf,
      experience: UserConfig.experience,

      socialLinks: {
        enable: UserConfig.social_links.enable,
        links: UserConfig.social_links.links,
      },

      robotsTxt: {
        enable: UserConfig.robots_txt,
        rules: [{ disallow: ["/notes/", "/tasks/"] }],
        customLines: [],
      },

      tasksPage: {
        enable: UserConfig.tasks_page.enable,
        title: UserConfig.tasks_page.title,
        description: UserConfig.tasks_page.description,
        taskList: UserConfig.tasks_page.tasks,
      },

      corsProxyList: [
        ...[].concat(UserConfig.cors_proxy || []),
        "https://cors-proxy.soymadip.workers.dev/?url=",
        "https://api.allorigins.win/raw?url=",
      ].filter(Boolean),
    },

    presets: [
      [
        require.resolve("@docusaurus/preset-classic", {
          paths: [UserRoot, PortoRoot],
        }),
        {
          docs: {
            routeBasePath: "notes",
            path: UserNotesDir,
            sidebarPath,
            admonitions: {
              keywords: [
                "note",
                "tip",
                "info",
                "warning",
                "danger",
                "question",
              ],
              extendDefaults: true,
            },
          },
          blog: {
            path: UserBlogDir,
            feedOptions: UserConfig.rss
              ? { type: ["rss", "atom"], xslt: true }
              : undefined,
            showReadingTime: false,
            onInlineTags: "warn",
            onInlineAuthors: "warn",
            onUntruncatedBlogPosts: "warn",
          },
          theme: {
            customCss: PortoCustomCss,
          },
          pages: {
            path: PortoPagesDir,
          },
        },
      ],
    ],

    // Register portosaurus's src/theme/overrides as a theme directory
    // so Root.js and MDXComponents are natively transpiled by Docusaurus.
    themes: [
      [
        path.resolve(PortoRoot, "src/plugins/theme.mjs"),
        {
          themeDir: PortoThemeDir,
        },
      ],
    ],

    markdown: {
      mermaid: true,
      hooks: {
        onBrokenMarkdownLinks: "warn",
      },
    },

    themeConfig: {
      image: resolveStaticAsset(UserConfig.social_card, "img/social-card.jpeg"),
      docs: {
        sidebar: {
          hideable: UserConfig.collapsable_sidebar,
        },
      },
      imageZoom: {
        options: {
          margin: 2,
          background: "rgba(var(--ifm-background-color-rgb), 0.9)",
        },
      },
      colorMode: {
        defaultMode: UserConfig.dark_mode ? "dark" : "light",
        disableSwitch: UserConfig.disable_theme_switch,
      },
      navbar: {
        title: UserProjName,
        hideOnScroll: UserConfig.hide_navbar_on_scroll,
        logo: {
          alt: "Site Logo",
          src: resolveStaticAsset(
            UserConfig.favicon,
            resolveStaticAsset(
              UserConfig.hero_section.profile_pic,
              "img/icon.png",
            ),
          ),
        },
        items: useEnabled([
          {
            type: "search",
            position: "right",
            className: "navbar-search-bar",
          },
          {
            enable: UserConfig.about_me.enable,
            value: {
              label: "About Me",
              to: "/#about",
              position: "right",
              activeBaseRegex: "^/#about",
            },
          },
          {
            enable: UserConfig.project_shelf.enable,
            value: {
              label: "Projects",
              to: "/#projects",
              position: "right",
              activeBaseRegex: "^/#projects",
            },
          },
          {
            enable: UserConfig.experience.enable,
            value: {
              label: "Experience",
              to: "/#experience",
              position: "right",
              activeBaseRegex: "^/#experience",
            },
          },
          {
            enable: UserConfig.social_links.enable,
            value: {
              label: "Contact",
              to: "/#contact",
              position: "right",
              activeBaseRegex: "^/$contact",
            },
          },
          {
            type: "dropdown",
            label: "More",
            position: "right",
            className: "_navbar-more-items",
            items: useEnabled([
              { label: "Notes", to: "/notes" },
              { label: "Blog", to: "/blog" },
              {
                enable: UserConfig.tasks_page.enable,
                value: { label: "Tasks", to: "/tasks" },
              },
              {
                enable: !UserConfig.disable_branding,
                value: {
                  label: `Portosaurus v${version}`,
                  className: "_nav-protosaurus-version",
                  to: "https://github.com/soymadip/portosaurus",
                },
              },
            ]),
          },
        ]),
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      prism: {
        theme: catppuccinLatte,
        darkTheme: catppuccinMocha,
        additionalLanguages: ["java", "php", "bash"],
      },
      footer: {},
    },

    plugins: [
      function portosaurusWebpackTranspiler() {
        return {
          name: "portosaurus-transpile",
          configureWebpack(_, isServer, utils) {
            const jsLoader = utils.getJSLoader({ isServer });
            jsLoader.options = { ...jsLoader.options, ignore: [] };

            return {
              mergeStrategy: { "module.rules": "prepend" },
              resolve: {
                alias: {
                  "@porto": path.resolve(PortoRoot, "src"),
                  portosaurus: PortoRoot,
                },
              },
              module: {
                rules: [
                  {
                    test: /\.[jt]sx?$/,
                    include: [path.resolve(PortoRoot, "src")],
                    use: [jsLoader],
                  },
                ],
              },
            };
          },
        };
      },
      path.resolve(PortoRoot, "src/plugins/favicon.mjs"),
      path.resolve(PortoRoot, "src/plugins/robots.mjs"),
      [
        require.resolve("@easyops-cn/docusaurus-search-local", {
          paths: [UserRoot, PortoRoot],
        }),
        {
          hashed: true,
          indexDocs: true,
          docsDir: UserNotesDir,
          docsRouteBasePath: "notes",
          searchContextByPaths: ["notes", "blog"],
          highlightSearchTermsOnTargetPage: true,
          explicitSearchResultPath: true,
          hideSearchBarWithNoSearchContext: true,
          language: ["en"],
        },
      ],
      "plugin-image-zoom",
    ],

    staticDirectories: StaticDirs,
  };

  return config;
}
