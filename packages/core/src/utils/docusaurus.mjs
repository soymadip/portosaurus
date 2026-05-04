import fs from "fs";
import path from "path";

/**
 * Resolves site URL based on config or environment
 */
export function resolveSiteUrl(configValue, env = process.env) {
  if (configValue === "auto") {
    if (env.CI_PAGES_URL) return new URL(env.CI_PAGES_URL).origin;
    if (env.GITHUB_ACTIONS === "true")
      return `https://${env.GITHUB_REPOSITORY_OWNER}.github.io`;
    return "http://localhost";
  }
  return configValue;
}

/**
 * Resolves base path based on config or environment
 */
export function resolveBasePath(configValue, env = process.env) {
  if (configValue === "auto") {
    if (env.CI_PAGES_URL) return new URL(env.CI_PAGES_URL).pathname;
    if (env.GITHUB_ACTIONS === "true") {
      const repo = env.GITHUB_REPOSITORY ?? "";
      const [, name] = repo.split("/");
      return `/${name}/`;
    }
    return "/";
  }
  return configValue;
}

/**
 * Creates a function to resolve static asset paths
 */
export function createStaticAssetResolver(_projectDir, staticDir, assetsDir) {
  return function (primaryPath, fallbackPath = "") {
    if (!primaryPath) return fallbackPath;
    if (/^https?:\/\//.test(primaryPath)) return primaryPath;
    if (fs.existsSync(path.resolve(staticDir, primaryPath))) return primaryPath;
    if (assetsDir && fs.existsSync(path.resolve(assetsDir, primaryPath)))
      return primaryPath;
    return fallbackPath || primaryPath;
  };
}

/**
 * Transforms tag objects into Docusaurus head tag format
 */
export function buildHeadTags(tags = []) {
  return tags.map((tag) => {
    if (tag.tagName && tag.attributes) return tag;
    const [tagName, attributes] = Object.entries(tag)[0];
    return { tagName, attributes };
  });
}
