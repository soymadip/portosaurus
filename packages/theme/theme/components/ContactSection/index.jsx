import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { iconMap } from "../../config/iconMappings";
import { FaQuestionCircle } from "react-icons/fa";
import useScrollReveal from "../../hooks/useScrollReveal";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import styles from "./styles.module.css";
const sortEmail = (links) => {
  return [...links].sort((a, b) => {
    const isEmailA =
      a.url?.startsWith("mailto:") ||
      a.icon?.toLowerCase().includes("email") ||
      a.name?.toLowerCase().includes("email");
    const isEmailB =
      b.url?.startsWith("mailto:") ||
      b.icon?.toLowerCase().includes("email") ||
      b.name?.toLowerCase().includes("email");
    if (isEmailA && !isEmailB) return -1;
    if (!isEmailA && isEmailB) return 1;
    return 0;
  });
};
export default function ContactSection({ id, className }) {
  const { siteConfig } = useDocusaurusContext();
  const brokenLinks = useBrokenLinks();
  if (id) {
    brokenLinks.collectAnchor(id);
  }
  const { customFields } = siteConfig;
  const socialLinksConfig = customFields.socialLinks || {};
  if (socialLinksConfig.enable === false) return null;
  let socialLinks = socialLinksConfig.links || [];
  const displayHeading = socialLinksConfig.heading;
  const displaySubheading = socialLinksConfig.subheading;
  const [sectionRef, isVisible] = useScrollReveal();
  socialLinks = sortEmail(socialLinks);
  return jsxDEV_7x81h0kn(
    "div",
    {
      id,
      ref: sectionRef,
      className: `${styles.contactSection} ${isVisible ? "is-visible" : ""} ${className || ""}`,
      role: "region",
      "aria-label": "Contact section",
      children: jsxDEV_7x81h0kn(
        "div",
        {
          className: styles.contactContainer,
          children: [
            jsxDEV_7x81h0kn(
              "div",
              {
                className: styles.contactHeader,
                children: [
                  jsxDEV_7x81h0kn(
                    "h2",
                    {
                      className: styles.contactTitle,
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
                      className: styles.contactSubtitle,
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
                className: styles.gridWrapper,
                children: jsxDEV_7x81h0kn(
                  "div",
                  {
                    className: styles.socialGrid,
                    role: "list",
                    "aria-label": "Social media and contact links",
                    children: socialLinks.map((social, index) => {
                      const iconKey = (
                        social.icon ||
                        social.name ||
                        ""
                      ).toLowerCase();
                      const iconData = iconMap[iconKey] || {};
                      const name = social.name;
                      const Icon = iconData.icon || FaQuestionCircle;
                      const iconColor =
                        iconData.color || "var(--ifm-color-primary)";
                      const desc = social.desc || `Connect with me on ${name}`;
                      const url = social.url;
                      return jsxDEV_7x81h0kn(
                        "a",
                        {
                          href: url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: styles.socialCard,
                          style: {
                            "--card-index": index,
                            "--icon-hover-color": iconColor,
                          },
                          "aria-label": `Connect with me on ${name}: ${desc}`,
                          role: "listitem",
                          children: [
                            Icon &&
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: styles.socialIcon,
                                  children: jsxDEV_7x81h0kn(
                                    Icon,
                                    { "aria-hidden": "true" },
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
                              "h3",
                              { className: styles.socialTitle, children: name },
                              undefined,
                              false,
                              undefined,
                              this,
                            ),
                            jsxDEV_7x81h0kn(
                              "p",
                              { className: styles.socialDesc, children: desc },
                              undefined,
                              false,
                              undefined,
                              this,
                            ),
                          ],
                        },
                        name,
                        true,
                        undefined,
                        this,
                      );
                    }),
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
