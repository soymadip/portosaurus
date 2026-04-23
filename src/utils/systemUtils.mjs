import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Safely load and parse a package.json file from a directory.
 */
export function loadPkg(dir) {
  try {
    const pkgPath = path.resolve(dir, "package.json");
    if (!fs.existsSync(pkgPath)) return {};
    return JSON.parse(fs.readFileSync(pkgPath, "utf8")) || {};
  } catch {
    return {};
  }
}

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
 * Safely retrieves a nested value from an object using a dot-notated path.
 * Supports preference chains: getNestedValue(obj, "path.one", "path.two", "fallback")
 */
export function getNestedValue(obj, ...args) {
  if (!obj || args.length === 0) return undefined;

  for (let i = 0; i < args.length; i++) {
    const path = args[i];

    // If it's a string, try to resolve it as a path
    if (typeof path === "string") {
      const parts = path.split(".");
      let val = obj;
      let found = true;

      for (const part of parts) {
        if (val === null || typeof val !== "object" || !(part in val)) {
          found = false;
          break;
        }
        val = val[part];
      }

      // If found and valid, return it
      if (found && val !== null && val !== undefined) {
        return val;
      }
    }

    // If it's the last argument:
    // 1. If it's not a string, it's definitely our fallback value.
    // 2. If it is a string but we have multiple arguments, treat it as the final fallback.
    // 3. If it's the ONLY argument, and we didn't find it, return undefined.
    if (i === args.length - 1) {
      if (args.length > 1) return path;
      return undefined;
    }
  }

  return undefined;
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
 * Recursively copy a directory and apply text replacements.
 */
export function mirrorSync(src, dest, replacements = {}, ignores = []) {
  const ignoreSet = new Set(ignores);
  const textExtensions = new Set([
    ".js",
    ".mjs",
    ".json",
    ".md",
    ".mdx",
    ".yml",
    ".yaml",
    ".css",
    ".html",
    ".txt",
  ]);

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (ignoreSet.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      mirrorSync(srcPath, destPath, replacements, ignores);
    } else {
      const ext = path.extname(entry.name).toLowerCase();

      // If replacements exist and it's a known text file, process it
      if (Object.keys(replacements).length > 0 && textExtensions.has(ext)) {
        let content = fs.readFileSync(srcPath, "utf8");
        for (const [key, value] of Object.entries(replacements)) {
          // Replace all occurrences of {{key}}
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
          content = content.replace(regex, value);
        }
        fs.writeFileSync(destPath, content);
      } else {
        fs.copyFileSync(srcPath, destPath); // Safe copy for binaries (images, etc) or when no replacements needed
      }
    }
  }
}
