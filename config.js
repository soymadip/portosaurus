exports.usrConf = {
  dark_mode: true,

  site_url: "https://soymadip.github.io",
  site_path: "/portosaurus",

  srt_url: "${site_url}${site_path}/l",

  rebots_txt: true,
  social_card: "/img/social-card.jpeg",
  colapsable_sidebar: true,
  hide_navbar_on_scroll: true,
  disable_theme_switch: false,
  rss: true,

  hero_section: {
    title: "Your Name",
    profession: "Your Profession",
    description:
      "Short description about you, your passion, your goals etc.",
    profile_pic: "https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png",
  },

  about_me: {
    enable: true,

    title: "Your Name",
    subtitle: null,
    image: "${hero_section.profile_pic}",

    description: [
      "I'm a passionate FOSS developer with expertise in designing and building solutions for real-world problems.",
      "My journey in software development started with a simple desire to automate repetitive tasks, specially in my PC.",
      "I believe in the power of open-source software and the community around it. My goal is to contribute to FOSS and to continuously learn and improve my skills.",
    ],
    skills: [
      "Python",
      "Bash",
      "Linux",
      "Git",
      "Docker",
      "C",
      "lua",
      "JavaScript",
      "CI/CD",
    ],
    resumeLink: "${srt_url}/resume",
  },

  project_shelf: {
    enable: true,
    projects: [
      {
        title: "Portusaurus",
        featured: true,
        state: "active",
        desc: "Your complete portfolio solution.",
        image: "https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png",
        website: null,
        github: "https://github.com/soymadip/portosaurus",
        Demo: "https://soymadip.github.io",
        tags: ["portfolio", "javascript"],
      },
    ],
  },


  social_links: {

    enable: true,
    links: [
      {
        name: "Email",
        icon: "mail",
        desc: "Send me an email",
        url: "${srt_url}/mail",
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        desc: "Connect on LinkedIn",
        url: "${srt_url}/linkedin",
        pin: true,
      },
      {
        name: "Telegram",
        icon: "telegram",
        desc: "Reach me on Telegram",
        url: "${srt_url}/telegram",
        pin: true,
      },
    ],
  },

  link_shortener: {
    // Uses StaticShort

    enable: true,
    deploy_path: "/l",

    short_links: {
      mail: "mailto://soumadip377@gmail.com",
      github: "https://github.com/soymadip",
      gitlab: "https://gitlab.com/soymadip",
      linkedin: "https://linkedin.com/in/soymadip",
      telegram: "https://telegram.me/soymadip",
    },
  },

  experience: {
    enable: false,
    list: [
      {
        company: "Company A",
        position: "Software Engineer",
        duration: "Jan 2020 - Present",
        description: [
          "Developed and maintained web applications using JavaScript, HTML, and CSS.",
          "Collaborated with cross-functional teams to define, design, and ship new features.",
          "Identified and fixed bugs to improve application performance.",
        ],
      },
      {
        company: "Company B",
        position: "Intern",
        duration: "Jun 2019 - Dec 2019",
        description: [
          "Assisted in the development of internal tools using Python and Bash.",
          "Participated in code reviews and provided feedback to improve code quality.",
          "Conducted research and provided recommendations for new technologies.",
        ],
      },
    ],
  },
};


exports.tasks = {
  enable: true,
  list: [
    {
      title: "Add more Callouts",
      description: "like question..",
      status: "pending",
      priority: "medium",
    },
    {
      title: "Add colors to Markdown Headings",
      description: "Take from Obsidian",
      status: "pending",
      priority: "high",
    },
    {
      title: "Improve the Note card Icon extractor",
      description:
        "make it strip number before dir name, currently It shows blank icon(default book).",
      status: "completed",
      priority: "high",
    },
    {
      title: "Improve Roadmap page",
      description:
        "add sub todos, shift from vibe code to orignal code, make mobile friendly",
      status: "pending",
      priority: "low",
    },
    {
      title: "Fix Mermaid Diagram support",
      description:
        "showing: Hook is called outside the <ColorModeProvider>. Please see https://docusaurus.io/docs/api/themes/configuration#use-color-mode.",
      status: "pending",
      priority: "medium",
    },
    {
      title: "check prism js, dark and light background swap",
      status: "completed",
      description: "Looking better now.",
      priority: "low",
    },
    {
      title: "Make standalone Project.",
      description: "Convert to Portosaurus project. remove personal stuff.",
      priority: "high",
      status: "active",
    },
    {
      title: "Separate portfolio config",
      description: "Separate portfolio specific settings to config.js.",
      priority: "high",
      status: "completed",
    },
    {
      title: "make shortlinks icon field optional",
      description:
        "lower the title, then match in mapping. if icon key is defined, use it.",
      priority: "low",
      status: "pending",
    },
    {
      title: "Rearrange the config.js",
      description:
        "Rearrange config, make more abstract. Add hero section configs.",
      status: "active",
      priority: "high",
    },
    {
      title: "Fix favicon logic",
      description:
        "Fix favicon gen failed even if given diff value in usrConf.favicon, also when usrConf.hero_section.profile_pic to /img/some-pic.png",
      status: "active",
      priority: "high",
    },
    {
      title: "Fix project shelf image placing",
      description: "The image should align in the middle of card. Then fill the space if needed.",
      status: "active",
      priority: "low",
    },
    {
      title: "Add shortlink generation",
      description: "setup StaticShort while compiling portosaurus.",
      status: "active",
      priority: "normal",
    },
  ],
};
