import { useEffect, useRef } from "react";

/**
 * Manages DOM side-effects for dock mode:
 * - Adds/removes body classes for layout push
 * - Manages CSS custom properties for dock width
 * - Collapses/expands the Docusaurus sidebar
 * - Tracks navbar height for dock top offset
 */
export function useDockLayout({
  isOpen,
  isPopupMode,
  isSidebarDock,
  isPeekDock,
  dockWidth,
  peekHeight,
}) {
  const weCollapsedSidebar = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // --- Popup scroll lock ---
    if (isOpen && isPopupMode) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // --- Body classes & CSS vars ---
    if (isSidebarDock) {
      document.body.classList.add("pv-dock-active");
      document.body.style.setProperty("--pv-dock-width", `${dockWidth}px`);
    } else {
      document.body.classList.remove("pv-dock-active");
      document.body.style.setProperty("--pv-dock-width", "0px");
    }

    if (isPeekDock) {
      document.body.classList.add("pv-peek-active");
      document.body.style.setProperty(
        "--mobile-peek-height",
        `${peekHeight}px`,
      );
    } else {
      document.body.classList.remove("pv-peek-active");
      document.body.style.setProperty("--mobile-peek-height", "0px");
    }

    // --- Docusaurus sidebar auto-collapse ---
    const sidebarToggleBtn = document.querySelector(
      '[class*="collapseSidebarButton"]',
    );
    const isCollapsed = !!document.querySelector(
      '[aria-label="Expand sidebar"]',
    );

    if (isSidebarDock) {
      if (sidebarToggleBtn && !isCollapsed) {
        weCollapsedSidebar.current = true;
        sidebarToggleBtn.click();
      }
    } else {
      if (weCollapsedSidebar.current && isCollapsed && sidebarToggleBtn) {
        weCollapsedSidebar.current = false;
        sidebarToggleBtn.click();
      }
    }

    // --- Navbar height tracking ---
    const updateNavOffset = () => {
      const nav = document.querySelector(".navbar");
      if (nav) {
        document.documentElement.style.setProperty(
          "--ifm-navbar-height",
          `${nav.offsetHeight}px`,
        );
      }
    };

    if (isSidebarDock) {
      updateNavOffset();
      window.addEventListener("resize", updateNavOffset, { passive: true });
    }

    return () => {
      document.body.classList.remove("pv-dock-active");
      document.body.classList.remove("pv-peek-active");
      document.body.style.overflow = "";
      document.body.style.removeProperty("--pv-dock-width");
      document.body.style.removeProperty("--mobile-peek-height");

      // Explicitly restore sidebar if we were the ones who collapsed it
      // This prevents Docusaurus from "remembering" the collapsed state after reload
      if (weCollapsedSidebar.current) {
        const sidebarToggleBtn = document.querySelector(
          '[class*="collapseSidebarButton"]',
        );
        const isCollapsed = !!document.querySelector(
          '[aria-label="Expand sidebar"]',
        );
        if (sidebarToggleBtn && isCollapsed) {
          sidebarToggleBtn.click();
        }
        weCollapsedSidebar.current = false;
      }
      window.removeEventListener("resize", updateNavOffset);
    };
  }, [isOpen, isPopupMode, isSidebarDock, isPeekDock, dockWidth, peekHeight]);
}
