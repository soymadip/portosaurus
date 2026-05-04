import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import SocialLinks from "../SocialLinks/index.js";
import styles from "./styles.module.css";
export default function HeroSection({ id, className }) {
  const { siteConfig } = useDocusaurusContext();
  const brokenLinks = useBrokenLinks();
  if (id) {
    brokenLinks.collectAnchor(id);
  }
  const { customFields } = siteConfig;
  const intro = customFields.heroSection.intro;
  const title = customFields.heroSection.title;
  const subtitle = customFields.heroSection.subtitle;
  const profession = customFields.heroSection.profession;
  const desc = customFields.heroSection.desc;
  const profilePic = customFields.heroSection.profilePic;
  const learnMoreButtonText = customFields.heroSection.learnMoreButtonTxt;
  return jsxDEV_7x81h0kn(
    "div",
    {
      id,
      className: `${styles.hero} ${className || ""}`,
      role: "region",
      "aria-label": "Hero section",
      children: jsxDEV_7x81h0kn(
        "div",
        {
          className: styles.container,
          children: [
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.leftSection,
                children: [
                  jsxDEV_7x81h0kn(
                    "p",
                    { className: styles.intro, children: intro },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                  jsxDEV_7x81h0kn(
                    "h1",
                    {
                      className: styles.title,
                      children: [
                        title,
                        jsxDEV_7x81h0kn(
                          "span",
                          { className: styles.titleComma, children: "," },
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
                      className: styles.subtitleWrapper,
                      children: [
                        jsxDEV_7x81h0kn(
                          "span",
                          { className: styles.subtitle, children: subtitle },
                          undefined,
                          false,
                          undefined,
                          this,
                        ),
                        jsxDEV_7x81h0kn(
                          "h2",
                          {
                            className: styles.profession,
                            children: profession,
                          },
                          undefined,
                          false,
                          undefined,
                          this,
                        ),
                        jsxDEV_7x81h0kn(
                          "span",
                          { className: styles.subtitle, children: "." },
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
                    "p",
                    { className: styles.description, children: desc },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                  jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: styles.actionRow,
                      children: [
                        jsxDEV_7x81h0kn(
                          "div",
                          {
                            className: styles.cta,
                            children: jsxDEV_7x81h0kn(
                              "a",
                              {
                                href: "#about",
                                className: styles.ctaButton,
                                "aria-label": "Learn more about me",
                                children: learnMoreButtonText,
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
                          SocialLinks,
                          { links: customFields.heroSection.social },
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
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.rightSection,
                children: jsxDEV_7x81h0kn(
                  "img",
                  {
                    src: `${profilePic}`,
                    alt: "profile",
                    className: styles.profilePic,
                    loading: "lazy",
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
    },
    undefined,
    false,
    undefined,
    this,
  );
}
