import fs from "fs";
import path from "path";
import { logger } from "@portosaur/logger";

/**
 * Portosaur Discovery-Based Schema Generator
 *
 * This command "discovers" the configuration schema by parsing the actual
 * Docusaurus config building logic. Every key accessed via the `get()` helper
 * is recorded and mapped to a JSON schema.
 */
export async function schemaCommand(options = {}) {
  // Resolve paths for the monorepo structure
  const pkgDir = path.resolve(import.meta.dirname, "../");
  const coreDir = path.resolve(pkgDir, "../../core");

  const SOURCE_FILE =
    typeof options.config === "string"
      ? path.resolve(process.cwd(), options.config)
      : path.resolve(coreDir, "src/index.mjs");

  const OUTPUT_FILE =
    typeof options.output === "string"
      ? path.resolve(process.cwd(), options.output)
      : path.resolve(pkgDir, "../../../configSchema.json");

  const discoveredSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Portosaur Project Configuration",
    type: "object",
    properties: {},
    required: [],
    additionalProperties: true,
  };

  // State for Balanced Parenthesis Walker
  const getStartRegex = /get\(\s*["']([^"']+)["']\s*,\s*/g;
  let match;

  try {
    if (!fs.existsSync(SOURCE_FILE)) {
      throw new Error(`Source file not found: ${SOURCE_FILE}`);
    }

    logger.info(`Discovering keys from ${SOURCE_FILE}...`);
    const sourceCode = fs.readFileSync(SOURCE_FILE, "utf8");

    // Discovery Loop
    while ((match = getStartRegex.exec(sourceCode)) !== null) {
      const keyPath = match[1];
      const startIdx = match.index + match[0].length;

      let braceCount = 1;
      let currentIdx = startIdx;
      let defaultValueRaw = "";
      let inString = null;
      let inComment = null;
      let escaped = false;

      // Extract raw default value using balanced parenthesis walker
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

        if (braceCount > 0) defaultValueRaw += char;
        currentIdx++;
      }

      // Extract Documentation Comments
      const beforeMatch = sourceCode.slice(0, match.index);
      const currentLineStart = beforeMatch.lastIndexOf("\n");
      const linesBefore = sourceCode
        .slice(0, currentLineStart === -1 ? 0 : currentLineStart)
        .split("\n");

      let i = linesBefore.length - 1;
      let foundComment = [];
      let inDocBlock = false;

      while (i >= 0 && foundComment.length < 15) {
        let line = linesBefore[i].trim();
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
          break;
        }
        i--;
      }
      const description = foundComment.join("\n").trim();

      // Basic Type Inference and Argument Parsing
      let type = "string";
      let defaultValue = undefined;

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
        val.includes(".slice(")
      ) {
        type = "array";
      } else if (val.startsWith("{")) {
        type = "object";
      } else if (val) {
        defaultValue = val.replace(/^["'`](.*)["'`]$/s, "$1").trim();
      }

      // Map to Discovered Schema Object
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
