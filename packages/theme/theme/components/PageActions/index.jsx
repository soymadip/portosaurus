import { useState, useEffect } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Pv from "../Preview/components/Triggers/Pv.jsx";
import Icon from "../Icon/index.jsx";
import clsx from "clsx";
import CopyDropdown from "./CopyDropdown.jsx";
import styles from "./styles.module.css";

export default function PageActions({ className }) {
  const { frontMatter } = useDoc();
  const sourceRaw = frontMatter?.source;

  return (
    <div className={clsx(styles.container, className)}>
      {sourceRaw && (
        <div className={styles.sourceBtn}>
          <Pv href={sourceRaw} activeIdx={0} noUl>
            <div
              className={styles.actionBtn}
              title={
                Array.isArray(sourceRaw) && sourceRaw.length > 1
                  ? "View Sources"
                  : "View Source"
              }
            >
              <Icon id="lucide:code-xml" className={styles.iconOnly} />
            </div>
          </Pv>
        </div>
      )}

      <CopyDropdown />
    </div>
  );
}
