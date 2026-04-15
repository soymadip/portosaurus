import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "@docusaurus/router";
import { Highlight } from "prism-react-renderer";
import Tooltip from "@site/src/components/Tooltip";
import { usePreview } from "./context";
import styles from "./styles.module.css";

import IconDock from "@site/static/img/svg/icon-dock.svg";
import IconPopup from "@site/static/img/svg/icon-popup.svg";
import IconSave from "@site/static/img/svg/icon-save.svg";
import IconLink from "@site/static/img/svg/icon-link.svg";
import IconClose from "@site/static/img/svg/icon-close.svg";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// --- Dynamic PDF import ---
let PdfDocument, PdfPage, pdfjs;

const TEXT_EXTS = [
  "md",
  "txt",
  "js",
  "ts",
  "jsx",
  "tsx",
  "py",
  "json",
  "css",
  "yaml",
  "yml",
  "sh",
  "toml",
  "rs",
  "go",
  "java",
  "c",
  "cpp",
  "h",
  "html",
  "xml",
  "sql",
];
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

function getExt(path) {
  return (path || "").split(".").pop().toLowerCase().split("?")[0];
}

function classify(path) {
  if (!path) return "text";
  const ext = getExt(path);
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (TEXT_EXTS.includes(ext)) return "text";
  if (path.startsWith("http")) return "web";
  return "text";
}

// URL resolver — no hooks, works for both local paths and external URLs
function resolveUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (typeof window === "undefined") return path;
  const origin = window.location.origin;
  // Detect baseUrl from current pathname by checking if it diverges from root
  return origin + (path.startsWith("/") ? path : "/" + path);
}

