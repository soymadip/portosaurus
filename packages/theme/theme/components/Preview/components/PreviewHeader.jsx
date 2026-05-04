import React, { useState, useRef } from "react";
import Tooltip from "../../Tooltip/index.js";
import styles from "../styles.module.css";
import { PreviewMode } from "../state/index.js";
import IconDock from "../../../assets/img/svg/icon-dock.svg";
import IconPopup from "../../../assets/img/svg/icon-popup.svg";
import IconSave from "../../../assets/img/svg/icon-save.svg";
import IconLink from "../../../assets/img/svg/icon-link.svg";
import IconClose from "../../../assets/img/svg/icon-close.svg";
export default function PreviewHeader({
  displayTitle,
  fileType,
  fileUrl,
  mode,
  zoomLevel,
  onZoomChange,
  onToggleMode,
  onClose,
  onDownload,
  isDownloading,
  modeSwitch = true,
  showDockLabel = true,
}) {
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const zoomMenuRef = useRef(null);
  const zoomMenuTimer = useRef(null);
  const isMobileSize =
    typeof window !== "undefined" && window.innerWidth <= 768;
  const toggleLabel =
    mode === "popup" ? "Dock" : mode === "dock" ? "PiP" : "Dock";
  const toggleTooltip =
    mode === "popup"
      ? "Dock to side"
      : mode === "dock"
        ? "Open as PiP"
        : "Dock to side";
  return jsxDEV_7x81h0kn(
    Fragment_8vg9x3sq,
    {
      children: [
        mode === "dock" &&
          !isMobileSize &&
          jsxDEV_7x81h0kn(
            "div",
            {
              className: styles.revealHeader,
              children: jsxDEV_7x81h0kn(
                "h1",
                {
                  className: styles.popupTitle,
                  children: jsxDEV_7x81h0kn(
                    "span",
                    { className: styles.primaryText, children: "Preview " },
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
            },
            undefined,
            false,
            undefined,
            this,
          ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: styles.popupHeader,
            children: [
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: styles.headerLeft,
                  children: jsxDEV_7x81h0kn(
                    "h4",
                    {
                      className: styles.popupTitle,
                      children: jsxDEV_7x81h0kn(
                        "span",
                        {
                          className: styles.baseTitleText,
                          children: displayTitle,
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
                  className: styles.headerControls,
                  children: [
                    !isMobileSize &&
                      fileType !== "web" &&
                      jsxDEV_7x81h0kn(
                        "div",
                        {
                          className: styles.zoomDropdown,
                          ref: zoomMenuRef,
                          onMouseEnter: () => {
                            if (zoomMenuTimer.current)
                              clearTimeout(zoomMenuTimer.current);
                            setShowZoomMenu(true);
                          },
                          onMouseLeave: () => {
                            zoomMenuTimer.current = setTimeout(
                              () => setShowZoomMenu(false),
                              150,
                            );
                          },
                          children: [
                            jsxDEV_7x81h0kn(
                              "button",
                              {
                                onClick: () => setShowZoomMenu(!showZoomMenu),
                                className: styles.zoomVal,
                                title: "Change Zoom",
                                children: [
                                  Math.round(zoomLevel * 100),
                                  "%",
                                  jsxDEV_7x81h0kn(
                                    "span",
                                    {
                                      className: styles.dropdownArrow,
                                      children: "▼",
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
                            showZoomMenu &&
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: styles.zoomMenu,
                                  children: [0.5, 0.75, 1, 1.25, 1.5, 2].map(
                                    (level) =>
                                      jsxDEV_7x81h0kn(
                                        "button",
                                        {
                                          className: `${styles.zoomMenuItem} ${zoomLevel === level ? styles.zoomMenuItemActive : ""}`,
                                          onClick: () => {
                                            onZoomChange(level);
                                            setShowZoomMenu(false);
                                          },
                                          children:
                                            level === 1
                                              ? "100% (Fit)"
                                              : `${Math.round(level * 100)}%`,
                                        },
                                        level,
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
                        undefined,
                        true,
                        undefined,
                        this,
                      ),
                    fileType === "web"
                      ? jsxDEV_7x81h0kn(
                          Tooltip,
                          {
                            msg: "Open externally",
                            position: "bottom",
                            underline: false,
                            children: jsxDEV_7x81h0kn(
                              "a",
                              {
                                href: fileUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: styles.headerAction,
                                children: [
                                  jsxDEV_7x81h0kn(
                                    IconLink,
                                    { className: styles.headerIcon },
                                    undefined,
                                    false,
                                    undefined,
                                    this,
                                  ),
                                  jsxDEV_7x81h0kn(
                                    "span",
                                    {
                                      className: styles.btnText,
                                      children: "Visit",
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
                        )
                      : jsxDEV_7x81h0kn(
                          Tooltip,
                          {
                            msg: isDownloading
                              ? "Downloading..."
                              : "Download file",
                            position: "bottom",
                            underline: false,
                            children: jsxDEV_7x81h0kn(
                              "button",
                              {
                                onClick: onDownload,
                                disabled: isDownloading,
                                className: `${styles.headerAction} ${styles.downloadButton} ${isDownloading ? styles.headerActionDisabled : ""}`,
                                children: [
                                  isDownloading
                                    ? jsxDEV_7x81h0kn(
                                        "div",
                                        { className: styles.spinnerSmall },
                                        undefined,
                                        false,
                                        undefined,
                                        this,
                                      )
                                    : jsxDEV_7x81h0kn(
                                        IconSave,
                                        { className: styles.headerIconSmall },
                                        undefined,
                                        false,
                                        undefined,
                                        this,
                                      ),
                                  jsxDEV_7x81h0kn(
                                    "span",
                                    {
                                      className: styles.btnText,
                                      children: isDownloading
                                        ? "Saving"
                                        : "Save",
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
                    modeSwitch &&
                      jsxDEV_7x81h0kn(
                        Tooltip,
                        {
                          msg: toggleTooltip,
                          position: "bottom",
                          underline: false,
                          children: jsxDEV_7x81h0kn(
                            "button",
                            {
                              onClick: onToggleMode,
                              className: `${styles.headerAction} ${styles.dockToggle}`,
                              children: [
                                mode === "popup" || mode === "pip"
                                  ? jsxDEV_7x81h0kn(
                                      IconDock,
                                      { className: styles.headerIcon },
                                      undefined,
                                      false,
                                      undefined,
                                      this,
                                    )
                                  : jsxDEV_7x81h0kn(
                                      IconPopup,
                                      {
                                        className: `${styles.headerIcon} ${styles.iconPopupTweak}`,
                                      },
                                      undefined,
                                      false,
                                      undefined,
                                      this,
                                    ),
                                showDockLabel &&
                                  jsxDEV_7x81h0kn(
                                    "span",
                                    {
                                      className: styles.btnText,
                                      children: toggleLabel,
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
                    jsxDEV_7x81h0kn(
                      Tooltip,
                      {
                        msg: "Close",
                        position: "bottom",
                        underline: false,
                        children: jsxDEV_7x81h0kn(
                          "button",
                          {
                            onClick: onClose,
                            className: `${styles.headerAction} ${styles.headerActionClose}`,
                            children: jsxDEV_7x81h0kn(
                              IconClose,
                              { className: styles.headerIconSmall },
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
            ],
          },
          undefined,
          true,
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
}
