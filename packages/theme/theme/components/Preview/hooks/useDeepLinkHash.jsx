import { useEffect } from "react";
import { generatePvSlug, generatePvHash } from "../utils";
export function useDeepLinkHash(isOpen, sources, activeIndex, mode, baseSlug) {
  useEffect(() => {
    if (!isOpen) return;
    let slug = baseSlug;
    if (sources && sources.length > 1) {
      const src = sources[activeIndex];
      if (src) {
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