// Self-contained code highlighter — uses prism-react-renderer directly,
// no dependency on Docusaurus's ColorModeProvider
function CodeView({ code, language }) {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <Highlight code={code} language={language || "text"}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            borderRadius: 0,
            padding: "14px 0",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            minHeight: "100%",
            background: isDark ? "#1e1e2e" : "#f6f8fa",
          }}
        >
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line })}
              style={{ display: "flex" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "3em",
                  paddingLeft: "14px",
                  userSelect: "none",
                  opacity: 0.4,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ paddingRight: "14px" }}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default function PreviewViewer() {
  const {
    isOpen,
    isDocked,
    sources,
    activeIndex,
    dockWidth,
    closePreview,
    setDocked,
    setActiveIndex,
    setDockWidth,
  } = usePreview();
  const location = useLocation();

  // Auto-close preview on route change
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      if (isOpen) closePreview();
    }
  }, [location.pathname, isOpen, closePreview]);

  const [mounted, setMounted] = useState(false);
  const [fileCache, setFileCache] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const hintTimer = useRef(null);

  // --- Mount + PDF lazy load ---
  useEffect(() => {
    setMounted(true);
    import("react-pdf").then((mod) => {
      PdfDocument = mod.Document;
      PdfPage = mod.Page;
      pdfjs = mod.pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfReady(true);
    });
    return () => setMounted(false);
  }, []);

  // --- Derived state ---
  const currentFile = sources[activeIndex] ?? sources[0] ?? null;
  const fileType = currentFile ? classify(currentFile.path) : null;
  const ext = currentFile ? getExt(currentFile.path) : "";
  const fileUrl = currentFile ? resolveUrl(currentFile.path) : "";

  // --- Fetch text files ---
  useEffect(() => {
    if (!isOpen || !currentFile || fileType !== "text") return;
    const { path } = currentFile;
    if (fileCache[path] || errors[path]) return;
    setLoading(true);
    fetch(resolveUrl(path))
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.text();
      })
      .then((text) => setFileCache((p) => ({ ...p, [path]: text })))
      .catch((err) => setErrors((p) => ({ ...p, [path]: err.message })))
      .finally(() => setLoading(false));
  }, [isOpen, currentFile?.path, fileType]);

  // --- Web page hint ---
  useEffect(() => {
    clearTimeout(hintTimer.current);
    if (fileType === "web" && isOpen) {
      setHintVisible(true);
      hintTimer.current = setTimeout(() => setHintVisible(false), 6000);
    } else {
      setHintVisible(false);
    }
    return () => clearTimeout(hintTimer.current);
  }, [fileType, activeIndex, isOpen]);

  // Track whether WE collapsed the sidebar so we know when to expand it back
  const weCollapsedSidebar = useRef(false);

  // --- Dock layout: body class + CSS variable + native sidebar collapse ---
  useEffect(() => {
    const active = isOpen && isDocked;

    // Toggle body classes inside the effect
    if (active) {
      document.body.classList.add("preview-is-docked");
      document.body.style.setProperty("--preview-dock-width", `${dockWidth}px`);
    } else {
      document.body.classList.remove("preview-is-docked");
      document.body.style.setProperty("--preview-dock-width", "0px");
    }

    // Single toggle button — always present, switches aria-label on state change
    const sidebarToggleBtn = document.querySelector(
      '[class*="collapseSidebarButton"]',
    );
    // Check if sidebar is currently collapsed by looking for the expand button label
    const isCollapsed = !!document.querySelector(
      '[aria-label="Expand sidebar"]',
    );

    if (active) {
      // Only collapse if NOT already collapsed, and track that we did it
      if (sidebarToggleBtn && !isCollapsed) {
        weCollapsedSidebar.current = true;
        sidebarToggleBtn.click();
      }
    } else {
      // Only expand if WE collapsed it AND it's actually still collapsed
      if (weCollapsedSidebar.current && isCollapsed && sidebarToggleBtn) {
        weCollapsedSidebar.current = false;
        sidebarToggleBtn.click();
      }
    }

    // Dynamic Navbar Tracking (for hideOnScroll functionality)
    const updateNavOffset = () => {
      const nav = document.querySelector(".navbar");
      if (nav) {
        // rect.bottom accurately reflects the bottom edge of the navbar,
        // even when hidden via CSS transforms (translateY(-100%)).
        const rect = nav.getBoundingClientRect();
        const offset = Math.max(0, rect.bottom);
        document.documentElement.style.setProperty(
          "--dock-top-offset",
          `${offset}px`,
        );
      }
    };

    if (active) {
      updateNavOffset();
      window.addEventListener("scroll", updateNavOffset, { passive: true });
      window.addEventListener("resize", updateNavOffset, { passive: true });
    }

    return () => {
      document.body.classList.remove("preview-is-docked");
      document.documentElement.style.removeProperty("--dock-top-offset");
      window.removeEventListener("scroll", updateNavOffset);
      window.removeEventListener("resize", updateNavOffset);
    };
  }, [isOpen, isDocked, dockWidth]);

  // --- Popup: ESC to close + lock scroll ---
  useEffect(() => {
    if (!isOpen || isDocked) return;
    document.body.style.overflow = "hidden";
    const handler = (e) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, isDocked, closePreview]);

  // --- Resize logic ---
  const startResize = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const w = window.innerWidth - e.clientX;
      if (w >= 280 && w <= window.innerWidth * 0.75) setDockWidth(w);
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.classList.add("preview-resizing");
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove("preview-resizing");
      document.body.style.userSelect = "";
    };
  }, [isResizing, setDockWidth]);

  // --- Force download (cross-origin safe) ---
  const handleDownload = async () => {
    try {
      const resp = await fetch(fileUrl);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: blobUrl,
        download: currentFile.label || currentFile.path.split("/").pop(),
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(fileUrl, "_blank");
    }
  };

  // --- Guard ---
  if (!mounted || !isOpen || !currentFile) return null;

  // --- Content renderer ---
  const renderContent = () => {
    if (loading)
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      );

    const { path } = currentFile;
    if (errors[path]) {
      return (
        <div className={styles.errorState}>
          <p>
            Could not load: <code>{path}</code>
          </p>
          <p className={styles.errorMsg}>{errors[path]}</p>
        </div>
      );
    }

    if (fileType === "image") {
      return (
        <div className={styles.imageView}>
          <img
            src={fileUrl}
            alt={currentFile.label || ""}
            className={styles.image}
          />
        </div>
      );
    }

    if (fileType === "pdf") {
      if (!pdfReady || !PdfDocument) {
        return (
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        );
      }
      return (
        <div className={styles.pdfView}>
          <PdfDocument
            file={fileUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            onLoadError={(err) =>
              setErrors((p) => ({
                ...p,
                [path]: err.message || "Invalid or missing PDF file.",
              }))
            }
            loading={
              <div className={styles.loading}>
                <div className={styles.spinner} />
              </div>
            }
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <PdfPage
                key={i}
                pageNumber={i + 1}
                width={isDocked ? dockWidth - 48 : 760}
                className={styles.pdfPage}
                renderTextLayer
                renderAnnotationLayer
              />
            ))}
          </PdfDocument>
        </div>
      );
    }

    if (fileType === "web") {
      return (
        <div className={styles.webView}>
          {hintVisible && (
            <div className={styles.webHint}>
              Some pages block embedding. Use <strong>Visit</strong> to open
              externally.
            </div>
          )}
          <iframe
            src={fileUrl}
            title={currentFile.label}
            className={styles.webFrame}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      );
    }

    // text / code — uses self-contained Prism, no Docusaurus providers needed
    const content = fileCache[path];
    if (!content)
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      );
    return <CodeView code={content} language={ext} />;
  };

  // --- Header ---
  const displayTitle =
    fileType === "web"
      ? currentFile.path.replace(/^https?:\/\//, "").split("/")[0]
      : currentFile.label || currentFile.path.split("/").pop();

  const header = (
    <div className={styles.modalHeader}>
      <div className={styles.headerLeft}>
        <h4 className={styles.modalTitle}>
          <span className={styles.primaryText}>Preview: </span>
          <span className={styles.baseText}>{displayTitle}</span>
        </h4>
      </div>
      <div className={styles.headerControls}>
        {fileType === "web" ? (
          <Tooltip msg="Open externally" position="bottom" underline={false}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.headerAction}
            >
              <IconLink className={styles.headerIcon} />
              <span className={styles.btnText}>Visit</span>
            </a>
          </Tooltip>
        ) : (
          <Tooltip msg="Download file" position="bottom" underline={false}>
            <button
              onClick={handleDownload}
              className={`${styles.headerAction} ${styles.downloadButton}`}
            >
              <IconSave className={styles.headerIconSmall} />
              <span className={styles.btnText}>Save</span>
            </button>
          </Tooltip>
        )}
        <Tooltip
          msg={isDocked ? "Switch to popup" : "Dock to side"}
          position="bottom"
          underline={false}
        >
          <button
            onClick={() => setDocked(!isDocked)}
            className={`${styles.headerAction} ${styles.dockToggle}`}
          >
            {isDocked ? (
              <IconPopup className={styles.headerIcon} />
            ) : (
              <IconDock className={styles.headerIcon} />
            )}
            <span className={styles.btnText}>
              {isDocked ? "Popup" : "Dock"}
            </span>
          </button>
        </Tooltip>
        <Tooltip msg="Close" position="bottom" underline={false}>
          <button
            onClick={closePreview}
            className={`${styles.headerAction} ${styles.headerActionClose}`}
          >
            <IconClose className={styles.headerIconSmall} />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  // --- Tab bar ---
  const tabs = sources.length > 1 && (
    <div className={styles.tabs}>
      {sources.map((src, i) => (
        <button
          key={i}
          className={`${styles.tab} ${i === activeIndex ? styles.activeTab : ""}`}
          onClick={() => setActiveIndex(i)}
        >
          {src.label || src.path.split("/").pop()}
        </button>
      ))}
    </div>
  );

  const body = <div className={styles.modalBody}>{renderContent()}</div>;

  // --- Dock mode ---
  if (isDocked) {
    return createPortal(
      <div className={styles.dockedContainer} style={{ width: dockWidth }}>
        <div
          className={styles.resizer}
          onMouseDown={startResize}
          title="Drag to resize"
        />
        {header}
        <div className={styles.dockedContent}>
          {tabs}
          {body}
        </div>
      </div>,
      document.body,
    );
  }

  // --- Popup mode ---
  return createPortal(
    <div className={styles.modalOverlay} onClick={closePreview}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {header}
        {tabs}
        {body}
      </div>
    </div>,
    document.body,
  );
}
