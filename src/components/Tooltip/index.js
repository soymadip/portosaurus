import React, { useState } from 'react';
import styles from './styles.module.css';

export default function Tooltip({ children, content, position = 'top', color }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const tooltipStyle = color ? { '--tooltip-color': color } : {};
  
  return (
    <div 
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`${styles.tooltip} ${styles[position]}`}
          style={tooltipStyle}
          role="tooltip"
        >
          {content}
          <div className={styles.arrow} />
        </div>
      )}
    </div>
  );
}
