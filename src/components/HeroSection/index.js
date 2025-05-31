import React from 'react';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import SocialLinks from "@site/src/components/SocialLinks";
import styles from './styles.module.css';

export default function HeroSection({ id, className }) {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;
  const profilePic = customFields.profilePic;

  return (
    <div
        className={`${styles.hero} ${className || ''}`}
        id={id} 
        role="region" 
        aria-label="Hero section"
    >
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <p className={styles.intro}>Hello there, I'm</p>
          <h1 className={styles.title}>
            Soumadip Das
            <span className={styles.titleComma}>,</span>
          </h1>
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitlePrefix}>I am a</span>
            <h2 className={styles.subtitle}>FOSS Developer</h2>
            <span className={styles.subtitlePrefix}>.</span>
          </div>
          <p className={styles.description}>
            I tend to make solutions of real-life problems, that helps to make life less painful.
          </p>
          <div className={styles.actionRow}>
            <div className={styles.cta}>
              <a 
                href="#about"
                className={styles.ctaButton}
                aria-label="Learn more about me"
              >
                Learn More
              </a>
            </div>
            <SocialLinks />
          </div>
        </div>
        <div className={styles.rightSection}>
          <img
            src={`${profilePic}`}
            alt="profile"
            className={styles.profilePic}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
