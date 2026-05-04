import path from "path";

const pkgDir = path.resolve(import.meta.dirname, "../");

export const ThemePaths = {
  root: pkgDir,
  assets: path.resolve(pkgDir, "assets"),
  theme: path.resolve(pkgDir, "theme"),
  plugins: path.resolve(pkgDir, "src/plugins"),
};

export { default as ThemePlugin } from "./plugins/theme.mjs";

export default ThemePaths;
