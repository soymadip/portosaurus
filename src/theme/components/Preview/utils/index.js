/**
 * Preview System — Shared utilities
 * File-type classification, extension detection, and URL resolution.
 */

const TEXT_EXTS = [
  "md",
  "txt",
  "js",
  "ts",
  "jsx",
  "tsx",
  "py",
  "json",
  "css",
  "yaml",
  "yml",
  "sh",
  "toml",
  "rs",
  "go",
  "java",
  "c",
  "cpp",
  "h",
  "html",
  "xml",
  "sql",
  "diff",
  "patch",
];

const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

/**
 * Extract the file extension from a path, ignoring query strings.
 */
export function getExt(path) {
  return (path || "").split(".").pop().toLowerCase().split("?")[0];
}

/**
 * Classify a file path into one of: "pdf", "image", "text", or "web".
 */
export function classify(path) {
  if (!path) return "text";
  const ext = getExt(path);
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (TEXT_EXTS.includes(ext)) return "text";
  if (path.startsWith("http")) return "web";
  return "text";
}

/**
 * Resolve a path to a full URL. External URLs pass through unchanged.
 * Local paths are returned as-is (Docusaurus serves them from the static dir).
 */
export function resolveUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("//")) return path;
  if (typeof window === "undefined") return path;

  // Ensure local paths start with / to be root-relative in Docusaurus
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Standardizes a string into a clean URL slug.
 */
export function generatePvSlug(text) {
  return (text || "preview")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generates the unified PV hash with mode suffix.
 * Format: #slug:pv-mode
 */
export function generatePvHash(slug, mode) {
  if (!slug) return "";
  return `${slug}:pv-${mode || "popup"}`;
}

/**
 * Parses a hash string into its component parts.
 */
export function parsePvHash(hash) {
  if (!hash) return null;
  const cleanHash = hash.replace("#", "");
  if (!cleanHash.includes(":pv-")) return null;

  const [slug, mode] = cleanHash.split(":pv-");
  return { slug, mode };
}
