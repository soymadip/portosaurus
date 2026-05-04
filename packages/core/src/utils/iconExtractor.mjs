import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "@portosaur/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Extracts specific SVGs from the internal assets and saves them to the project.
 */
export async function extractSvg(iconName, destDir, options = {}) {
  const srcPath = path.resolve(
    __dirname,
    `../../assets/img/svg/icon-${iconName}.svg`,
  );

  const destPath = path.join(destDir, `icon-${iconName}.svg`);

  if (!fs.existsSync(srcPath)) {
    logger.warn(`Source icon not found: ${srcPath}`);
    return false;
  }

  fs.mkdirSync(destDir, { recursive: true });

  let content = fs.readFileSync(srcPath, "utf8");

  if (options.color) {
    content = content.replace(/fill="[^"]*"/g, `fill="${options.color}"`);
  }
  fs.writeFileSync(destPath, content);

  logger.info(`Generated SVG icon: ${destPath}`);
  return destPath;
}
