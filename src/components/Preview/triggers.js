import React, { useEffect, useMemo } from "react";
import { useLocation } from "@docusaurus/router";
import { usePreview } from "./context";
import Tooltip from "@site/src/components/Tooltip";
import styles from "./styles.module.css";

// Normalize props into a sources array
function normalizeSources({ path, label, sources }) {
  if (sources && sources.length > 0) return sources;
  if (path) return [{ path, label: label || path.split("/").pop() }];
  return [];
}

// --- Inline trigger: <Preview path="..." label="...">link text</Preview> ---
export default function Preview(props) {
  const { children } = props;
  const {
    isOpen,
    sources: activeSources,
    openPreview,
    closePreview,
  } = usePreview();
  const location = useLocation();
  
  const srcList = useMemo(() => normalizeSources(props), [
    props.path,
    props.label,
    props.sources,
  ]);

  // Hash-based deep link auto-open
  const { path, label, id } = props;
  const autoId =
    id ||
    (label || path?.split("/").pop() || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  useEffect(() => {
    // Timeout ensuring Docusaurus has fully hydrated before aggressively opening the modal
    const timer = setTimeout(() => {
      // Use native window hash because router useLocation() becomes stale when we use replaceState() silently
      const currentHash = typeof window !== "undefined" ? window.location.hash : location.hash;
      if (autoId && currentHash === `#${autoId}`) {
        openPreview(srcList, 0, autoId);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash, autoId, srcList, openPreview]); // re-run if hash changes in SPA

  if (srcList.length === 0) return <span>{children}</span>;

  const handleClick = () => {
    const alreadyOpen =
      isOpen &&
      activeSources.length === srcList.length &&
      activeSources[0]?.path === srcList[0]?.path;
    if (alreadyOpen) {
      closePreview();
    } else {
      openPreview(srcList, 0, autoId);
    }
  };

  return (
    <span className={styles.previewContainer}>
      <Tooltip
        msg={`Preview: ${srcList[0]?.label || path.split("/").pop()}`}
        position="top"
        underline={false}
      >
        <span
          className={styles.previewTrigger}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
          {children}
        </span>
      </Tooltip>
    </span>
  );
}

// --- Footer source list: <SourcePreview sources={[...]} /> ---
export function SourcePreview(props) {
  const { prefixText = "Source file: " } = props;
  const { isOpen, sources: activeSources, activeIndex, openPreview, closePreview, setDocked } = usePreview();
  const location = useLocation();
  
  const srcList = useMemo(() => normalizeSources(props), [
    props.path,
    props.label,
    props.sources,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentHash = typeof window !== "undefined" ? window.location.hash : location.hash;
      if (!currentHash) return;
      
      const hashStr = currentHash.replace("#", "");
      const targetIdx = srcList.findIndex((src) => {
        const sourceLabel = src?.label || src?.path?.split("/").pop() || "";
        const sourceHash = props.id || sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return sourceHash === hashStr;
      });

      if (targetIdx !== -1) {
        if (props.defaultDocked) setDocked(true);
        openPreview(srcList, targetIdx, hashStr);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash, srcList, openPreview, props.id, props.defaultDocked, setDocked]);

  if (srcList.length === 0) return null;

  const { id } = props;

  const handleClick = (idx) => {
    const isSame =
      isOpen &&
      activeSources.length === srcList.length &&
      activeSources[idx]?.path === srcList[idx]?.path &&
      activeIndex === idx;
      
    if (isSame) {
      closePreview();
    } else {
      const sourceLabel = srcList[idx]?.label || srcList[idx]?.path.split("/").pop() || "";
      const sourceHash = props.id || sourceLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (props.defaultDocked) setDocked(true);
      openPreview(srcList, idx, sourceHash);
    }
  };

  return (
    <div className={styles.sourceFooter}>
      <span className={styles.sourceFooterLabel}>{prefixText}</span>
      {srcList.map((src, idx) => (
        <React.Fragment key={idx}>
          <a
            className={styles.previewTrigger}
            onClick={() => handleClick(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick(idx)}
          >
            {src.label || src.path.split("/").pop()}
          </a>
          {idx < srcList.length - 1 ? ", " : ""}
        </React.Fragment>
      ))}
    </div>
  );
}
