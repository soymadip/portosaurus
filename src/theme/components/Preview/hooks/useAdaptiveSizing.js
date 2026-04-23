import { useEffect, useRef } from "react";

/**
 * Hook for managing responsive sizing, positioning, and adaptive anchoring.
 * Handles the 3-tier layout logic (Phone, Tablet, Desktop) and window management.
 */
export function useAdaptiveSizing({
  mode,
  windowWidth,
  floatingState,
  dockWidth,
  peekHeight,
  setFloatingState,
}) {
  // --- Layout calculations (3-Tier Adaptive) ---
  const isPhone = windowWidth <= 480;
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 480 && windowWidth <= 996;
  const isDesktop = windowWidth > 996;

  const isPopupMode = mode === "popup";
  const isDockMode = mode === "dock" && isDesktop;
  const showAsPeek = mode === "dock" && !isDesktop;
  const isPipMode = mode === "pip";

  // --- Adaptive Positioning (stick to right on resize) ---
  const prevWidthRef = useRef(windowWidth);
  useEffect(() => {
    if (floatingState.x !== null && !isDockMode && !isMobile) {
      const wasOnRight = floatingState.x > prevWidthRef.current / 2;
      if (wasOnRight) {
        const delta = windowWidth - prevWidthRef.current;
        setFloatingState((prev) => ({ ...prev, x: prev.x + delta }));
      }
    }
    prevWidthRef.current = windowWidth;
  }, [windowWidth, isDockMode, isMobile, floatingState.x, setFloatingState]);

  // --- Sizing math ---
  const vh =
    typeof window !== "undefined" ? document.documentElement.clientHeight : 800;

  // PiP sizing logic
  const pipWidth = isPhone
    ? windowWidth
    : isTablet
      ? Math.min(600, windowWidth - 60)
      : floatingState.width;

  const pipHeight = isPhone
    ? Math.min(floatingState.height, vh * 0.7)
    : isTablet
      ? Math.min(450, vh * 0.6)
      : floatingState.height;

  // Positioning logic
  const marginX = isPhone ? 0 : 20;
  const marginY = isPhone ? 0 : 20;

  const defaultPipX = isTablet
    ? (windowWidth - pipWidth) / 2
    : isPhone
      ? 0
      : Math.max(16, windowWidth - pipWidth - marginX);

  const defaultPipY = isPhone
    ? vh - pipHeight
    : Math.max(16, vh - pipHeight - marginY);

  let rndX = floatingState.x ?? defaultPipX;
  let rndY = floatingState.y ?? defaultPipY;

  // Safety clamping for floating windows (PiP)
  if (!isDockMode && !isPhone && floatingState.x !== null) {
    rndX = Math.min(rndX, windowWidth - pipWidth - 10);
    rndX = Math.max(10, rndX);
    rndY = Math.min(rndY, vh - pipHeight - 10);
    rndY = Math.max(10, rndY);
  }

  const rndPosition = isDockMode
    ? { x: windowWidth - dockWidth, y: 0 }
    : showAsPeek
      ? { x: 0, y: Math.max(0, vh - peekHeight) }
      : { x: rndX, y: rndY };

  const rndSize = isDockMode
    ? { width: dockWidth, height: vh }
    : showAsPeek
      ? { width: windowWidth, height: peekHeight }
      : { width: pipWidth, height: pipHeight };

  const rndBounds = isPhone
    ? { left: 0, top: 0, right: windowWidth, bottom: vh }
    : isDockMode
      ? { left: 0, top: 0, right: windowWidth, bottom: vh }
      : "parent";

  return {
    isPhone,
    isMobile,
    isTablet,
    isDesktop,
    isPopupMode,
    isDockMode,
    showAsPeek,
    isPipMode,
    rndPosition,
    rndSize,
    rndBounds,
    pipWidth,
    pipHeight,
    vh,
  };
}
