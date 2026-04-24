import dLogger from "@docusaurus/logger";
import { consola } from "consola";
import chalk from "chalk";
import * as p from "@clack/prompts";

/**
 * Portosaurus Logger Utility
 * Wraps @docusaurus/logger and @clack/prompts for a perfectly authentic experience.
 */
export const logger = {
  ...consola,

  // Use official Docusaurus logger for standard levels
  info: (msg) => dLogger.info(msg),
  success: (msg) => dLogger.success(msg),
  warn: (msg) => dLogger.warn(msg),
  error: (msg) => dLogger.error(msg),

  // Custom levels / helpers
  start: (msg) => dLogger.info(msg),
  tip: (msg) => consola.log(`${chalk.magenta.bold("[TIP]")} ${msg}`),

  box: (msg, badge) => {
    consola.box({
      message: msg,
      title: badge,
      style: {
        borderColor: "cyan",
        borderStyle: "rounded",
        padding: 1,
      },
    });
  },

  /**
   * Interactive Prompt Helper
   * Uses @clack/prompts for robust validation and hinting.
   */
  prompt: async (msg, opts = {}) => {
    const type = opts.type || "text";
    let res;

    const clackOpts = {
      message: msg,
      initialValue: opts.initial,
      placeholder: opts.placeholder,
      hint: opts.hint,
      options: opts.options,
      validate: opts.validate,
    };

    if (type === "select") {
      res = await p.select(clackOpts);
    } else if (type === "multiselect") {
      res = await p.multiselect(clackOpts);
    } else {
      // For types that clack doesn't natively hint (text, confirm), we append to message
      if (opts.hint) {
        clackOpts.message += ` ${chalk.gray(`(${opts.hint})`)}`;
      }
      if (type === "confirm") {
        res = await p.confirm(clackOpts);
      } else {
        res = await p.text(clackOpts);
      }
    }

    if (p.isCancel(res)) {
      logger.warn("Operation cancelled by user.");
      process.exit(130);
    }

    return res;
  },

  /**
   * Clear Console
   */
  clear: () => console.clear(),
};

export default logger;
