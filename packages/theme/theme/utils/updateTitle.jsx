import { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
export default function UpdateTitle({
  sections = {},
  defaultTitle = null,
  enabled = true,
}) {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const [currentTitle, setCurrentTitle] = useState(null);
  const effectiveDefaultTitle = defaultTitle || siteConfig.title;
  useEffect(() => {
    if (!enabled) return;
    const sectionTitles = Object.keys(sections).length > 0 ? sections : {};
    const updateTitle = () => {
      const sectionsToTrack = Object.keys(sectionTitles)
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      if (sectionsToTrack.length === 0) {
        setCurrentTitle(effectiveDefaultTitle);
        return;
      }
      const viewportHeight = window.innerHeight;
      let maxVisibleSection = null;
      let maxVisibleArea = 0;
      sectionsToTrack.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleSection = section.id;
        }
      });
      if (maxVisibleSection && sectionTitles[maxVisibleSection]) {
        setCurrentTitle(sectionTitles[maxVisibleSection]);
      } else {
        setCurrentTitle(effectiveDefaultTitle);
      }
    };
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          updateTitle();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    updateTitle();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, sections, effectiveDefaultTitle, enabled]);
  useEffect(() => {
    if (currentTitle) {
      document.title = currentTitle;
    }
  }, [currentTitle]);
  return null;
}
