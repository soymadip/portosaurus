import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const docsRoot = path.resolve(__dirname, "..");
const portoPkgPath = path.resolve(docsRoot, "..", "package.json");
const portoPkg = JSON.parse(fs.readFileSync(portoPkgPath, "utf-8"));

// Extract Major and Minor version (e.g. "1.4" from "1.4.1")
const [major, minor, patch] = portoPkg.version.split(".");
const snapshotName = `v${major}.${minor}`;

if (patch !== "0") {
  console.log(
    `ℹ️ Version ${portoPkg.version} is a bugfix update. Skipping documentation snapshot.`,
  );
  process.exit(0);
}

const mdDir = path.join(docsRoot, "md");
const archiveDir = path.join(mdDir, "archive");
const versionDir = path.join(archiveDir, snapshotName);
const versionsFile = path.join(docsRoot, "versions.json");

// Read existing versions
let versions = [];
if (fs.existsSync(versionsFile)) {
  versions = JSON.parse(fs.readFileSync(versionsFile, "utf-8"));
}

if (versions.includes(snapshotName)) {
  console.log(`ℹ️ Snapshot ${snapshotName} already exists. Skipping.`);
  process.exit(0);
}

if (!fs.existsSync(versionDir)) {
  fs.mkdirSync(versionDir, { recursive: true });
}

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    // Skip internal VitePress directory and archive directory
    if (entry.name === ".vitepress" || entry.name === "archive") continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`📸 Snapshotting docs to ${versionDir}...`);
copyDir(mdDir, versionDir);

// Prepend new version
versions.unshift(snapshotName);
fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2) + "\n");

console.log(`✅ Documentation snapshot ${snapshotName} successfully created!`);
