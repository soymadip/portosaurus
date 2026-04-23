import fs from "fs";
import path from "path";
import { logger } from "./logger.mjs";

/**
 * Resolve {{...}} template references and @alias/ path prefixes
 * inside config string values.
 */
export function resolveVars(
  obj,
  UserConfig,
  systemVars = {},
  pathStack = new Set(),
  depth = 0,
) {
  if (depth > 10) return obj;

  if (typeof obj === "string") {
    // If the entire string is exactly one {{tag}}, return the raw value
    const singleMatch = obj.match(/^\{\{([^}]+)\}\}$/);

    if (singleMatch && !obj.includes("{{", 2)) {
      const refPath = singleMatch[1];

      // Check system variables first
      if (systemVars[refPath] !== undefined) return systemVars[refPath];

      // Handle {{env:VAR}}
      if (refPath.startsWith("env:")) {
        const envVar = refPath.slice(4);
        return process.env[envVar] || "";
      }

      const parts = refPath.split(".");
      let val = UserConfig;

      for (const p of parts) {
        if (val == null || typeof val !== "object") break;
        val = val[p];
      }
      if (val !== undefined && val !== obj) {
        return resolveVars(val, UserConfig, systemVars, pathStack, depth + 1);
      }
    }

    // Resolve {{...}} template variables
    let result = obj.replace(
      /(\\?)\{\{([^}]+)\}\}/g,
      (match, escape, refPath) => {
        if (escape === "\\") return `{{${refPath}}}`;

        // Support system variables from systemVars
        if (systemVars[refPath] !== undefined) return systemVars[refPath];

        // Handle {{env:VAR}}
        if (refPath.startsWith("env:")) {
          const envVar = refPath.slice(4);
          return process.env[envVar] || "";
        }

        if (pathStack.has(refPath)) return match;

        const parts = refPath.split(".");
        let val = UserConfig;
        for (const p of parts) {
          if (val == null || typeof val !== "object") return match;
          val = val[p];
        }

        if (val === undefined) return match;

        const newStack = new Set(pathStack);
        newStack.add(refPath);

        if (typeof val === "string" && val.includes("{{")) {
          return resolveVars(val, UserConfig, systemVars, newStack, depth + 1);
        }
        return val;
      },
    );

    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      resolveVars(item, UserConfig, systemVars, pathStack, depth),
    );
  }

  if (obj && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveVars(
        value,
        UserConfig,
        systemVars,
        pathStack,
        depth,
      );
    }
    return result;
  }
  return obj;
}

/**
 * Resolves the site URL based on config value and environment.
 */
export function resolveSiteUrl(configValue) {
  if (configValue === "auto") {
    if (process.env.CI_PAGES_URL) {
      try {
        const url = new URL(process.env.CI_PAGES_URL);
        return `${url.protocol}//${url.host}`;
      } catch (e) {}
    }

    if (process.env.GITHUB_ACTIONS === "true") {
      const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
      if (serverUrl === "https://github.com") {
        const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
        return `https://${repoOwner}.github.io`;
      }
      try {
        const url = new URL(serverUrl);
        return `${url.protocol}//${url.host}`;
      } catch (e) {}
    }
    return "http://localhost";
  }
  return configValue;
}

/**
 * Resolves the base path based on config value and environment.
 */
export function resolveBasePath(configValue) {
  if (configValue === "auto") {
    if (process.env.CI_PAGES_URL) {
      try {
        const url = new URL(process.env.CI_PAGES_URL);
        return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
      } catch (e) {}
    }

    if (process.env.GITHUB_ACTIONS === "true") {
      const repo = process.env.GITHUB_REPOSITORY;
      if (!repo) return "/";
      const [owner, name] = repo.split("/");
      const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
      if (serverUrl === "https://github.com" && name === `${owner}.github.io`) {
        return "/";
      }
      return `/${name}/`;
    }
    return "/";
  }
  return configValue;
}

/**
 * Creates a static asset resolver for a specific project.
 * Checks if a static asset exists in given path else fallback
 */
export function createStaticAssetResolver(
  UserRoot,
  UserStaticDir,
  PortoAssetDir,
) {
  return function resolveStaticAsset(primaryPath, fallbackPath) {
    // If no primary path provided, go straight to fallback
    if (!primaryPath) return fallbackPath || "";

    // 1. Handle Remote URLs immediately
    if (typeof primaryPath === "string" && /^https?:\/\//.test(primaryPath)) {
      return primaryPath;
    }

    // 2. Handle Relative Paths (./ or ../)
    let resolvedPath = primaryPath;
    if (
      typeof primaryPath === "string" &&
      (primaryPath.startsWith("./") || primaryPath.startsWith("../"))
    ) {
      resolvedPath = path.resolve(UserRoot, primaryPath);
    }

    // 3. Handle Absolute Paths
    if (path.isAbsolute(resolvedPath)) {
      if (fs.existsSync(resolvedPath)) {
        // If it's inside one of our static dirs, make it relative for Docusaurus
        let relativePath = "";
        if (resolvedPath.startsWith(UserStaticDir)) {
          relativePath = path.relative(UserStaticDir, resolvedPath);
        } else if (resolvedPath.startsWith(PortoAssetDir)) {
          relativePath = path.relative(PortoAssetDir, resolvedPath);
        }

        if (relativePath) {
          // Ensure it's a web-friendly URL (leading slash and forward slashes)
          const urlPath = relativePath.split(path.sep).join("/");
          return urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
        }

        // If it's outside static dirs, Docusaurus won't be able to serve it directly
        // via a string URL. We return the absolute path as a last resort,
        // but ideally the user should put assets in a static dir.
        return resolvedPath;
      }
    }

    // 4. Search in known static directories
    const existsInUser = fs.existsSync(
      path.resolve(UserStaticDir, primaryPath),
    );
    const existsInPorto = fs.existsSync(
      path.resolve(PortoAssetDir, primaryPath),
    );

    if (existsInUser || existsInPorto) {
      return primaryPath;
    }

    // 5. Fallback Logic
    if (fallbackPath) {
      // Only warn if the user actually provided a primary path that we couldn't find
      if (primaryPath && primaryPath !== fallbackPath) {
        logger.warn(
          `Asset not found: "${primaryPath}" — using default: "${fallbackPath}"`,
        );
      }
      return fallbackPath;
    }

    return "";
  };
}

/**
 * Builds the final headTags array from a list of user-friendly tag objects.
 *
 * Each tag in the list should be in the format: { tagName: attributes }
 * Example: { meta: { name: "theme-color", content: "red" } }
 *
 * @param {Array} tags - Array of tag objects
 */
export function buildHeadTags(tags = []) {
  return (Array.isArray(tags) ? tags : []).map((tagObj) => {
    if (!tagObj || typeof tagObj !== "object") return tagObj;

    // If it's already in Docusaurus format: { tagName, attributes }
    if (tagObj.tagName && tagObj.attributes) return tagObj;

    // Otherwise, treat the key as tagName and the value as attributes
    const entries = Object.entries(tagObj);
    if (entries.length === 0) return tagObj;

    const [tagName, attributes] = entries[0];
    return { tagName, attributes };
  });
}
