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

export async function devCommand(siteDir, extraArgs) {
  const UserRoot = siteDir
    ? path.resolve(process.cwd(), siteDir)
    : process.cwd();
  validateProject(UserRoot);
  ensureContentDirs(UserRoot);

  logger.box("Portosaurus Dev Server", `v${PortoPkg.version}`);
  logger.info("Starting development server...");
  try {
    const configPath = writePortoConfigShim(UserRoot);

    // Watch for config.yml changes to trigger Docusaurus reload
    const configYaml = ["config.yaml", "config.yml"].find((f) =>
      fs.existsSync(path.join(UserRoot, f)),
    );

    if (configYaml) {
      const configYamlPath = path.join(UserRoot, configYaml);
      logger.debug(`Watching ${configYaml} for changes...`);

      const watcher = fs.watch(configYamlPath, (eventType) => {
        if (eventType === "change") {
          logger.info(`Detected change in ${configYaml}, reloading...`);
          // Touch the shim config to trigger Docusaurus reload
          const now = new Date();
          fs.utimesSync(configPath, now, now);
        }
      });

      process.on("SIGINT", () => {
        watcher.close();
        process.exit();
      });
    }

    await runDocusaurus("start", extraArgs || [], UserRoot, configPath);
  } catch (error) {
    logger.error(`Failed to start: ${error.message}`);
    process.exit(1);
  }
}
