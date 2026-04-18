import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Extremely minimal utility to simulate getting CSS variables
 * when running in a Node environment during build.
 * It reads the primary color from custom.css via regex.
 */
export function getCssVar(name) {
  try {
    const cssPath = path.resolve(__dirname, "../../theme/css/custom.css");
    const cssContent = fs.readFileSync(cssPath, "utf8");

    if (name === "--ifm-color-primary") {
      const match = cssContent.match(
        /--ifm-color-primary:\s*(#[a-fA-F0-9]{3,6})/,
      );
      return match ? match[1] : "#2e8555";
    }

    if (name === "--ifm-background-color") {
      return "#ffffff";
    }

    return "#000000";
  } catch {
    return "#2e8555"; // Safe default
  }
}
