import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.mjs";

/**
 * Generates a robots.txt file in the site's static directory.
 */
export function generateRobotsTxt(context) {
  const { siteConfig } = context;
  const { robotsTxt } = siteConfig.customFields;

  if (robotsTxt?.enable === false) {
    return;
  }

  logger.info("Generating robots.txt...");

  const staticDir = path.resolve(context.siteDir, "static");
  const robotsPath = path.join(staticDir, "robots.txt");

  let content = "User-agent: *\n";

  if (robotsTxt?.rules) {
    for (const rule of robotsTxt.rules) {
      if (rule.allow) {
        for (const p of [].concat(rule.allow)) {
          content += `Allow: ${p}\n`;
        }
      }
      if (rule.disallow) {
        for (const p of [].concat(rule.disallow)) {
          content += `Disallow: ${p}\n`;
        }
      }
    }
  }

  if (robotsTxt?.customLines) {
    for (const line of robotsTxt.customLines) {
      content += `${line}\n`;
    }
  }

  if (siteConfig.url) {
    content += `Sitemap: ${siteConfig.url}${siteConfig.baseUrl}sitemap.xml\n`;
  }

  fs.mkdirSync(staticDir, { recursive: true });
  fs.writeFileSync(robotsPath, content);
  logger.success(`Generated robots.txt at ${robotsPath}`);
}

export default function robotsTxtPlugin(context, options) {
  return {
    name: "robots-txt-generator",
    async postBuild() {
      generateRobotsTxt(context);
    },
  };
}
