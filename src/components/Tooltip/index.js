import React, { useState } from "react";
import styles from "./styles.module.css";

export default function Tooltip({
  children,
  msg,
  position = "top",
  color,
  underline = true,
}) {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipStyle = color ? { "--tooltip-color": color } : {};

  return (
    <span
      className={`${styles.tooltipContainer} ${underline ? styles.hasUnderline : ""}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span
          className={`${styles.tooltip} ${styles[position]}`}
          style={tooltipStyle}
          role="tooltip"
        >
          {msg}
          <span className={styles.arrow} />
        </span>
      )}
    </span>
  );
}
