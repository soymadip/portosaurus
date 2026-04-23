import { useEffect } from "react";
import { generatePvSlug, generatePvHash } from "../utils";

/**
 * Syncs the URL hash with the active preview tab.
 * Also scrolls the active tab element into view.
 */
export function useDeepLinkHash(isOpen, sources, activeIndex, mode, baseSlug) {
  useEffect(() => {
    if (!isOpen) return;

    let slug = baseSlug;
    if (sources && sources.length > 1) {
      const src = sources[activeIndex];
      if (src) {
        // For multi-tab previews, we append a slugified version of the tab's
        // specific label or filename so each tab has a unique deep link
        const rawLabel =
          src.label ||
          (src.path ? src.path.split(/[?#]/)[0].split("/").pop() : "tab");
        const tabSlug = generatePvSlug(rawLabel);
        slug = baseSlug ? `${baseSlug}-${tabSlug}` : tabSlug;
      }
    }

    if (slug) {
      const newHash = generatePvHash(slug, mode);
      if (window.location.hash !== `#${newHash}`) {
        window.history.replaceState(null, "", `#${newHash}`);
      }
    }
  }, [activeIndex, isOpen, sources, mode, baseSlug]);
}
