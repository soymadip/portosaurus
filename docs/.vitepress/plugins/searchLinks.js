/**
 * Search Links Plugin for Markdown-it
 *
 * Transforms search: protocol links into actual search URLs.
 * Supports spaces directly: [text](search:term with spaces)
 */

const DEFAULT_ENGINE = "brave";
const DEFAULT_ENGINES = {
  brave: "https://search.brave.com/search?q=",
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
};

function getSearchUrl(term, engine, engines) {
  const allEngines = { ...DEFAULT_ENGINES, ...engines };
  const actualEngine = engine || DEFAULT_ENGINE;
  const engineUrl = allEngines[actualEngine] || allEngines[DEFAULT_ENGINE];
  // Use + for spaces (simpler URL encoding that markdown-it accepts)
  const encodedTerm = term.trim().split(" ").join("+");
  return engineUrl + encodedTerm;
}

export function searchLinks(md, options = {}) {
  const config = {
    default: options.default || DEFAULT_ENGINE,
    engines: options.engines || {},
  };

  // Add custom inline rule to handle search: links
  md.inline.ruler.push("search_link", (state, silent) => {
    const pos = state.pos;
    const max = state.posMax;
    const src = state.src;

    // Must start with [ to be a potential link
    if (src[pos] !== "[") return false;

    // Find the closing ]
    let labelStart = pos + 1;
    let labelEnd = -1;
    let level = 1;
    for (let i = labelStart; i < max; i++) {
      if (src[i] === "[") level++;
      if (src[i] === "]") {
        level--;
        if (level === 0) {
          labelEnd = i;
          break;
        }
      }
    }

    // No closing bracket found
    if (labelEnd < 0) return false;

    // Must be followed by (search:
    if (labelEnd + 1 >= max || src[labelEnd + 1] !== "(") return false;
    if (!src.slice(labelEnd + 2).startsWith("search:")) return false;

    // Find the closing )
    let linkStart = labelEnd + 2;
    let linkEnd = -1;
    for (let i = linkStart + 7; i < max; i++) {
      // start after 'search:'
      if (src[i] === ")") {
        linkEnd = i;
        break;
      }
    }

    // No closing paren found
    if (linkEnd < 0) return false;

    // Extract the parts
    const linkText = src.slice(labelStart, labelEnd);
    const searchPart = src.slice(linkStart + 7, linkEnd); // skip 'search:'

    // Parse engine if present
    const engineMatch = searchPart.match(/^(.+?)(?:\?engine=(.+))?$/);
    const term = engineMatch[1].trim();
    const engine = engineMatch[2]?.trim() || config.default;

    // Get the actual search URL
    const searchUrl = getSearchUrl(term, engine, config.engines);

    if (!silent) {
      // Create link token
      const token = state.push("link_open", "a", 1);
      token.attrs = [["href", searchUrl]];
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noreferrer");

      // Create text token
      state.push("text", "", 0).content = linkText;

      // Create link close token
      state.push("link_close", "a", -1);
    }

    // Move cursor to after the closing paren
    state.pos = linkEnd + 1;
    return true;
  });
}
