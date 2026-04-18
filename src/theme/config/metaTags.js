import { getCssVar } from "../utils/cssUtils.js";

const backgroundColor = getCssVar("--ifm-background-color");

export const metaTags = [
  // Theme color meta tags
  {
    tagName: "meta",
    attributes: {
      name: "msapplication-TileColor",
      content: backgroundColor,
    },
  },
  {
    tagName: "meta",
    attributes: {
      name: "theme-color",
      content: backgroundColor,
    },
  },
];
