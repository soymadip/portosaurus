/**
 * remarkVarsPlugin.cjs
 *
 * Replaces {vars.key} references from config.yml's `vars` section inside MDX/MD content.
 * Throws a build-time error (crashes the MDX compiler for that file) if an unknown key is used,
 * so Docusaurus surfaces the bad key and the source file in the crash page.
 *
 * Supported locations:
 *   - Text nodes:       "Visit {vars.github} for more."
 *   - Inline code:      `{vars.twitter}`
 *   - Code blocks:      ```\ngit clone {vars.repo}\n```
 *   - Link URLs:        [GitHub]({vars.github})  or  [GitHub]({vars.github}/page)
 *   - Image URLs:       ![logo]({vars.logo})
 *
 * Escape (render the literal token without replacement):
 *   - Use double braces: {{vars.key}} → {vars.key}
 */

/** Minimal recursive AST walker (no external dep, matches remarkIcons pattern). */
function visit(tree, type, visitor) {
  function walk(node, index, parent) {
    if (node.type === type) {
      visitor(node, index, parent);
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        walk(node.children[i], i, node);
      }
    }
  }
  walk(tree, null, null);
}

/**
 * @param {Record<string, string>} vars - The resolved vars map from config.yml.
 * @returns {import('unified').Plugin}
 */
module.exports = function remarkVarsPlugin(vars = {}) {
  if (!vars || Object.keys(vars).length === 0) {
    // No vars defined — return a no-op plugin
    return () => (tree) => tree;
  }

  // Matches {vars.key} — the only supported syntax
  const bracePattern = /\{vars\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

  // Matches {{vars.key}} — escape form that renders as a literal {vars.key}
  const escapePattern = /\{\{vars\.([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

  /**
   * Throw a descriptive build error so Docusaurus crashes the page for this file.
   * The `filePath` comes from the vfile passed to the transformer.
   */
  function unknownKeyError(key, filePath) {
    return new Error(
      `[Portosaur] Unknown vars key "{vars.${key}}" in "${filePath || "unknown file"}".\n` +
        `  Make sure "${key}" is defined under 'vars:' in your config.yml.`,
    );
  }

  /**
   * Replace {vars.key} occurrences in a string, throwing on unknown keys.
   * Double-brace form {{vars.key}} is an escape — it renders as {vars.key} literally.
   * @param {string} str
   * @param {string} filePath - Source file path for error context.
   */
  function replaceBraces(str, filePath) {
    // Step 1: protect escaped {{vars.key}} by converting to a placeholder,
    //         so the single-brace replacer never sees them.
    const ESCAPE_PLACEHOLDER = "\x00VARS_LITERAL\x00";
    const escaped = str.replace(
      escapePattern,
      (_, key) => `${ESCAPE_PLACEHOLDER}${key}${ESCAPE_PLACEHOLDER}`,
    );

    // Step 2: replace {vars.key} — any remaining single-brace form is a real reference.
    const replaced = escaped.replace(bracePattern, (_, key) => {
      if (!Object.prototype.hasOwnProperty.call(vars, key)) {
        throw unknownKeyError(key, filePath);
      }
      return vars[key];
    });

    // Step 3: restore escaped tokens as literal {vars.key}
    return replaced.replace(
      new RegExp(
        `${ESCAPE_PLACEHOLDER}([a-zA-Z_][a-zA-Z0-9_]*)${ESCAPE_PLACEHOLDER}`,
        "g",
      ),
      (_, key) => `{vars.${key}}`,
    );
  }

  // The transformer receives (tree, file) — `file.path` is the source file path
  return () => (tree, file) => {
    const filePath = file?.path || file?.history?.[0] || "";

    // Text nodes: replace {vars.key} in plain text
    visit(tree, "text", (node) => {
      node.value = replaceBraces(node.value, filePath);
    });

    // Inline code: `{vars.key}`
    visit(tree, "inlineCode", (node) => {
      node.value = replaceBraces(node.value, filePath);
    });

    // Fenced code blocks
    visit(tree, "code", (node) => {
      node.value = replaceBraces(node.value, filePath);
    });

    // Links: [text]({vars.key}) or [text]({vars.key}/subpath)
    visit(tree, "link", (node) => {
      node.url = replaceBraces(node.url, filePath);
    });

    // Images: ![alt]({vars.key})
    visit(tree, "image", (node) => {
      node.url = replaceBraces(node.url, filePath);
    });
  };
};
