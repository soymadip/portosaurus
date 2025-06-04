exports.usrConf = {

  favicon: 'favicon/favicon.ico',

  dark_mode: true,

  site_url:  'https://.soymadip.github.io',
  site_path: '/',

  srt_url:   "${site_url}/l",

  opt_features: {
    rebots_txt: true,
    social_card: "img/social-card.jpeg",
    colapsable_sidebar: true,
    hide_navbar_on_scroll: true,
    disable_theme_switch: false,
    rss: true,
  },

  hero_section: {
    tagline: 'Your profession',
    profile_pic: 'https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png',
  },

  about_me: {
    enable: true,
    title: "Your Name",
    subtitle: null,
    image: "${hero_section.profile_pic}",

    description: [
      "I'm a passionate FOSS developer with expertise in designing and building solutions for real-world problems.",
      "My journey in software development started with a simple desire to automate repetitive tasks, specially in my PC.",
      "I believe in the power of open-source software and the community around it. My goal is to contribute to FOSS and to continuously learn and improve my skills."
    ],
    skills: [
      "Python", "Bash", "Linux", "Git", "Docker",
      "C", "lua", "JavaScript", "CI/CD"
    ],
    resumeLink: "${srt_url}/resume"
  },

  project_shelf: {
    enable: true,
    projects: [
    {
      title:   "Your Awsome project",
      state:   'active',
      featured: true,
      desc:    "Description about your awsome project.",
      image:   "https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png",
      github:  "https://github.com/soymadip/portosaurus.git",
      website: null,
      Demo:    null,
      tags: ["portfolio", "website"],
    },
  ],
  },


  social_links: {

    enable:true,
    links: [
    {
      name: 'Email',
      icon: 'mail',
      desc: 'Send me an email',
      url: "${srt_url}/mail",
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      desc: 'Connect on LinkedIn',
      url: "${srt_url}/linkedin",
      pin: true
    },
    {
      name: 'Telegram',
      icon: 'telegram',
      desc: 'Reach me on Telegram',
      url: "${srt_url}/telegram",
      pin: true
    },
    {
      name: 'Discord',
      icon: 'discord',
      desc: 'Become my friend',
      url: "${srt_url}/discord",
    },
    {
      name: 'Twitter',
      icon: 'x',
      desc: 'Find me on Twitter',
      url:  "${srt_url}/twitter"
    },
    {
      name: 'GitHub',
      icon: 'githubalt',
      desc: 'Check out my git repos',
      url: "${srt_url}/github",
      pin: true
    },
    {
      name: 'GitLab',
      icon: 'gitlab',
      desc: 'View my GitLab profile',
      url: "${srt_url}/gitlab",
    },
    {
      name: 'Anilist',
      icon: 'anilist',
      desc: 'If you are otaku, check out!',
      url: "${srt_url}/anilist",
    },
    {
      name: 'Simkl',
      icon: 'simkl',
      desc: 'I watch Movies & Series too!',
      url: "${srt_url}/simkl",
    }
  ]
  },

  link_shortener: {   // Uses StaticShort

    enable: true,
    deploy_path: "/l",

    short_links: {
      "mail"         :  "mailto://soumadip377@gmail.com",
      "github"       :  "https://github.com/soymadip",
      "gitlab"       :  "https://gitlab.com/soymadip",
      "linkedin"     :  "https://linkedin.com/in/soymadip",
      "telegram"     :  "https://telegram.me/soymadip",
      "reddit"       :  "https://www.reddit.com/user/soymadip",
      "anilist"      :  "https://anilist.co/user/soymadip/",
      "mal"          :  "https://myanimelist.net/profile/soymadip",
      "twitter"      :  "https://x.com/soymadip",
      "mastodon"     :  "https://mastodon.online/@soymadip",
      "discord"      :  "https://discord.com/users/778278661811863592",
      "roadmap"      :  "https://roadmap.sh/u/soymadip",
      "replit"       :  "https://replit.com/@soymadip",
      "signal"       :  "https://signal.me/#eu/JxnJ32zIRQxm_lG4PWfkcasdR1zwGd2ln9lY8EXkzm-gy-gwj91PgZz4Qo1CiWpQ",
      "yt"           :  "https://youtube.com/@soymadip",
      "instagram"    :  "https://www.instagram.com/soymadip_",
      "simkl"        :  "https://simkl.com/5929351/"
    }
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
          "Identified and fixed bugs to improve application performance."
        ]
      },
      {
        company: "Company B",
        position: "Intern",
        duration: "Jun 2019 - Dec 2019",
        description: [
          "Assisted in the development of internal tools using Python and Bash.",
          "Participated in code reviews and provided feedback to improve code quality.",
          "Conducted research and provided recommendations for new technologies."
        ]
      }
    ]
  }
};


exports.tasks = {

  enable: true,
  list: [
    {
      title: "make shortlinks icon field optional", 
      description: "lower the title, then match in mapping. if icon key is defined, use it.",
      priority: "low",
      status: "pending"
    },
    {
      title: "Rearrange the config.js",
      description: "Rearrange config, make more abstract. Add hero section configs.",
      status: "acribe",
      priority: "high"
    }
  ]  
}