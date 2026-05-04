import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import UpdateTitle from "../utils/updateTitle.js";
import HeroSection from "../components/HeroSection/index.js";
import AboutSection from "../components/AboutSection/index.js";
import ProjectsSection from "../components/ProjectsSection/index.js";
import ContactSection from "../components/ContactSection/index.js";
import ExperienceSection from "../components/ExperienceSection/index.js";
import NavArrow from "../components/NavArrow/index.js";
export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  const sectionTitles = {
    me: `Home | ${siteConfig.title}`,
    about: `About Me | ${siteConfig.title}`,
    projects: `Projects | ${siteConfig.title}`,
    experience: `Experience | ${siteConfig.title}`,
    contact: `Contact | ${siteConfig.title}`,
  };
  const customStyles = `
  /* For future */
  `;
  return jsxDEV_7x81h0kn(
    Layout,
    {
      title: "Me",
      description: "My portfolio website",
      children: [
        jsxDEV_7x81h0kn(
          "style",
          { children: customStyles },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          UpdateTitle,
          { sections: sectionTitles, defaultTitle: siteConfig.title },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "main",
          {
            children: [
              jsxDEV_7x81h0kn(
                HeroSection,
                { id: "me" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                AboutSection,
                { id: "about" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                ProjectsSection,
                { id: "projects" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                ExperienceSection,
                { id: "experience" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                ContactSection,
                { id: "contact" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(NavArrow, {}, undefined, false, undefined, this),
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
  );
}
