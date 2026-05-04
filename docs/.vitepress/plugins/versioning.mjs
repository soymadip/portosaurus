import fs from "fs";
import { resolve } from "path";

/**
 * Safely loads the active versions from versions.json
 */
export function getVersions(docsRoot) {
  const versionsFile = resolve(docsRoot, "versions.json");
  return fs.existsSync(versionsFile)
    ? JSON.parse(fs.readFileSync(versionsFile, "utf-8"))
    : [];
}

/**
 * Generates the version switcher for the navigation bar
 */
export function generateVersionedNav(versions) {
  if (versions.length === 0) return null;

  return {
    text: "Versions",
    items: [
      { 
        text: "Latest", 
        link: "/user/getting-started",
        // Only active if URL doesn't start with a version like /v1.0/
        activeMatch: "^/(?!v\\d+\\.\\d+/).+" 
      },
      ...versions.map((v) => ({ 
        text: v, 
        link: `/${v}/user/getting-started`,
        activeMatch: `^/${v}/`
      })),
    ],
  };
}

/**
 * Generates the multi-sidebar object, cloning and prefixing the base sidebar for each version
 */
export function generateSidebar(versions, baseSidebar) {
  const sidebarConfig = {
    "/": cloneSidebar(baseSidebar, "latest"),
  };
  
  versions.forEach((v) => {
    sidebarConfig[`/${v}/`] = cloneSidebar(baseSidebar, v);
  });
  
  return sidebarConfig;
}

function cloneSidebar(items, version) {
  const prefix = version === "latest" ? "" : `/${version}`;
  return items.map((item) => {
    const newItem = { ...item };
    if (newItem.link && newItem.link.startsWith("/")) {
      newItem.link = `${prefix}${newItem.link}`;
    }
    if (newItem.items) {
      newItem.items = cloneSidebar(newItem.items, version);
    }
    return newItem;
  });
}
