import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * A minimal Docusaurus theme plugin that registers the
 * Portosaurus package's src/theme/ directory as a theme source.
 *
 * This allows Root.js, MDXComponents.js, etc. to be picked up
 * from inside the portosaurus package without the user needing
 * to have them in their own project.
 */
export default function themePlugin(_context, options) {
  return {
    name: "portosaurus-theme",

    getThemePath() {
      // Fallback to internal theme directory relative to this file
      return options.themeDir || path.resolve(__dirname, "../theme");
    },
  };
}
