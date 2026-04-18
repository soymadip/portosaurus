import path from "path";
import fs from "fs";
import { logger } from "../utils/logger.mjs";
import {
  validateProject,
  ensureContentDirs,
  writePortoConfigShim,
  runDocusaurus,
} from "../utils/cliUtils.mjs";
import { PortoRoot } from "../core/constants.mjs";

export async function devCommand(siteDir, extraArgs) {
  const UserRoot = siteDir
    ? path.resolve(process.cwd(), siteDir)
    : process.cwd();
  validateProject(UserRoot);
  ensureContentDirs(UserRoot);

  const packageJsonPath = path.resolve(PortoRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  logger.box("Portosaurus Dev Server", `v${packageJson.version}`);
  logger.info("Starting development server...");
  try {
    const configPath = writePortoConfigShim(UserRoot);
    await runDocusaurus("start", extraArgs || [], UserRoot, configPath);
  } catch (error) {
    logger.error(`Failed to start: ${error.message}`);
    process.exit(1);
  }
}
