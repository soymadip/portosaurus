import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.mjs";
import { getPackageManager } from "../utils/packageManager.mjs";
import { mirrorSync } from "../utils/systemUtils.mjs";
import { PortoRoot, PortoPkg } from "../core/constants.mjs";

export async function initCommand(projectName, options) {
  const UsrProjDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(PortoRoot, "src/template");

  const TemplateVars = {
    projectName: projectName,
    portoVer: PortoPkg.version,
    portoHome: PortoPkg.homepage,
    portoRepo: PortoPkg.repository?.url || "",
  };

  const ignoreList = [
    "node_modules",
    ".docusaurus",
    ".cache-loader",
    "build",
    ".DS_Store",
    ".git",
  ];

  const contentDirs = ["blog", "notes", "static"];

  const dotGitIgnore = path.join(UsrProjDir, ".gitignore");
  const plainGitIgnore = path.join(UsrProjDir, "gitignore");

  if (fs.existsSync(UsrProjDir)) {
    logger.error(`Target Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  logger.box("Initializing New Portosaurus Project", ` v${PortoPkg.version} `);

  logger.info(`Creating new project in ${projectName}...`);

  try {
    const { execSync } = await import("child_process");

    // Create user project directory
    fs.mkdirSync(UsrProjDir, { recursive: true });

    // Git Init
    try {
      execSync("git init", { cwd: UsrProjDir, stdio: "ignore" });
    } catch {
      logger.warn("Failed to initialize git repository.");
      process.exit(1);
    }

    // Make Content directories
    for (const dir of contentDirs) {
      fs.mkdirSync(path.join(UsrProjDir, dir), { recursive: true });
    }

    // Copy template files, dirs
    if (fs.existsSync(templateDir)) {
      mirrorSync(templateDir, UsrProjDir, TemplateVars, ignoreList);

      // Rename gitignore to .gitignore (to bypass npm publish exclusions)
      if (fs.existsSync(plainGitIgnore) && !fs.existsSync(dotGitIgnore)) {
        fs.renameSync(plainGitIgnore, dotGitIgnore);
      }
    } else {
      logger.error(`Portosaurus template directory not found: ${templateDir}`);
      process.exit(1);
    }

    // Initial Commit
    try {
      // Add all files to git
      execSync("git add .", {
        cwd: UsrProjDir,
        stdio: "ignore",
      });

      // Initial Commit
      execSync('git commit -m "Initialize Portosaurus project"', {
        cwd: UsrProjDir,
        stdio: "ignore",
      });
    } catch {
      logger.warn(
        "Failed to commit changes.\nPlease commit your changes manually.",
      );
    }

    // GitHub Pages setup
    if (options.githubPages === false) {
      const ghDir = path.join(UsrProjDir, ".github");

      // Delete copied .github directory
      if (fs.existsSync(ghDir)) {
        fs.rmSync(ghDir, { recursive: true, force: true });
        logger.info("Skipped GitHub Pages setup.");
      }
    } else {
      logger.success("GitHub Pages deployment configured.");
      logger.tip(
        "Enable GitHub Pages in repo: Settings > Pages > Source: GitHub Actions",
      );
    }

    logger.success(`Created ${projectName} at ${UsrProjDir}`);

    // Install dependencies
    const pm = getPackageManager(UsrProjDir);

    if (options.install !== false) {
      logger.info(`Installing dependencies with ${pm.name}...`);
      logger.info(`Running ${pm.install}...`);
      try {
        const { execSync } = await import("child_process");
        execSync(pm.install, { cwd: UsrProjDir, stdio: "inherit" });
        logger.success("Dependencies installed!");
      } catch {
        logger.error(
          "Failed to install dependencies. You can run it manually later.",
        );
      }
    }

    logger.tip("You can now run:");
    logger.info(`  cd ${projectName}`);
    logger.info(`  ${pm.run} dev`);

    // end
  } catch (error) {
    logger.error(`Failed to initialize project: ${error.message}`);
    process.exit(1);
  }
}
