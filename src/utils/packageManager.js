import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

/**
 * Detect which package manager is being used in the project
 **/
export function detectPackageManager(projectRoot) {
  // Check for lockfiles
  if (
    fs.existsSync(path.join(projectRoot, "bun.lockb")) ||
    fs.existsSync(path.join(projectRoot, "bun.lock"))
  ) {
    return "bun";
  }
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(projectRoot, "package-lock.json"))) {
    return "npm";
  }

  // Fallback: check which is available in PATH
  const managers = ["bun", "pnpm", "yarn", "npm"];
  for (const manager of managers) {
    try {
      execSync(`${manager} --version`, { stdio: "ignore" });
      return manager;
    } catch {
      // Not available
    }
  }

  return "npm"; // fallback
}

/**
 * Get the command to run a package binary
 * Different package managers have different ways to run binaries
 */
export function getRunCommand(packageManager, binaryName, args = []) {
  switch (packageManager) {
    case "bun":

      // Bun can run binaries directly with `bun run`
      return {
        command: "bun",
        args: ["run", binaryName, ...args],
      };
    case "pnpm":
      // pnpm uses `pnpm exec`
      return {
        command: "pnpm",
        args: ["exec", binaryName, ...args],
      };
    case "yarn":
      // Yarn uses `yarn run`
      return {
        command: "yarn",
        args: ["run", binaryName, ...args],
      };
    case "npm":
    default:
      // npm uses `npx`
      return {
        command: "npx",
        args: [binaryName, ...args],
      };
  }
}

/**
 * Find the docusaurus binary path
 * Falls back to using package manager's run command if not found
 */
export function findDocusaurusBin(projectRoot) {
  const packageManager = detectPackageManager(projectRoot);
  const runCmd = getRunCommand(packageManager, "docusaurus");

  return {
    type: "managed",
    command: runCmd.command,
    args: runCmd.args,
    packageManager,
  };
}
