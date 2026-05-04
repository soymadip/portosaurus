import React, { useRef, useEffect } from "react";
import styles from "../styles.module.css";
export default function FileTabs({ sources, activeIndex, onSelect }) {
  const tabRefs = useRef([]);
  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);
  if (!sources || sources.length <= 1) return null;
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.tabs,
      children: sources.map((src, i) =>
        jsxDEV_7x81h0kn(
          "button",
          {
            ref: (el) => (tabRefs.current[i] = el),
            className: `${styles.tab} ${i === activeIndex ? styles.activeTab : ""}`,
            onClick: () => onSelect(i),
            children: src.label || src.path.split("/").pop(),
          },
          i,
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
