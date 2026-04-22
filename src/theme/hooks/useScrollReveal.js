import { useState, useEffect, useRef } from "react";

/**
 * A reusable hook to detect when an element enters the viewport.
 * @param {Object} options IntersectionObserver options
 * @returns {Array} [ref, isVisible]
 */
export default function useScrollReveal(options = { threshold: 0.05 }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
}
