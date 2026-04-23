import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.mjs";
import {
  validateProject,
  ensureContentDirs,
  writePortoConfigShim,
  runDocusaurus,
} from "../utils/cliUtils.mjs";
import { PortoPkg } from "../core/constants.mjs";

export async function buildCommand(siteDir, extraArgs) {
  const UserRoot = siteDir
    ? path.resolve(process.cwd(), siteDir)
    : process.cwd();
  validateProject(UserRoot);
  ensureContentDirs(UserRoot);

  logger.box("Portosaurus Build", `v${PortoPkg.version}`);
  logger.info("Building Portosaurus site...");
  try {
    const configPath = writePortoConfigShim(UserRoot);
    const buildDir = path.join(UserRoot, "build");
    const args = ["--out-dir", buildDir, ...(extraArgs || [])];

    await runDocusaurus("build", args, UserRoot, configPath);

    // Create .nojekyll for GitHub Pages compatibility
    if (fs.existsSync(buildDir)) {
      fs.writeFileSync(path.join(buildDir, ".nojekyll"), "");
      logger.info("Created .nojekyll");
    }

    logger.success("Build completed successfully!");
    logger.info(`Output directory: ${buildDir}`);
  } catch (error) {
    logger.error(`Failed to build: ${error.message}`);
    process.exit(1);
  }
}
