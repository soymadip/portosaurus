import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Tooltip from "../Tooltip";
import styles from "./styles.module.css";

export default function NavArrow() {
  const [direction, setDirection] = useState("down");
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const getSections = () => {
    // Dynamically find all main sections with IDs
    const main = document.querySelector("main");
    if (!main) return [];

    return Array.from(main.querySelectorAll(":scope > [id]"))
      .map((el) => el.id)
      .filter((id) => id !== "nav-arrow"); // Exclude itself if it had an ID
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Show after initial scroll
      setIsVisible(scrollTop > 100);

      // Point UP only if we are at the very bottom
      if (scrollTop + windowHeight >= fullHeight - 50) {
        setDirection("up");
      } else {
        setDirection("down");
      }

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    if (direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const sections = getSections();
      const windowTop =
        window.pageYOffset || document.documentElement.scrollTop;

      let nextSectionId = null;

      // Find the first section whose top is below the current scroll position + small offset
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const absoluteTop = rect.top + windowTop;

          if (absoluteTop > windowTop + 100) {
            nextSectionId = id;
            break;
          }
        }
      }

      if (nextSectionId) {
        const element = document.getElementById(nextSectionId);
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // If no more sections, just go to bottom
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <button
      className={`${styles.navArrow} ${isVisible ? styles.visible : ""} ${isScrolling ? styles.scrolling : ""}`}
      onClick={handleClick}
      aria-label={
        direction === "down" ? "Scroll to next section" : "Scroll to top"
      }
    >
      <Tooltip
        msg={direction === "down" ? "Next Section" : "Back to Top"}
        position="top"
        gap={25}
        underline={false}
      >
        <div className={`${styles.iconWrapper} ${styles[direction]}`}>
          {direction === "down" ? (
            <FaChevronDown className={styles.chevron} />
          ) : (
            <FaChevronUp className={styles.chevron} />
          )}
        </div>
      </Tooltip>
    </button>
  );
}
