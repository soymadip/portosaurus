import fs from "fs";
import path from "path";
import { PortoRoot, Paths, PortoPkg } from "./constants.mjs";
import {
  loadPkg,
  getGitDate,
  useEnabled,
  getNestedValue,
} from "../utils/systemUtils.mjs";
import {
  resolveVars,
  resolveSiteUrl,
  resolveBasePath,
  createStaticAssetResolver,
  buildHeadTags,
} from "../utils/configUtils.mjs";

export function buildDocuConfig(UserConfigRaw, UserRoot) {
  // Get user Project Version
  const usrProjectVer = loadPkg(UserRoot).version || "0.0.0";

  const portoVersion = PortoPkg.version || "0.0.0";
  const portoRepo = (PortoPkg.repository?.url || "").replace(/\.git$/, "");
  const lastUpdated = getGitDate(UserRoot);

  // Static directories
  const UserStaticDir = path.resolve(UserRoot, "static");
  const PortoAssetDir = Paths.assets;

  // Resolve static asset path with fallback
  const resolveStaticAsset = createStaticAssetResolver(
    UserRoot,
    UserStaticDir,
    PortoAssetDir,
  );

  // Resolve SiteURL and BasePath for Docusaurus Root
  const usrSiteUrl = resolveSiteUrl(UserConfigRaw.site?.url || "auto");
  const ursSitePath = resolveBasePath(UserConfigRaw.site?.path || "auto");

  // Resolve {{...}} template variables in user config
  const UserConfig = resolveVars(UserConfigRaw, UserConfigRaw, {
    siteRoot: UserRoot,
    portoRoot: PortoRoot,
    compileYear: new Date().getFullYear(),
    compileDate: new Date().toLocaleDateString(),
    portoVersion,
    projectVersion: usrProjectVer,
    siteUrl: usrSiteUrl,
    baseUrl: ursSitePath,
    lastUpdated,
    isProd: process.env.NODE_ENV === "production",
    isDev: process.env.NODE_ENV === "development",
    nodeEnv: process.env.NODE_ENV || "development",
    custom: UserConfigRaw.custom || {},
  });

  // Helper to get nested values with fallbacks
  const get = (...args) => getNestedValue(UserConfig, ...args);

  // ─────────────────────── Build the Docusaurus config ───────────────────────

  /** The primary title of your website (e.g., your name or brand) */
  const siteName = get("site.title", "Your Name");
  const siteUrl = usrSiteUrl;
  const sitePath = ursSitePath;

  const UserNotesDir = "notes";
  const UserBlogDir = "blog";
  const UserTasksDir = "tasks";

  const config = {
    projectName: siteName,
    title: siteName,

    /** A short, catchy description shown below the title on the home page */
    tagline: get(
      "site.tagline",
      "Short description about you, your passion, your goals etc.",
    ),

    url: siteUrl,
    baseUrl: sitePath,

    // Checks user's given favicon path -> internal favicon/favicon.ico -> img/icon.png
    favicon: resolveStaticAsset(
      get("site.favicon", ""),
      resolveStaticAsset("favicon/favicon.ico", "img/icon.png"),
    ),

    organizationName: siteName,

    /** Behavior when a broken anchor link is found (throw, warn, ignore) */
    onBrokenAnchors: get("site.on_broken_anchors", "throw"),

    /** Behavior when a broken internal link is found (throw, warn, ignore) */
    onBrokenLinks: get("site.on_broken_links", "throw"),

    // TODO: research & allow to configure this
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
    },

    headTags: buildHeadTags([
      {
        meta: {
          name: "msapplication-TileColor",
          content: "var(--ifm-background-color)",
        },
      },
      {
        meta: {
          name: "theme-color",
          content: "var(--ifm-background-color)",
        },
      },
      ...get("site.head_tags", []),
    ]),

    customFields: {
      portoVersion,

      corsProxyList: [
        ...[].concat(get("site.cors_proxy", [])),
        "https://cors-proxy.soymadip.workers.dev/?url=",
        "https://api.allorigins.win/raw?url=",
      ].filter(Boolean),

      heroSection: {
        profilePic: resolveStaticAsset(
          get("home_page.hero.profile_pic", "site.favicon", ""),
          "img/icon.png",
        ),
        intro: get("home_page.hero.intro", "Hello there, I'm"),
        title: get("home_page.hero.title", "site.title", "Your Name"),
        subtitle: get("home_page.hero.subtitle", "I am a"),
        profession: get("home_page.hero.profession", "Your Profession"),
        desc: get(
          "home_page.hero.desc",
          "site.tagline",
          "Welcome to my portfolio.",
        ),
        learnMoreButtonTxt: get(
          "home_page.hero.learn_more_btn_txt",
          "Learn More",
        ),
        social: get("home_page.hero.social", null),
      },

      aboutMe: {
        /** Enable or disable the About Me section entirely */
        enable: get("home_page.about.enable", true),

        /** Heading text for the About section */
        heading: get("home_page.about.heading", "About Me"),

        /** The main image for the About section */
        image: resolveStaticAsset(
          get(
            "home_page.about.image",
            "home_page.hero.profile_pic",
            "site.favicon",
            "",
          ),
          "img/icon.png",
        ),
        /** A detailed bio or description about yourself (Array of strings for paragraphs) */
        bio: get("home_page.about.bio", [
          "I am a developer who loves turning ideas into reality.",
          "With background in computer science and a passion for design, I bridge the gap between aesthetics and functionality.",
          "Driven by curiosity and a commitment to excellence.",
        ]),

        /** A list of your professional skills or technologies */
        skills: get("home_page.about.skills", [
          "skill1",
          "skill2",
          "skill3",
          "skill4",
        ]),
        /** The title shown above the skills list */
        skillsHeading: get("home_page.about.skills_heading", "My Skills"),
        /** Path to your professional resume (PDF or external link) */
        resume: resolveStaticAsset(get("home_page.about.resume", null), null),
      },

      projects: {
        /** Enable or disable the Projects section */
        enable: get("home_page.project_shelf.enable", true),

        /** Heading for the projects section */
        heading: get("home_page.project_shelf.heading", "My Projects"),

        /** Sub-heading or description for your project shelf */
        subheading: get(
          "home_page.project_shelf.subheading",
          "A collection of all my works, with featured projects highlighted",
        ),
        /** Enable automatic scrolling for the project cards */
        autoplay: get("home_page.project_shelf.autoplay", true),

        /** The list of projects to display (Array of project objects) */
        projects: get("home_page.project_shelf.projects", [
          {
            title: "Project One",
            desc: "A brief description of your project and the tech used.",
            tags: ["React", "Portosaurus"],
            state: "active",
            website: "https://example.com",
            repo: "https://github.com/",
            demo: "https://example.com/demo",
          },
          {
            title: "Project Two",
            icon: PortoRoot + "/img/icon.png",
            featured: true,
            desc: "Another awesome project you've built recently.",
            tags: ["python", "tag2"],
            state: "completed",
            website: "https://example.com",
            repo: "https://github.com/",
          },
        ]).map((p) => ({
          ...p,
          icon: resolveStaticAsset(p.icon, ""),
        })),
      },

      // TODO
      experience: {
        /** Enable or disable the Experience timeline */
        enable: get("home_page.experience.enable", false),

        /** Heading for the experience section */
        heading: get("home_page.experience.heading", "Experience"),

        /** Sub-heading for your professional journey */
        subheading: get(
          "home_page.experience.subheading",
          "My professional journey and work experience",
        ),
        /** List of work history items */
        list: get("home_page.experience.list", []),
      },

      socialLinks: {
        /** Enable or disable the Social Links / Contact section */
        enable: get("home_page.social.enable", true),

        /** Heading for the contact section */
        heading: get("home_page.social.heading", "Get In Touch"),

        /** Brief call-to-action or invitation to contact you */
        subheading: get(
          "home_page.social.subheading",
          "Feel free to reach out for collaborations, questions, or just to say hello!",
        ),
        /** List of social media profiles and contact methods */
        links: get("home_page.social.links", [
          {
            name: "Email",
            desc: "Send me an email",
            url: "mailto://you@yourdomain.com",
          },
          {
            name: "LinkedIn",
            desc: "Connect on LinkedIn",
            url: "https://www.linkedin.com/in/yourusername",
          },
        ]),
      },

      robotsTxt: {
        /** Enable generation of robots.txt file */
        enable: get("site.robots_txt.enable", true),
        rules: [{ disallow: [`/${UserNotesDir}/`, `/${UserTasksDir}/`] }],

        /** Additional custom lines to add to robots.txt */
        customLines: get("site.robots_txt.custom_lines", []),
      },

      tasksPage: {
        /** Enable or disable the Tasks/TODO page */
        enable: get("tasks.enable", false),

        /** Title for the Tasks page */
        title: get("tasks.title", "Tasks"),

        /** Subtitle for the Tasks page */
        subtitle: get("tasks.subtitle", "My current focus and todo list"),
        taskList: get("tasks.list", []),
      },
    },

    presets: [
      [
        require.resolve("@docusaurus/preset-classic", {
          paths: [UserRoot, PortoRoot],
        }),
        {
          docs: {
            routeBasePath: UserNotesDir,
            path: UserNotesDir,
            sidebarPath: path.resolve(PortoRoot, "src/theme/config/sidebar.js"),
            admonitions: {
              extendDefaults: true,
              // keywords: [
              //   "note",
              //   "tip",
              //   "info",
              //   "warning",
              //   "danger",
              //   "question",
              // ],
            },
          },
          blog: {
            path: UserBlogDir,
            feedOptions: get("site.rss", true)
              ? { type: ["rss", "atom"], xslt: true }
              : undefined,
            showReadingTime: false,
            onInlineTags: "warn",
            onInlineAuthors: "warn",
            onUntruncatedBlogPosts: "warn",
          },
          theme: {
            customCss: path.resolve(PortoRoot, "src/theme/css/custom.css"),
          },
          pages: {
            path: path.resolve(PortoRoot, "src/theme/pages"),
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
          themeDir: path.resolve(PortoRoot, "src/theme"),
        },
      ],
    ],

    markdown: {
      mermaid: get("theme.markdown.mermaid", true),
      hooks: {
        onBrokenMarkdownLinks: get("theme.markdown.on_broken_links", "throw"),
        onBrokenMarkdownImages: get("theme.markdown.on_broken_images", "throw"),
      },
    },

    themeConfig: {
      image: resolveStaticAsset(
        get("site.social_card", ""),
        "img/social-card.jpeg",
      ),

      docs: {
        sidebar: {
          hideable: get("theme.navigation.collapsable_sidebar", true),
        },
      },

      imageZoom: {
        options: {
          margin: 2,
          background: "rgba(var(--ifm-background-color-rgb), 0.9)",
        },
      },

      colorMode: {
        defaultMode: get("theme.appearance.dark_mode", true) ? "dark" : "light",
        disableSwitch: get("theme.appearance.disable_switch", false),
      },
      navbar: {
        title: get("site.title", "Your Portfolio"),
        hideOnScroll: get("theme.navigation.hide_navbar_on_scroll", true),
        logo: {
          alt: "Site Logo",
          src: resolveStaticAsset(
            get("site.favicon", ""),
            resolveStaticAsset(
              get("home_page.hero.profile_pic", ""),
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
            enable: get("home_page.about.enable", true),
            value: {
              label: "About Me",
              to: "/#about",
              position: "right",
              activeBaseRegex: "^/#about",
            },
          },
          {
            enable: get("home_page.project_shelf.enable", true),
            value: {
              label: "Projects",
              to: "/#projects",
              position: "right",
              activeBaseRegex: "^/#projects",
            },
          },
          {
            enable: get("home_page.experience.enable", false),
            value: {
              label: "Experience",
              to: "/#experience",
              position: "right",
              activeBaseRegex: "^/#experience",
            },
          },
          {
            enable: get("home_page.social.enable", true),
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
              { label: "Notes", to: `/${UserNotesDir}` },
              { label: "Blog", to: `/${UserBlogDir}` },
              {
                /** Toggle the Tasks page visibility */
                enable: get("home_page.tasks.enable", false),
                value: { label: "Tasks", to: `/${UserTasksDir}` },
              },
              {
                /** Hide the 'Powered by Portosaurus' branding in the menu */
                enable: !get("theme.appearance.disable_branding", false),
                value: {
                  label: `Portosaurus v${portoVersion}`,
                  className: "_nav-protosaurus-version",
                  to: portoRepo,
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
        theme: (function () {
          try {
            return require(path.resolve(PortoRoot, "src/theme/config/prism.js"))
              .catppuccinLatte;
          } catch {
            return {};
          }
        })(),
        darkTheme: (function () {
          try {
            return require(path.resolve(PortoRoot, "src/theme/config/prism.js"))
              .catppuccinMocha;
          } catch {
            return {};
          }
        })(),
        additionalLanguages: ["java", "php", "bash", "diff"],
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
          docsRouteBasePath: UserNotesDir,
          searchContextByPaths: [UserNotesDir, UserBlogDir],
          highlightSearchTermsOnTargetPage: true,
          explicitSearchResultPath: true,
          hideSearchBarWithNoSearchContext: true,
          language: ["en"],
        },
      ],
      "plugin-image-zoom",
    ],

    staticDirectories: [
      UserStaticDir,
      PortoAssetDir,
      path.resolve(UserRoot, ".docusaurus/portosaurus/favicon"),
    ].filter((d) => fs.existsSync(d)),
  };

  return config;
}
