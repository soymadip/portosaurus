import path from "path";
import { runDocusaurus, validateProject } from "../utils/index.mjs";
import { logger } from "@portosaur/logger";

/**
 * Serves the built Portosaur site locally.
 *
 * Note: Docusaurus 'serve' doesn't require a config shim,
 * as it serves the already built static files from the output directory.
 */
export async function serveCommand(siteDir, extraArgs = []) {
  const UserRoot = siteDir
    ? path.resolve(process.cwd(), siteDir)
    : process.cwd();

  // ------- Setup -------

  validateProject(UserRoot);

  try {
    logger.info("Serving built site...");

    // Docusaurus serve looks for the 'build' directory by default.
    await runDocusaurus("serve", UserRoot, "", extraArgs);
  } catch (error) {
    logger.error(`Failed to serve site: ${error.message}`);
    process.exit(1);
  }
}
