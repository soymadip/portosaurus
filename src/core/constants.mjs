import path from "path";
import { fileURLToPath } from "url";
import { loadPkg } from "../utils/systemUtils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The absolute path to the Portosaurus package root.
 */
export const PortoRoot = path.resolve(__dirname, "../../");

/**
 * The Portosaurus package.json content.
 */
export const PortoPkg = loadPkg(PortoRoot);

/**
 * Common paths inside the package
 */
export const Paths = {
  template: path.join(PortoRoot, "src/template"),
  assets: path.join(PortoRoot, "src/assets"),
  theme: path.join(PortoRoot, "src/theme"),
  core: path.join(PortoRoot, "src/core"),
  plugins: path.join(PortoRoot, "src/plugins"),
  utils: path.join(PortoRoot, "src/utils"),
};
