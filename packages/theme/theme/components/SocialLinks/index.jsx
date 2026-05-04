import { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./styles.module.css";
import { FaQuestionCircle } from "react-icons/fa";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import Tooltip from "../Tooltip";
import { iconMap } from "../../config/iconMappings";
const DEFAULT_ICON = FaQuestionCircle;
const DEFAULT_COLOR = "var(--ifm-color-primary)";
export default function SocialIcons({ showAll = false, links = null }) {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;
  const isBrowser = useIsBrowser();
  const [animationDelays, setAnimationDelays] = useState({});
  const allSocialLinks = customFields.socialLinks.links || [];
  const socialLinks = useMemo(() => {
    if (links) return links;
    return showAll ? allSocialLinks : allSocialLinks.filter((link) => link.pin);
  }, [allSocialLinks, showAll, links]);
  const calculateDelays = useCallback(() => {
    if (!isBrowser) return {};
    const isTablet = window.innerWidth <= 768;
    const isMobile = window.innerWidth <= 480;
    const delays = {};
    const baseDelay = isMobile ? 0.7 : isTablet ? 0.9 : 1.3;
    const incrementDelay = 0.1;
    socialLinks.forEach((_, index) => {
      delays[index] = `${baseDelay + index * incrementDelay}s`;
    });
    return delays;
  }, [isBrowser, socialLinks]);
  useEffect(() => {
    if (!isBrowser) return;
    setAnimationDelays(calculateDelays());
    const handleResize = () => {
      setAnimationDelays(calculateDelays());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isBrowser, calculateDelays]);
  const getIconDetails = (iconName) => {
    if (!iconName) {
      return { icon: DEFAULT_ICON, color: DEFAULT_COLOR };
    }
    const formattedIconName = iconName.toLowerCase();
    const iconDetails = iconMap[formattedIconName];
    if (!iconDetails) {
      return { icon: DEFAULT_ICON, color: DEFAULT_COLOR };
    }
    return {
      icon: iconDetails.icon,
      color: iconDetails.color || DEFAULT_COLOR,
    };
  };
  if (socialLinks.length === 0) {
    return null;
  }
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: styles.socialIcons,
      children: socialLinks.map((social, index) => {
        const { icon: IconComponent, color: iconColor } = getIconDetails(
          social.icon || social.name,
        );
        const href = social.url || "#";
        const displayColor = social.color || iconColor;
        return jsxDEV_7x81h0kn(
          Tooltip,
          {
            msg: social.desc || social.name || social.icon || "Link",
            position: "top",
            bg: displayColor,
            underline: false,
            gap: 17,
            children: jsxDEV_7x81h0kn(
              "a",
              {
                href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: styles.socialLink,
                style: {
                  "--hover-color": displayColor,
                  animationDelay: animationDelays[index] || "0s",
                },
                "aria-label": social.name || social.icon || "social link",
                children: jsxDEV_7x81h0kn(
                  IconComponent,
                  { size: 24 },
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
          },
          index,
          false,
          undefined,
          this,
        );
      }),
    },
    undefined,
    false,
    undefined,
    this,
  );
}
