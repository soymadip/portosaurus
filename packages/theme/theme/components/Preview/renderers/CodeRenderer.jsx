import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Highlight } from "prism-react-renderer";
export default function CodeRenderer({ code, language, zoomLevel = 1 }) {
  const { siteConfig } = useDocusaurusContext();
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  const prismConfig = siteConfig?.themeConfig?.prism || {};
  const prismTheme = isDark ? prismConfig.darkTheme : prismConfig.theme;
  const normalizedLanguage = language === "patch" ? "diff" : language || "text";
  return jsxDEV_7x81h0kn(
    Highlight,
    {
      code,
      language: normalizedLanguage,
      theme: prismTheme,
      ...(typeof window !== "undefined" && window.Prism
        ? { prism: window.Prism }
        : {}),
      children: ({ className, style, tokens, getLineProps, getTokenProps }) =>
        jsxDEV_7x81h0kn(
          "pre",
          {
            className,
            style: {
              ...style,
              margin: 0,
              borderRadius: 0,
              padding: "14px 0",
              fontSize: `calc(0.85rem * ${zoomLevel})`,
              lineHeight: 1.6,
              minHeight: "100%",
              background: "var(--ifm-background-color)",
            },
            children: tokens.map((line, i) => {
              const lineProps = getLineProps({ line });
              const lineContent = line.map((t) => t.content).join("");
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
              return jsxDEV_7x81h0kn(
                "div",
                {
                  ...lineProps,
                  style: {
                    ...lineProps.style,
                    ...diffStyle,
                    display: "flex",
                    paddingLeft: diffStyle.borderLeft ? "0px" : "3px",
                  },
                  children: [
                    jsxDEV_7x81h0kn(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          width: "1.7em",
                          textAlign: "right",
                          marginRight: "12px",
                          userSelect: "none",
                          opacity: 0.35,
                          flexShrink: 0,
                          fontFamily: "var(--ifm-font-family-monospace)",
                        },
                        children: i + 1,
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    jsxDEV_7x81h0kn(
                      "span",
                      {
                        style: { paddingRight: "14px", flex: 1 },
                        children: line.map((token, key) =>
                          jsxDEV_7x81h0kn(
                            "span",
                            { ...getTokenProps({ token }) },
                            key,
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
                    ),
                  ],
                },
                i,
                true,
                undefined,
                this,
              );
            }),
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
