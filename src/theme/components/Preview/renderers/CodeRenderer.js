import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Highlight } from "prism-react-renderer";

/**
 * Self-contained code highlighter using prism-react-renderer.
 * Reads the Prism theme directly from Docusaurus site config.
 * Safe to use in Root.js because it doesn't depend on Docusaurus context providers.
 */
export default function CodeRenderer({ code, language, zoomLevel = 1.0 }) {
  const { siteConfig } = useDocusaurusContext();
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  const prismConfig = siteConfig?.themeConfig?.prism || {};
  const prismTheme = isDark ? prismConfig.darkTheme : prismConfig.theme;

  // Normalize language (Prism uses 'diff' for both .diff and .patch)
  const normalizedLanguage = language === "patch" ? "diff" : language || "text";

  return (
    <Highlight
      code={code}
      language={normalizedLanguage}
      theme={prismTheme}
      {...(typeof window !== "undefined" && window.Prism
        ? { prism: window.Prism }
        : {})}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            borderRadius: 0,
            padding: "14px 0",
            fontSize: `calc(0.85rem * ${zoomLevel})`,
            lineHeight: 1.6,
            minHeight: "100%",
            background: "var(--ifm-background-color)",
          }}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line });
            const lineContent = line.map((t) => t.content).join("");

            // --- Robust Diff Highlighting ---
            let diffStyle = {};
            if (normalizedLanguage === "diff") {
              if (lineContent.startsWith("+")) {
                diffStyle = {
                  background: "rgba(var(--ifm-color-success-rgb), 0.15)",
                  borderLeft: "3px solid var(--ifm-color-success)",
                };
              } else if (lineContent.startsWith("-")) {
                diffStyle = {
                  background: "rgba(var(--ifm-color-danger-rgb), 0.15)",
                  borderLeft: "3px solid var(--ifm-color-danger)",
                };
              }
            }

            return (
              <div
                key={i}
                {...lineProps}
                style={{
                  ...lineProps.style,
                  ...diffStyle,
                  display: "flex",
                  paddingLeft: diffStyle.borderLeft ? "0px" : "3px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "1.7em",
                    textAlign: "right",
                    marginRight: "12px",
                    userSelect: "none",
                    opacity: 0.35,
                    flexShrink: 0,
                    fontFamily: "var(--ifm-font-family-monospace)",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ paddingRight: "14px", flex: 1 }}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
