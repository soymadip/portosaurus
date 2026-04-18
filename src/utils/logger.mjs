import { createConsola } from "consola";
import chalk from "chalk";

/**
 * Logger
 * Mimics the official Docusaurus CLI style for a familiar DX.
 */

const consola = createConsola({
  level: process.env.DEBUG || process.env.VERBOSE ? 4 : 3,
});

const format = (badge, color, ...args) => {
  const prefix = color.bold(badge.padEnd(9));
  const message = args
    .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
    .join(" ");

  message.split("\n").forEach((line) => {
    console.log(`${prefix} ${line}`);
  });
};

export const logger = {
  log: (...args) => console.log(...args),
  info: (...args) => format("[INFO]", chalk.cyan, ...args),
  success: (...args) => format("[SUCCESS]", chalk.green, ...args),
  warn: (...args) => format("[WARNING]", chalk.yellow, ...args),
  error: (...args) => format("[ERROR]", chalk.red, ...args),
  tip: (...args) => format("[TIP]", chalk.magenta, ...args),

  debug: (...args) => {
    if (process.env.DEBUG || process.env.VERBOSE) {
      format("[DEBUG]", chalk.gray, ...args);
    }
  },

  box: (msg, title = "Portosaurus") => {
    consola.box({
      message: msg,
      title: chalk.magenta.bold(title),
      style: {
        borderColor: "magenta",
        borderStyle: "rounded",
      },
    });
  },

  start: (msg) => consola.start(msg),
  ready: (msg) => consola.ready(msg),
};

export default logger;
