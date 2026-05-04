import Layout from "@theme/Layout";
import NoteCards from "../components/NoteIndex/index.js";
import { usePluginData } from "@docusaurus/useGlobalData";
import NavArrow from "../components/NavArrow/index.js";
import HashNavigation from "../utils/HashNavigation.js";
const style = {
  notesContainer: { padding: "2rem 0", maxWidth: "1200px", margin: "0 auto" },
  pageTitle: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "var(--ifm-color-primary)",
    animation: "slideUp 0.5s ease-out forwards",
  },
  pageDescription: {
    fontSize: "0.9rem",
    textAlign: "center",
    color: "var(--ifm-font-color-tertiary)",
    marginBottom: "2rem",
    animation: "slideUp 0.5s ease-out 0.2s forwards",
  },
  "@keyframes slideUp": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    notesContainer: { animation: "none !important" },
    pageTitle: { animation: "none !important" },
    pageDescription: { animation: "none !important", opacity: 1 },
  },
};
export default function Notes() {
  const { path: docsBasePath } = usePluginData(
    "docusaurus-plugin-content-docs",
  );
  const pathName = docsBasePath.replace("/", "");
  const pageTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  return jsxDEV_7x81h0kn(
    Layout,
    {
      title: pageTitle,
      description: `My ${pageTitle}`,
      children: jsxDEV_7x81h0kn(
        "main",
        {
          style: style.notesContainer,
          children: jsxDEV_7x81h0kn(
            "div",
            {
              className: "container",
              children: [
                jsxDEV_7x81h0kn(
                  "header",
                  {
                    className: "text-center mb-4",
                    children: [
                      jsxDEV_7x81h0kn(
                        "h1",
                        { style: style.pageTitle, children: "My Notes" },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                      jsxDEV_7x81h0kn(
                        "p",
                        {
                          style: style.pageDescription,
                          children:
                            "A collection of my self written notes & reference guides",
                        },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                    ],
                  },
                  undefined,
                  true,
                  undefined,
                  this,
                ),
                jsxDEV_7x81h0kn(
                  NoteCards,
                  {},
                  undefined,
                  false,
                  undefined,
                  this,
                ),
                jsxDEV_7x81h0kn(
                  NavArrow,
                  {},
                  undefined,
                  false,
                  undefined,
                  this,
                ),
                jsxDEV_7x81h0kn(
                  HashNavigation,
                  {
                    elementPrefix: "note-",
                    elementSelector: ".note-card",
                    effectDuration: 6000,
                  },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
              ],
            },
            undefined,
            true,
            undefined,
            this,
          ),
        },
        undefined,
        false,
        undefined,
        this,
      ),
    },
    undefined,
    false,
    undefined,
    this,
  );
}
