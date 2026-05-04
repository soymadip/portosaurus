import path from "node:path";

const srcDir = path.resolve(import.meta.dirname, "../");
const pkgDir = path.resolve(srcDir, "../");

/**
 * Centralized paths for the CLI package.
 */
export const Paths = {
  /** CLI package root. */
  root: pkgDir,

  /** CLI src directory. */
  src: srcDir,

  /** CLI templates directory. */
  templates: path.join(srcDir, "templates"),

  /** Registry file. */
  registry: path.join(srcDir, "templates/registry.yml"),

  /** Workflows directory. */
  workflows: path.join(srcDir, "templates/workflows"),

  /** CLI's package.json file. */
  packageJson: path.join(pkgDir, "package.json"),

  /** Absolute path to the core package. */
  core: path.resolve(pkgDir, "../core"),

  /** Absolute path to the theme package. */
  theme: path.resolve(pkgDir, "../theme"),
};
