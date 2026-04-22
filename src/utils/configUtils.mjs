import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { logger } from "./logger.mjs";
import { PortoRoot } from "../core/constants.mjs";

/**
 * Deep merge two objects. Source values override target values.
 * Arrays are replaced, not concatenated.
 */
export function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

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
 * Read the portosaurus package version.
 */
export function getVersion() {
  try {
    const pkgPath = path.resolve(PortoRoot, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg.version || "0.0.0";
  } catch {
    return "N/A";
  }
}

/**
 * Get the last git commit date in a human-readable format.
 */
export function getGitDate(siteDir) {
  try {
    const result = execSync(
      'git log -1 --format=%cd --date=format:"%B %d, %Y"',
      {
        cwd: siteDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    return result.trim();
  } catch {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Filter items that have enable/value conditional structure.
 */
export function useEnabled(items) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (
      item &&
      typeof item === "object" &&
      "enable" in item &&
      "value" in item
    ) {
      return item.enable === true ? [item.value] : [];
    }
    return [item];
  });
}

/**
 * Creates a static asset resolver for a specific project.
 * Checks if a static asset exists in given path else fallback
 */
export function createStaticAssetResolver(UserStaticDir, PortoAssetDir) {
  return function resolveStaticAsset(primaryPath, fallbackPath) {
    // If no primary path provided, go straight to fallback
    if (!primaryPath) return fallbackPath || "";

    // 1. Handle Remote URLs immediately
    if (typeof primaryPath === "string" && /^https?:\/\//.test(primaryPath)) {
      return primaryPath;
    }

    // 2. Handle Absolute Paths (if resolved via template vars)
    if (path.isAbsolute(primaryPath)) {
      if (fs.existsSync(primaryPath)) {
        // If it's inside one of our static dirs, make it relative for Docusaurus
        if (primaryPath.startsWith(UserStaticDir)) {
          return path.relative(UserStaticDir, primaryPath);
        }
        if (primaryPath.startsWith(PortoAssetDir)) {
          return path.relative(PortoAssetDir, primaryPath);
        }
        return primaryPath;
      }
    }

    // 3. Search in static directories
    const existsInUser = fs.existsSync(
      path.resolve(UserStaticDir, primaryPath),
    );
    const existsInPorto = fs.existsSync(
      path.resolve(PortoAssetDir, primaryPath),
    );

    if (existsInUser || existsInPorto) {
      return primaryPath;
    }

    // 4. Fallback Logic
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
 * Safely retrieves a nested value from an object using a dot-notated path.
 */
export function getNestedValue(obj, path, fallback) {
  const parts = path.split(".");
  let val = obj;
  for (const part of parts) {
    if (val == null || typeof val !== "object") {
      val = undefined;
      break;
    }
    val = val[part];
  }
  return val !== undefined ? val : fallback;
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
