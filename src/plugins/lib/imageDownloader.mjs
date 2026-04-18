import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import crypto from "crypto";
import { logger } from "../../utils/logger.mjs";

/**
 * Generates a short hash from a URL for use as a cache key.
 */
function getCacheKey(url) {
  return crypto.createHash("md5").update(url).digest("hex");
}

/**
 * Downloads an image from a URL and saves it to a local file.
 * Handles redirects (up to 5 levels), falls back to proxies if needed,
 * and supports URL-hash-based caching to avoid redundant downloads.
 *
 * @param {string} url       - The URL to download from.
 * @param {string} destDir   - Directory to save the downloaded file.
 * @param {string} fileName  - Name for the downloaded file.
 * @param {Object} options   - Additional options.
 * @param {string[]} options.proxies       - List of CORS proxy URLs.
 * @param {number}   options.redirectCount - Internal redirect counter.
 * @param {string}   options.cacheDir      - Directory for caching downloads.
 * @param {number}   options.cacheTTL      - Cache time-to-live in ms (default: 24h).
 */
export async function downloadImage(url, destDir, fileName, options = {}) {
  const {
    proxies = [],
    redirectCount = 0,
    cacheDir,
    cacheTTL = 43200000, // 6 hours
  } = options;

  if (redirectCount > 5) {
    throw new Error("Too many redirects");
  }

  const destPath = path.join(destDir, fileName);
  fs.mkdirSync(destDir, { recursive: true });

  // ─── Cache Check ───────────────────────────────────────────
  const forceDownload = process.env.PORTO_FORCE_DOWNLOAD === "1";

  if (cacheDir && !forceDownload) {
    const cacheKey = getCacheKey(url);
    const cachedPath = path.join(cacheDir, `${cacheKey}-${fileName}`);

    if (fs.existsSync(cachedPath)) {
      const stats = fs.statSync(cachedPath);
      const age = Date.now() - stats.mtimeMs;

      if (age < cacheTTL) {
        logger.info(`Using cached image (${Math.round(age / 60000)}m old)`);
        fs.copyFileSync(cachedPath, destPath);
        return destPath;
      }
    }
  }

  // ─── Download ──────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        // Handle redirects
        if (
          [301, 302, 303, 307, 308].includes(response.statusCode) &&
          response.headers.location
        ) {
          const redirectUrl = new URL(
            response.headers.location,
            url,
          ).toString();
          logger.info(
            `Following redirect (${response.statusCode}) to: ${redirectUrl}`,
          );
          resolve(
            downloadImage(redirectUrl, destDir, fileName, {
              ...options,
              redirectCount: redirectCount + 1,
            }),
          );
          return;
        }

        // Handle errors and non-image content
        if (response.statusCode !== 200) {
          tryProxyFallback();
          return;
        }

        const contentType = response.headers["content-type"] || "";
        if (!contentType.startsWith("image/") && !url.includes("raw=true")) {
          logger.warn(`Expected image but got ${contentType} from ${url}`);
          tryProxyFallback();
          return;
        }

        const file = fs.createWriteStream(destPath);
        response.pipe(file);

        file.on("finish", () => {
          file.close((err) => {
            if (err) {
              reject(err);
              return;
            }

            // Write to cache after successful download
            if (cacheDir) {
              try {
                const cacheKey = getCacheKey(url);
                const cachedPath = path.join(
                  cacheDir,
                  `${cacheKey}-${fileName}`,
                );
                fs.mkdirSync(cacheDir, { recursive: true });
                fs.copyFileSync(destPath, cachedPath);
              } catch {
                // Cache write failure is non-fatal
              }
            }

            resolve(destPath);
          });
        });

        file.on("error", (err) => {
          fs.unlink(destPath, () => reject(err));
        });
      })
      .on("error", (err) => {
        tryProxyFallback(err);
      });

    function tryProxyFallback(originalError) {
      if (proxies.length > 0) {
        const nextProxy = proxies[0];
        const remainingProxies = proxies.slice(1);
        const proxyUrl = `${nextProxy}${encodeURIComponent(url)}`;
        logger.info(
          `Download failed or invalid content. Retrying via proxy: ${nextProxy}`,
        );
        resolve(
          downloadImage(proxyUrl, destDir, fileName, {
            ...options,
            proxies: remainingProxies,
          }),
        );
      } else {
        reject(originalError || new Error(`Failed to download image: ${url}`));
      }
    }
  });
}
