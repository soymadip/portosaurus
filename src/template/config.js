/**
 * Portosaurus Site Configuration
 * Defines your digital personality, theme, and layouts.
 */
exports.usrConf = {
  dark_mode: true,

  site_url: "auto",
  site_path: "auto",
  robots_txt: true,
  favicon: "{{portoRoot}}/src/assets/img/icon.png", // Default Portosaurus Image
  social_card: "{{portoRoot}}/src/assets/img/social-card.jpeg",
  collapsable_sidebar: true,
  hide_navbar_on_scroll: true,
  disable_theme_switch: false,
  rss: true,

  cors_proxy: [],

  hero_section: {
    title: "Your Name",
    intro: "Hello there, I'm",
    subtitle: "I am a",
    profession: "Your Profession",
    description: "Short description about your profession, passion, goals.",
    learn_more_button_txt: "Learn More",
    profile_pic: "{{portoRoot}}/src/assets/img/icon.png",
  },

  about_me: {
    enable: true,
    image: null, // Falls back to hero_section.profile_pic
    description: [
      "Write about yourself here.",
      "Add as many paragraphs as you want.",
    ],
    skills: ["Skill 1", "Skill 2"],
    resume_link: "",
  },

  project_shelf: {
    enable: true,
    projects: [],
  },

  experience: {
    enable: false,
    list: [],
  },

  social_links: {
    enable: true,
    links: [],
  },

  tasks_page: {
    enable: false,
    title: "Tasks",
    description: "Track your tasks and projects here.",
    tasks: [],
  },

  link_shortener: {
    enable: false,
    deploy_path: "/l",
    short_links: {},
  },
};
