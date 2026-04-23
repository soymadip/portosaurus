import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import UpdateTitle from "../utils/updateTitle.js";

// Import components
import HeroSection from "../components/HeroSection/index.js";
import AboutSection from "../components/AboutSection/index.js";
import ProjectsSection from "../components/ProjectsSection/index.js";
import ContactSection from "../components/ContactSection/index.js";
import ExperienceSection from "../components/ExperienceSection/index.js";
import NavArrow from "../components/NavArrow/index.js";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;

  const aboutMe = customFields.aboutMe || {};
  const projects = customFields.projects || {};
  const socialLinks = customFields.socialLinks || {};
  const experience = customFields.experience || {};

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

  return (
    <Layout title="Me" description="My portfolio website">
      {/* Custom styles */}
      <style>{customStyles}</style>

      <UpdateTitle sections={sectionTitles} defaultTitle={siteConfig.title} />

      <main>
        {/* Hero Section */}
        <HeroSection id="me" />

        {/* About Section */}
        <AboutSection id="about" />

        {/* Projects Section */}
        <ProjectsSection id="projects" />

        {/* Experience Section */}
        <ExperienceSection id="experience" />

        {/* Contact Section */}
        <ContactSection id="contact" />

        {/* Smart Navigation Arrow */}
        <NavArrow />
      </main>
    </Layout>
  );
}
