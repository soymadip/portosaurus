import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import styles from "./styles.module.css";
export default function ExperienceSection({ id, className }) {
  const { siteConfig } = useDocusaurusContext();
  const brokenLinks = useBrokenLinks();
  if (id) {
    brokenLinks.collectAnchor(id);
  }
  const experience = siteConfig.customFields?.experience || {};
  if (experience.enable === false) return null;
  const displayHeading = experience.heading;
  const displaySubheading = experience.subheading;
  return jsxDEV_7x81h0kn(
    "div",
    {
      id,
      className: `${styles.experienceSection} ${className || ""}`,
      role: "region",
      "aria-label": "Experience section",
      children: jsxDEV_7x81h0kn(
        "div",
        {
          className: styles.experienceContainer,
          children: [
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.experienceHeader,
                children: [
                  jsxDEV_7x81h0kn(
                    "h2",
                    {
                      className: styles.experienceTitle,
                      children: displayHeading,
                    },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                  jsxDEV_7x81h0kn(
                    "p",
                    {
                      className: styles.experienceSubtitle,
                      children: displaySubheading,
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
                className: styles.noticeWrapper,
                children: jsxDEV_7x81h0kn(
                  "div",
                  {
                    className: styles.noticeBox,
                    role: "status",
                    "aria-live": "polite",
                    children: [
                      jsxDEV_7x81h0kn(
                        "p",
                        {
                          className: styles.noticeText,
                          children: "Coming Soon!",
                        },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                      jsxDEV_7x81h0kn(
                        "p",
                        {
                          className: styles.noticeDesc,
                          children: "This section is under construction.",
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
