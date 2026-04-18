#!/usr/bin/env bun

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { initCommand } from "../src/cli/init.mjs";
import { devCommand } from "../src/cli/dev.mjs";
import { buildCommand } from "../src/cli/build.mjs";
import { serveCommand } from "../src/cli/serve.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PortoRoot = path.resolve(__dirname, "..");

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(PortoRoot, "package.json"), "utf8"),
);

const program = new Command();

program
  .name("portosaurus")
  .description("CLI for Portosaurus — The complete portfolio solution")
  .version(packageJson.version, "-v, --version", "output the current version");

// ─── COMMANDS ───────────────────────────────────────────────

program
  .command("init")
  .description("Initialize a new Portosaurus project")
  .argument("<project-name>", "Name of the project directory")
  .option("--no-install", "Skip dependency installation")
  .option("--no-github-pages", "Skip GitHub Pages deployment setup")
  .action(initCommand);

program
  .command("start [siteDir] [extraArgs...]")
  .alias("dev")
  .description("Start the development server")
  .allowUnknownOption()
  .action(devCommand);

program
  .command("build [siteDir] [extraArgs...]")
  .description("Build the static site")
  .allowUnknownOption()
  .action(buildCommand);

program
  .command("serve [siteDir]")
  .description("Serve the built static site locally")
  .action(serveCommand);

program.parse();
