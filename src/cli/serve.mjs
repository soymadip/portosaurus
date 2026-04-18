import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.mjs";
import {
  validateProject,
  writePortoConfigShim,
  runDocusaurus,
} from "../utils/cliUtils.mjs";

export async function serveCommand(siteDir) {
  const UserRoot = siteDir
    ? path.resolve(process.cwd(), siteDir)
    : process.cwd();
  validateProject(UserRoot);

  const buildDir = path.join(UserRoot, "build");
  if (!fs.existsSync(buildDir)) {
    logger.error("Build directory not found. Run 'portosaurus build' first.");
    process.exit(1);
  }

  logger.info("Serving Portosaurus site...");
  try {
    const configPath = writePortoConfigShim(UserRoot);
    await runDocusaurus("serve", ["--dir", buildDir], UserRoot, configPath);
  } catch (error) {
    logger.error(`Failed to serve: ${error.message}`);
    process.exit(1);
  }
}
