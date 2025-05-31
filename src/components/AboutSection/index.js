import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export default function AboutSection({ id, className, title }) {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;
  const aboutMe = customFields.aboutMe || {};

  return (
    <div id={id} className={`${styles.aboutSection} ${className || ''}`} role="region" aria-label="About me section">
      <div className={styles.aboutContainer}>
        <div className={styles.aboutHeader}>
          <h2 className={styles.aboutTitle}>{title || aboutMe.title || "About Me"}</h2>
          {aboutMe.subtitle && (
            <p className={styles.aboutSubtitle}>
              {aboutMe.subtitle}
            </p>
          )}
        </div>
        
        <div className={styles.aboutContent}>
          <div className={styles.aboutBio}>
            <div className={styles.bioImageContainer}>
              {aboutMe.image && (
                <div className={styles.imageWrapper}>
                  <img 
                    src={aboutMe.image} 
                    alt="About Me" 
                    className={styles.aboutImage}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            
            <div className={styles.bioTextContainer}>
              <div className={styles.bioText}>
                {Array.isArray(aboutMe.description) ? (
                  aboutMe.description.map((paragraph, index) => (
                    <p key={index} className={styles.aboutParagraph}>{paragraph}</p>
                  ))
                ) : (
                  <p className={styles.aboutParagraph}>
                    {aboutMe.description || "Information about me goes here."}
                  </p>
                )}
              </div>
              
              {aboutMe.skills && aboutMe.skills.length > 0 && (
                <div className={styles.skillsContainer}>
                  <h3 className={styles.skillsTitle} id="skills-heading">My Skills</h3>
                  <div className={styles.skillsGrid} role="list">
                    {aboutMe.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className={styles.skillBadge} 
                        role="listitem"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
