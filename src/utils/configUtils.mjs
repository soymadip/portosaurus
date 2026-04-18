import fs from "fs";
import path from "path";
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
 */
export function createStaticAssetResolver(UserStaticDir, PortoAssetDir) {
  return function resolveStaticAsset(userPath, portoFallback) {
    if (!userPath && !portoFallback) return "";
    if (userPath && /^https?:\/\//.test(userPath)) return userPath;

    // Handle absolute paths (e.g. from {{portoRoot}} resolution)
    if (userPath && path.isAbsolute(userPath)) {
      if (userPath.startsWith(UserStaticDir)) {
        return path.relative(UserStaticDir, userPath);
      }
      if (userPath.startsWith(PortoAssetDir)) {
        return path.relative(PortoAssetDir, userPath);
      }
      // If absolute but outside our known static dirs, check if it exists
      if (fs.existsSync(userPath)) return userPath;
    }

    if (userPath && fs.existsSync(path.resolve(UserStaticDir, userPath))) {
      return userPath;
    }

    if (userPath && fs.existsSync(path.resolve(PortoAssetDir, userPath))) {
      return userPath;
    }

    if (portoFallback) {
      if (
        userPath &&
        userPath !== "favicon/favicon.ico" &&
        fs.existsSync(path.resolve(PortoAssetDir, portoFallback))
      ) {
        logger.warn(`Asset not found: "${userPath}" — using bundled default.`);
      }
      return portoFallback;
    }

    if (userPath && userPath !== "favicon/favicon.ico") {
      logger.warn(`Asset not found: "${userPath}" — no fallback available.`);
    }

    return userPath || "";
  };
}
