import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The absolute path to the Portosaurus package root.
 * Calculated relative to this file's location in src/utils/
 */
export const PortoRoot = path.resolve(__dirname, "../../");

/**
 * Common paths inside the framework
 */
export const Paths = {
  template: path.join(PortoRoot, "src/template"),
  assets: path.join(PortoRoot, "src/assets"),
  theme: path.join(PortoRoot, "src/theme"),
  core: path.join(PortoRoot, "src/core"),
  plugins: path.join(PortoRoot, "src/plugins"),
};
