import { existsSync, globSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";

/**
 * A Vite plugin that automatically redirects directory root requests
 * to their 'overview.html' counterparts if they exist.
 *
 * Example: /user/config -> /user/config/overview
 *
 * @param {Object} options
 * @param {string} options.srcDir - Path to the markdown source directory
 * @param {string} options.base - Site base path (from VitePress config)
 */
export function autoRedirects({ srcDir, base = "/" }) {
  const absoluteSrcDir = join(process.cwd(), srcDir);

  return {
    name: "vite-plugin-auto-redirects",

    // Dev Server Handling
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Only handle GET requests that don't have an extension (potential directory roots)
        if (req.method === "GET" && !req.url.includes(".")) {
          let urlPath = req.url.split("?")[0];

          if (urlPath === "/") {
            return next();
          }

          // Remove base if present for internal path calculation
          if (base !== "/" && urlPath.startsWith(base)) {
            urlPath = urlPath.slice(base.length - 1);
          }

          const localDir = join(absoluteSrcDir, urlPath);

          if (existsSync(localDir) && statSync(localDir).isDirectory()) {

            // Check for common entry points
            const entries = ["overview", "getting-started", "index"];

            for (const entry of entries) {
              const entryPath = join(localDir, `${entry}.md`);
              if (existsSync(entryPath)) {
                const redirectUrl = join(req.url, entry).replace(/\\/g, "/");
                console.log(`[Auto Redirect] ${req.url} -> ${redirectUrl}`);
                res.writeHead(302, { Location: redirectUrl });
                res.end();
                return;
              }
            }
          }
        }
        next();
      });
    },

    // Build Handling (Generating static redirect pages)
    // We use a virtual file approach to tell VitePress to generate an index.html
    // that contains a redirect script.
    resolveId(id) {
      if (id.endsWith("/index.md?auto-redirect")) {
        return id;
      }
    },

    load(id) {
      if (id.endsWith("/index.md?auto-redirect")) {
        const dirPath = id.replace("/index.md?auto-redirect", "");
        return `---
layout: page
---
<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  window.location.href = window.location.href.replace(/\\/?$/, '/overview.html')
})
</script>
`;
      }
    },
  };
}
