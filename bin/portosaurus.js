#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
const {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  mkdirpSync,
  readdirSync,
  copySync,
  removeSync,
} = fs;
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { spawn, execSync } from "child_process";
import { createRequire } from "module";

import { logger } from "../src/utils/logger.js";
import { createDocuConf, writeDocuConf } from "../src/utils/createDocuConf.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url)),
);

const program = new Command();

program
  .name("portosaurus")
  .description("CLI for Portosaurus - The complete portfolio solution")
  .version(packageJson.version, "-v, --version", "output the current version");

// ----------- HELPERS -------------

// Helper to clean up internal index.md from user notes
function cleanUserNotesIndex(projectRoot) {
  const userNotesIndex = path.join(projectRoot, "notes", "index.md");
  if (existsSync(userNotesIndex)) {
    removeSync(userNotesIndex);
  }
}

async function prepareDocusaurusRun(projectRoot) {
  const configPath = path.join(projectRoot, "config.js");

  if (!existsSync(configPath)) {
    console.log();
    logger.error(
      "config.js not found. Are you in a Portosaurus project directory?",
    );
    process.exit(1);
  }

  // Ensure internal files are synced to .portosaurus
  const internalDir = path.join(__dirname, "../src/internal");
  const runtimeDir = path.join(projectRoot, ".portosaurus");

  // Ensure .portosaurus exists and is clean
  fs.emptyDirSync(runtimeDir);

  // Ensure user has essential folders in project root
  fs.ensureDirSync(path.join(projectRoot, "notes"));
  fs.ensureDirSync(path.join(projectRoot, "blog"));
  fs.ensureDirSync(path.join(projectRoot, "static"));

  // Ensure notes/index.md exists
  const userIndexPage = path.join(projectRoot, "notes/index.md");
  if (!existsSync(userIndexPage)) {
    const internalIndexPage = path.join(internalDir, "notes/index.md");
    if (existsSync(internalIndexPage)) {
      fs.copySync(internalIndexPage, userIndexPage);
    }
  }

  // 1. Copy everything from internal to .portosaurus (skipping content folders except static)
  fs.copySync(internalDir, runtimeDir, {
    filter: (src) => {
      const relative = path.relative(internalDir, src);
      return !["notes", "blog"].includes(relative);
    },
  });

  // 2. Overwrite with user files if they exist in project root
  // We only sync "static" and other internal-shadowing files to runtime
  // Notes and Blog are served directly from projectRoot via createConfig.js
  const syncItems = [...new Set([...readdirSync(internalDir), "static"])];

  for (const file of syncItems) {
    const userFile = path.resolve(projectRoot, file);
    const destFile = path.resolve(runtimeDir, file);

    // Skip notes and blog folders in the sync loop - they are served from root!
    if (file === "notes" || file === "blog") continue;

    if (existsSync(userFile)) {
      if (fs.statSync(userFile).isDirectory()) {
        fs.ensureDirSync(destFile);
      }
      fs.copySync(userFile, destFile, {
        overwrite: true,
      });
    }
  }

  // Load user config
  const require = createRequire(import.meta.url);

  let userConfig;
  try {
    userConfig = require(configPath);
  } catch (e) {
    logger.error(`Failed to load config.js: ${e.message}`);
    process.exit(1);
  }

  // Ensure defaults if missing
  // Generate Docusaurus Config
  // Write temp config file INSIDE .portosaurus
  const tempConfigPath = path.join(runtimeDir, "docusaurus.config.js");
  writeDocuConf(userConfig, projectRoot, tempConfigPath);
  logger.success("Generated Docusaurus config in .portosaurus.");

  return { runtimeDir };
}

async function runDocusaurus(command, args, runtimeDir, projectRoot) {
  // Detect package manager and find docusaurus binary
  const { findDocusaurusBin } = await import("../src/utils/packageManager.js");
  const docusaurus = findDocusaurusBin(projectRoot || process.cwd());

  logger.info(
    `Running docusaurus ${command} (via ${docusaurus.packageManager})`,
  );

  const child = spawn(
    docusaurus.command,
    [...docusaurus.args, command, runtimeDir, ...args],
    {
      stdio: "inherit",
      cwd: projectRoot,
      env: { ...process.env, FORCE_COLOR: "true" },
    },
  );

  return new Promise((resolve, reject) => {
    child.on("error", (err) => {
      logger.error(`Failed to run docusaurus ${command}: ${err.message}`);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else {
        process.exit(code);
      }
    });
  });
}

