import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./style.css";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, siteData }) {
    // Register metadata from themeConfig as a global property
    const metadata = siteData.value.themeConfig.metadata;
    app.config.globalProperties.meta = metadata;
  },
};
