/**
 * The Portosaur Variable Resolver.
 * One function that handles both Markdown content and PageData (frontmatter).
 */
export function resolveVars(context, metadata) {
  // Core String Resolver Utility
  const resolve = (str) => {
    if (typeof str !== "string") {
      return str;
    }

    // Handle URL-encoded placeholders (e.g., %7B%7Bvar%7D%7D)
    // Markdown-it often encodes attributes before we get them
    str = str.replace(/%7B%7B/g, "{{").replace(/%7D%7D/g, "}}");

    // Handle escaped placeholders (e.g., \{{var}})
    // We replace them with zero-width space versions so they remain literal and Vue-safe
    str = str.replace(/\\{{/g, "{\u200B{").replace(/\\}}/g, "}\u200B}");

    // Handle {{compileYear}} / {{currentYear}}
    const year = new Date().getFullYear();
    str = str.replace(/{{compileYear}}/g, year);
    str = str.replace(/{{currentYear}}/g, year);

    // Handle {{compileDate}} / {{currentDate}}
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    str = str.replace(/{{compileDate}}/g, date);
    str = str.replace(/{{currentDate}}/g, date);

    // Handle {{portoVersion}}
    str = str.replace(/{{portoVersion}}/g, metadata.versions?.porto || "0.0.0");

    // Handle {{meta.*}}, {{custom.*}}, {{env.*}}
    str = str.replace(
      /{{\s*(meta|custom|env)[:.]([\w.]+)\s*}}/g,
      (match, type, path) => {
        if (type === "meta") {
          const parts = path.split(".");
          const value = parts.reduce((obj, key) => obj?.[key], metadata);
          if (value === undefined) {
            console.error(
              `\n\x1b[31m[ERROR] Invalid or missing variable: {{meta.${path}}}\x1b[0m\n`,
            );
            process.exit(1);
          }
          return value || "N/A";
        }
        // For custom and env, we just escape them for documentation purposes
        // as they are handled by the Portosaur core, not the docs site.
        return `{\u200B{${type}${type === "env" ? ":" : "."}${path}}\u200B}`;
      },
    );

    // Final pass: Escape any remaining {{ }} using a zero-width space to prevent Vue from swallowing them
    // This ensures that example placeholders like {{variable_name}} remain visible in the docs.
    return str.replace(/{{/g, "{\u200B{").replace(/}}/g, "}\u200B}");
  };

  // Recursive Object Resolver
  const resolveDeep = (obj) => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    for (const key in obj) {
      const val = obj[key];
      if (typeof val === "string") {
        obj[key] = resolve(val);
      } else if (Array.isArray(val)) {
        val.forEach((item, index) => {
          if (typeof item === "string") {
            val[index] = resolve(item);
          } else {
            resolveDeep(item);
          }
        });
      } else if (typeof val === "object") {
        resolveDeep(val);
      }
    }
  };

  // Detection Logic: Is this a Markdown-It instance or PageData?

  // Case A: Markdown-It Plugin
  if (context && context.core && context.core.ruler) {
    context.core.ruler.after("inline", "metadata_replace", (state) => {
      state.tokens.forEach((token) => {
        // Handle attributes (links, images, etc.)
        if (token.attrs) {
          token.attrs.forEach((attr) => {
            if (typeof attr[1] === "string") {
              attr[1] = resolve(attr[1]);
            }
          });
        }

        // Handle inline tokens (plain text and inline code)
        if (token.type === "inline") {
          token.children?.forEach((child) => {
            // Also handle attributes on children if any
            if (child.attrs) {
              child.attrs.forEach((attr) => {
                if (typeof attr[1] === "string") {
                  attr[1] = resolve(attr[1]);
                }
              });
            }

            if (child.type === "text" || child.type === "code_inline") {
              child.content = resolve(child.content);
            }
          });
        }
        // Handle code blocks
        if (token.type === "fence") {
          token.content = resolve(token.content);
        }
      });
    });
    return;
  }

  // Case B: VitePress PageData Hook
  if (context && context.relativePath) {
    context.frontmatter.meta = metadata;

    // Deeply resolve everything in the frontmatter
    resolveDeep(context.frontmatter);
    return;
  }
}