// --- INIT COMMAND ---

program
  .command("init")
  .description("Initialize a new Portosaurus project")
  .argument("<project-name>", "Name of the project directory")
  .option("-ngh, --no-github-pages", "Skip GitHub Pages deployment setup")
  .option("-ni, --no-install", "Skip dependency installation")
  .action(async (projectName, options) => {
    const projectPath = path.resolve(process.cwd(), projectName);

    if (existsSync(projectPath)) {
      logger.error(`Directory ${projectName} already exists.`);
      process.exit(1);
    }

    logger.info(
      `Creating new Portosaurus project in ${chalk.bold(projectName)}...`,
    );

    try {
      // Create project directory
      mkdirSync(projectPath);

      // Copy template files
      const templatePath = path.resolve(__dirname, "../src/template");

      // Check if template exists (it might not be populated yet)
      if (!existsSync(templatePath)) {
        logger.warn("Template directory not found. Creating basic structure.");

        // Fallback basic creation if template missing (during dev)
        mkdirpSync(path.join(projectPath, "blog"));
        mkdirpSync(path.join(projectPath, "notes"));
        mkdirpSync(path.join(projectPath, "static"));
        writeFileSync(
          path.join(projectPath, "config.js"),
          "module.exports = { /* TODO */ };",
        );
      } else {
        // Copy all template files
        const templateFiles = readdirSync(templatePath);

        for (const file of templateFiles) {
          const srcPath = path.join(templatePath, file);
          const destPath = path.join(projectPath, file);
          copySync(srcPath, destPath);
        }
      }

      // Create package.json
      const packageJsonContent = {
        name: projectName,
        version: "0.0.1",
        private: true,
        scripts: {
          dev: "portosaurus dev",
          start: "portosaurus start",
          serve: "portosaurus serve",
          build: "portosaurus build",
        },
        dependencies: {
          portosaurus: "latest",
        },
      };

      writeFileSync(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJsonContent, null, 2),
      );

      // Git init
      try {
        execSync("git init", { cwd: projectPath, stdio: "ignore" });
      } catch (e) {
        logger.warn("Failed to initialize git repository.");
      }

      // Remove GitHub Pages files if --no-github-pages flag is set
      if (options.githubPages === false) {
        const githubDir = path.join(projectPath, ".github");
        if (existsSync(githubDir)) {
          removeSync(githubDir);
          logger.info("Skipped GitHub Pages setup");
        }
      } else {
        // GitHub Pages is enabled by default
        // Create .nojekyll in static directory
        const nojekyllPath = path.join(projectPath, "static", ".nojekyll");
        writeFileSync(nojekyllPath, "");

        logger.success("GitHub Pages deployment configured");
        logger.tip(
          "Enable GitHub Pages: Settings > Pages > Source: GitHub Actions",
        );
      }

      logger.success(`Success! Created ${projectName} at ${projectPath}`);

      // Detect package manager for install instructions
      const { detectPackageManager } =
        await import("../src/utils/packageManager.js");
      const pm = detectPackageManager(projectPath) || "npm";
      const installCmd = pm === "npm" ? "npm install" : `${pm} install`;
      const runCmd = pm === "npm" ? "npm run" : `${pm} run`;

      if (options.install !== false) {
        logger.info(`Running ${installCmd}...`);
        try {
          execSync(installCmd, {
            cwd: projectPath,
            stdio: "inherit",
          });

          logger.success("Dependencies installed!");
          logger.tip("You can now run:");
          logger.info(`  cd ${projectName}`);
          logger.info(`  ${runCmd} dev`);
        } catch (error) {
          logger.error("Failed to install dependencies.");
          logger.tip("You can install them manually:");
          logger.info(`  cd ${projectName}`);
          logger.info(`  ${installCmd}`);
          logger.info(`  ${runCmd} dev`);
        }
      } else {
        logger.tip("Inside that directory, you can run:");
        logger.info(`  cd ${projectName}`);
        logger.info(`  ${installCmd}`);
        logger.info(`  ${runCmd} dev`);
      }
    } catch (error) {
      logger.error(`Failed to initialize project: ${error.message}`);
      process.exit(1);
    }
  });

