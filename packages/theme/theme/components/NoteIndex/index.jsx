import useBaseUrl from "@docusaurus/useBaseUrl";
import { usePluginData } from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";
import { FaBook, FaChevronRight } from "react-icons/fa";
import Tooltip from "../Tooltip/index.js";
import { iconMap } from "../../config/iconMappings.js";
import DocCardList from "@theme/DocCardList";
import styles from "./styles.module.css";
function useNotes() {
  const context = require.context(`@site/notes`, true, /index\.mdx?$|\.mdx?$/);
  return context
    .keys()
    .filter((path) => {
      if (path === "./index.md" || path === "./index.mdx") return false;
      const pathParts = path.split("/");
      const isTopLevelFile =
        pathParts.length === 2 && !path.match(/index\.mdx?$/);
      const isTopLevelDir =
        pathParts.length === 3 && path.match(/index\.mdx?$/);
      return isTopLevelFile || isTopLevelDir;
    })
    .map((path) => {
      const { frontMatter } = context(path);
      const pathParts = path.split("/");
      const isTopLevelFile = pathParts.length === 2;
      const fileSlug = isTopLevelFile
        ? path.replace("./", "").replace(/\.mdx?$/, "")
        : pathParts[1];
      const slug = frontMatter.slug || frontMatter.id || fileSlug;
      const rawTitle = frontMatter.title || frontMatter.language || fileSlug;
      const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      const language = frontMatter.language
        ? frontMatter.language
            .toLowerCase()
            .replace(/ /g, "")
            .replace(/[\s-]/g, "")
        : slug.toLowerCase() || title.toLowerCase();
      return {
        title,
        language,
        slug,
        desc: frontMatter.desc || "",
        position: frontMatter.sidebar_position || 999,
      };
    })
    .sort((a, b) => a.position - b.position);
}
function NoteCard({ title, language, slug, desc, index, docsBasePath }) {
  const noteUrl = useBaseUrl(`${docsBasePath}/${slug}`);
  const { icon: Icon = FaBook, color = "var(--ifm-color-primary)" } =
    iconMap[language] || iconMap[title.toLowerCase()] || {};
  const tooltipContent = desc ? desc : null;
  const cardInner = jsxDEV_7x81h0kn(
    Link,
    {
      to: noteUrl,
      className: styles.noteCard,
      style: { "--card-index": index, "--note-color": color },
      "aria-label": `Read note: ${title}`,
      children: [
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.iconWrapper,
            children: jsxDEV_7x81h0kn(
              Icon,
              { className: styles.noteIcon },
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
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.cardContent,
            children: jsxDEV_7x81h0kn(
              "h3",
              { className: styles.noteTitle, children: title },
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
        ),
        jsxDEV_7x81h0kn(
          FaChevronRight,
          { className: styles.mobileChevron },
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
  );
  return tooltipContent
    ? jsxDEV_7x81h0kn(
        Tooltip,
        {
          msg: tooltipContent,
          position: "top",
          underline: false,
          gap: -8,
          children: cardInner,
        },
        undefined,
        false,
        undefined,
        this,
      )
    : cardInner;
}
export default function NoteCards() {
  const notes = useNotes();
  const { path: docsBasePath } = usePluginData(
    "docusaurus-plugin-content-docs",
  );
  if (!notes.length) return null;
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.notesGrid,
      role: "list",
      children: notes.map((note, index) =>
        jsxDEV_7x81h0kn(
          NoteCard,
          { ...note, index, docsBasePath },
          note.slug,
          false,
          undefined,
          this,
        ),
      ),
    },
    undefined,
    false,
    undefined,
    this,
  );
}
export function TopicList({
  desc = "Click on the links below to explore the topics.",
  style = { marginTop: "-2.5rem", marginBottom: "2.5rem", textAlign: "center" },
}) {
  return jsxDEV_7x81h0kn(
    "div",
    {
      style,
      children: [
        jsxDEV_7x81h0kn(
          "p",
          { dangerouslySetInnerHTML: { __html: desc } },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(DocCardList, {}, undefined, false, undefined, this),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
