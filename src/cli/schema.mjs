import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.mjs";
import { PortoRoot } from "../core/constants.mjs";

/**
 * Portosaurus Discovery-Based Schema Generator
 *
 * This command "discovers" the configuration schema by running the actual
 * buildDocuConfig logic with a Spy Proxy. Every key accessed by the framework
 * is recorded and mapped to a JSON schema.
 */

export async function schemaCommand(outPath, srcPath) {
  const SOURCE_FILE = srcPath
    ? path.resolve(process.cwd(), srcPath)
    : path.resolve(PortoRoot, "src/core/buildDocuConfig.mjs");

  const OUTPUT_FILE = outPath
    ? path.resolve(process.cwd(), outPath)
    : path.resolve(PortoRoot, "configSchema.json");
  const discoveredSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Portosaurus Project Configuration",
    type: "object",
    properties: {},
    required: [],
    additionalProperties: true,
  };

  logger.info("Initializing Schema Discovery Engine...");

  try {
    logger.info(`Discovering keys from ${SOURCE_FILE}...`);

    const sourceCode = fs.readFileSync(SOURCE_FILE, "utf8");

    // State-Aware Balanced Parenthesis Walker
    const getStartRegex = /get\(\s*["']([^"']+)["']\s*,\s*/g;
    let match;

    while ((match = getStartRegex.exec(sourceCode)) !== null) {
      const keyPath = match[1];
      const startIdx = match.index + match[0].length;

      let braceCount = 1;
      let currentIdx = startIdx;
      let defaultValueRaw = "";

      let inString = null; // ', ", or `
      let inComment = null; // // or /*
      let escaped = false;

      while (braceCount > 0 && currentIdx < sourceCode.length) {
        const char = sourceCode[currentIdx];
        const nextChar = sourceCode[currentIdx + 1];

        if (escaped) {
          escaped = false;
        } else if (char === "\\") {
          escaped = true;
        } else if (!inString && !inComment) {
          if (char === "'" || char === '"' || char === "`") inString = char;
          else if (char === "/" && nextChar === "/") inComment = "//";
          else if (char === "/" && nextChar === "*") inComment = "/*";
          else if (char === "(") braceCount++;
          else if (char === ")") braceCount--;
        } else if (inString) {
          if (char === inString) inString = null;
        } else if (inComment === "//") {
          if (char === "\n") inComment = null;
        } else if (inComment === "/*") {
          if (char === "*" && nextChar === "/") {
            inComment = null;
            defaultValueRaw += "*/";
            currentIdx += 2;
            continue;
          }
        }

        if (braceCount > 0) {
          defaultValueRaw += char;
        }
        currentIdx++;
      }

      // Extraction of comments (Description)
      let description = "";
      const linesBefore = sourceCode.slice(0, match.index).split("\n");
      let i = linesBefore.length - 1;

      // Look for a comment on the line immediately preceding
      // We look back up to 5 lines for a docstring or single comment
      let foundComment = [];
      let inDocBlock = false;

      while (i >= 0 && foundComment.length < 15) {
        let line = linesBefore[i].trim();

        // Stop if we hit an empty line (unless we are inside a DocBlock)
        if (!line && !inDocBlock) break;

        if (line.endsWith("*/")) inDocBlock = true;

        if (inDocBlock) {
          const content = line.replace(/^\/\*\*?|\*\/|\*/g, "").trim();
          if (content) foundComment.unshift(content);
          if (line.startsWith("/*") || line.startsWith("/**"))
            inDocBlock = false;
        } else if (line.startsWith("//")) {
          let content = line.replace(/^\/\/\s?/, "").trim();
          if (!content.match(/^(TODO|FIXME|NOTE|SECTION|---)/i)) {
            foundComment.unshift(content);
          }
        } else if (line && !line.startsWith("/") && !line.startsWith("*")) {
          // WE HIT CODE! Stop immediately.
          break;
        }
        i--;
      }
      description = foundComment.join("\n").trim();

      // Basic type inference and Default Value cleaning
      let type = "string";
      let defaultValue = undefined;

      // Handle multi-argument get(key, fall1, fall2, finalDefault)
      // We need to find the final argument as the default
      let args = [];
      let currentArg = "";
      let depth = 0;
      let argInString = null;

      for (let i = 0; i < defaultValueRaw.length; i++) {
        const c = defaultValueRaw[i];
        if (!argInString) {
          if (c === "'" || c === '"' || c === "`") argInString = c;
          else if (c === "(" || c === "[" || c === "{") depth++;
          else if (c === ")" || c === "]" || c === "}") depth--;
          else if (c === "," && depth === 0) {
            args.push(currentArg.trim());
            currentArg = "";
            continue;
          }
        } else if (c === argInString && defaultValueRaw[i - 1] !== "\\") {
          argInString = null;
        }
        currentArg += c;
      }
      if (currentArg.trim()) args.push(currentArg.trim());

      // We use the last argument as the primary default value for the schema
      let val = (args[args.length - 1] || "").trim();

      if (val === "true" || val === "false") {
        type = "boolean";
        defaultValue = val === "true";
      } else if (!isNaN(val) && val !== "") {
        type = "number";
        defaultValue = Number(val);
      } else if (
        val.startsWith("[") ||
        val.includes(".map(") ||
        val.includes(".filter(") ||
        val.includes(".slice(") ||
        val.startsWith("require")
      ) {
        type = "array";
      } else if (val.startsWith("{")) {
        type = "object";
      } else if (val) {
        // It's a string, remove surrounding quotes and unescape
        defaultValue = val.replace(/^["'`](.*)["'`]$/s, "$1").trim();
      }

      const parts = keyPath.split(".");
      let current = discoveredSchema.properties;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;

        if (!current[part]) {
          if (isLast) {
            current[part] = { type };
            if (description) current[part].description = description;
            if (defaultValue !== undefined)
              current[part].default = defaultValue;
          } else {
            current[part] = { type: "object", properties: {} };
          }
        } else if (!isLast && current[part].type !== "object") {
          // Upgrade to object if it was previously a leaf node but now has children
          current[part] = { type: "object", properties: {} };
        }

        if (!isLast) {
          if (!current[part].properties) current[part].properties = {};
          current = current[part].properties;
        }
      });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(discoveredSchema, null, 2));
    logger.success(
      `Successfully discovered and wrote schema to: ${OUTPUT_FILE}`,
    );
  } catch (error) {
    logger.error(`Discovery failed: ${error.message}`);
    process.exit(1);
  }
}