// --- CONFIG COMMAND ---

program
  .command("config")
  .description("Show the generated Docusaurus config")
  .option(
    "-f, --file [filePath]",
    "Output to a file (default: porto.docusaurus.config.js)",
  )
  .option("-c, --config <path>", "Path to config file")
  .action(async (options) => {
    const projectRoot = process.cwd();
    let configPath;

    if (options.config) {
      configPath = path.resolve(projectRoot, options.config);
    } else {
      configPath = path.join(projectRoot, "config.js");
    }

    if (!existsSync(configPath)) {
      logger.error(`Config file not found at ${configPath}`);
      process.exit(1);
    }

    const require = createRequire(import.meta.url);

    let userConfig;
    try {
      userConfig = require(configPath);
    } catch (e) {
      logger.error(`Failed to load config.js: ${e.message}`);
      process.exit(1);
    }

    try {
      if (options.file) {
        let filename = "porto.docusaurus.config.js";
        if (typeof options.file === "string") {
          filename = options.file;
        }
        const outputPath = path.resolve(projectRoot, filename);
        writeDocuConf(userConfig, projectRoot, outputPath);
        logger.success(`Config written to ${filename}`);
      } else {
        const docusaurusConfig = createDocuConf(userConfig, projectRoot);
        console.log(JSON.stringify(docusaurusConfig, null, 2));
      }
    } catch (error) {
      logger.error(`Failed to generate config: ${error.message}`);
      process.exit(1);
    }
  });

// --- START COMMAND ---

program
  .command("start")
  .alias("dev")
  .description("Start the development server")
  .action(async () => {
    const projectRoot = process.cwd();
    logger.info("Starting development server...");
    try {
      const { runtimeDir } = await prepareDocusaurusRun(projectRoot);
      await runDocusaurus("start", [], runtimeDir, projectRoot);
    } catch (error) {
      logger.error(`Failed to start: ${error.message}`);
      process.exit(1);
    } finally {
      cleanUserNotesIndex(projectRoot);
    }
  });

// --- BUILD COMMAND ---

program
  .command("build")
  .description("Build the static site")
  .action(async () => {
    const projectRoot = process.cwd();
    logger.info("Building Portosaurus site...");

    try {
      const { runtimeDir } = await prepareDocusaurusRun(projectRoot);

      const buildDir = path.join(projectRoot, "build");
      const args = ["--out-dir", buildDir];

      await runDocusaurus("build", args, runtimeDir, projectRoot);

      // Create .nojekyll for GitHub Pages compatibility
      const nojekyllPath = path.join(buildDir, ".nojekyll");
      if (existsSync(buildDir)) {
        writeFileSync(nojekyllPath, "");
        logger.info("Created .nojekyll");
      }

      logger.success("Build completed successfully!");
      logger.info(`Output directory: ${buildDir}`);
    } catch (error) {
      logger.error(`Failed to build: ${error.message}`);
      process.exit(1);
    } finally {
      cleanUserNotesIndex(projectRoot);
    }
  });

// --- SERVE COMMAND ---

program
  .command("serve")
  .description("Serve the built static site locally")
  .action(async () => {
    const projectRoot = process.cwd();
    logger.info("Serving Portosaurus site...");

    try {
      const { runtimeDir } = await prepareDocusaurusRun(projectRoot);
      const buildDir = path.join(projectRoot, "build");

      if (!existsSync(buildDir)) {
        logger.error(
          "Build directory not found. Run 'portosaurus build' first.",
        );
        process.exit(1);
      }

      await runDocusaurus(
        "serve",
        ["--dir", buildDir],
        runtimeDir,
        projectRoot,
      );
    } catch (error) {
      logger.error(`Failed to serve: ${error.message}`);
      process.exit(1);
    } finally {
      cleanUserNotesIndex(projectRoot);
    }
  });

program.parse();
