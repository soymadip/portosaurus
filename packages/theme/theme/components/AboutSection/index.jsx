import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useScrollReveal from "../../hooks/useScrollReveal";
import { FaDownload } from "react-icons/fa";
import { Pv } from "../Preview/index.js";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import styles from "./styles.module.css";
export default function AboutSection({ id, className }) {
  const { siteConfig } = useDocusaurusContext();
  const brokenLinks = useBrokenLinks();
  if (id) {
    brokenLinks.collectAnchor(id);
  }
  const { customFields } = siteConfig;
  const aboutMe = customFields.aboutMe || {};
  if (aboutMe.enable === false) return null;
  const [sectionRef, isVisible] = useScrollReveal();
  return jsxDEV_7x81h0kn(
    "div",
    {
      id,
      ref: sectionRef,
      className: `${styles.aboutSection} ${isVisible ? "is-visible" : ""} ${className || ""}`,
      role: "region",
      "aria-label": "About me section",
      children: jsxDEV_7x81h0kn(
        "div",
        {
          className: styles.aboutContainer,
          children: [
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.aboutHeader,
                children: jsxDEV_7x81h0kn(
                  "h2",
                  {
                    className: styles.aboutHeading,
                    children: aboutMe.heading || "About Me",
                  },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
              },
              undefined,
              false,
              undefined,
              this,
            ),
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.aboutContent,
                children: jsxDEV_7x81h0kn(
                  "div",
                  {
                    className: styles.aboutCard,
                    children: [
                      jsxDEV_7x81h0kn(
                        "div",
                        {
                          className: styles.bioImageContainer,
                          children: [
                            aboutMe.image &&
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: styles.imageWrapper,
                                  children: jsxDEV_7x81h0kn(
                                    "img",
                                    {
                                      src: aboutMe.image,
                                      alt: aboutMe.name || "About Me",
                                      className: styles.aboutImage,
                                    },
                                    undefined,
                                    false,
                                    undefined,
                                    this,
                                  ),
                                },
                                undefined,
                                false,
                                undefined,
                                this,
                              ),
                            aboutMe.resume &&
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: styles.resumeContainer,
                                  children: jsxDEV_7x81h0kn(
                                    Pv,
                                    {
                                      href: aboutMe.resume,
                                      title: "My Resume",
                                      children: jsxDEV_7x81h0kn(
                                        "span",
                                        {
                                          className: styles.resumeButton,
                                          children: [
                                            jsxDEV_7x81h0kn(
                                              FaDownload,
                                              {},
                                              undefined,
                                              false,
                                              undefined,
                                              this,
                                            ),
                                            " View Resume",
                                          ],
                                        },
                                        undefined,
                                        true,
                                        undefined,
                                        this,
                                      ),
                                    },
                                    undefined,
                                    false,
                                    undefined,
                                    this,
                                  ),
                                },
                                undefined,
                                false,
                                undefined,
                                this,
                              ),
                          ],
                        },
                        undefined,
                        true,
                        undefined,
                        this,
                      ),
                      jsxDEV_7x81h0kn(
                        "div",
                        {
                          className: styles.bioTextContainer,
                          children: [
                            jsxDEV_7x81h0kn(
                              "div",
                              {
                                className: styles.bioText,
                                children: Array.isArray(aboutMe.bio)
                                  ? aboutMe.bio.map((paragraph, index) =>
                                      jsxDEV_7x81h0kn(
                                        "p",
                                        {
                                          className: styles.aboutParagraph,
                                          children: paragraph,
                                        },
                                        index,
                                        false,
                                        undefined,
                                        this,
                                      ),
                                    )
                                  : jsxDEV_7x81h0kn(
                                      "p",
                                      {
                                        className: styles.aboutParagraph,
                                        children: aboutMe.bio,
                                      },
                                      undefined,
                                      false,
                                      undefined,
                                      this,
                                    ),
                              },
                              undefined,
                              false,
                              undefined,
                              this,
                            ),
                            aboutMe.skills &&
                              aboutMe.skills.length > 0 &&
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: styles.skillsContainer,
                                  children: [
                                    jsxDEV_7x81h0kn(
                                      "h3",
                                      {
                                        className: styles.skillsTitle,
                                        children:
                                          aboutMe.skillsHeading || "My Skills",
                                      },
                                      undefined,
                                      false,
                                      undefined,
                                      this,
                                    ),
                                    jsxDEV_7x81h0kn(
                                      "div",
                                      {
                                        className: styles.skillsGrid,
                                        children: aboutMe.skills.map(
                                          (skill, index) =>
                                            jsxDEV_7x81h0kn(
                                              "span",
                                              {
                                                className: styles.skillTag,
                                                style: {
                                                  animationDelay: `${index * 0.05}s`,
                                                },
                                                children: skill,
                                              },
                                              index,
                                              false,
                                              undefined,
                                              this,
                                            ),
                                        ),
                                      },
                                      undefined,
                                      false,
                                      undefined,
                                      this,
                                    ),
                                  ],
                                },
                                undefined,
                                true,
                                undefined,
                                this,
                              ),
                          ],
                        },
                        undefined,
                        true,
                        undefined,
                        this,
                      ),
                    ],
                  },
                  undefined,
                  true,
                  undefined,
                  this,
                ),
              },
              undefined,
              false,
              undefined,
              this,
            ),
          ],
        },
        undefined,
        true,
        undefined,
        this,
      ),
    },
    undefined,
    false,
    undefined,
    this,
  );
}
