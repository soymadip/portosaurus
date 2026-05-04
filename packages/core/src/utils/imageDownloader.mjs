import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import crypto from "crypto";
import { logger } from "@portosaur/logger";

//  Cache & Utilities
function getCacheKey(url) {
  return crypto.createHash("md5").update(url).digest("hex");
}

//  Main Download Function
export async function downloadImage(url, destDir, fileName, options = {}) {
  const {
    proxies = [],
    redirectCount = 0,
    cacheDir,
    cacheTTL = 43200000,
  } = options;

  if (redirectCount > 5) {
    throw new Error("Too many redirects");
  }

  // Create destination directory and resolve paths
  const destPath = path.join(destDir, fileName);

  fs.mkdirSync(destDir, { recursive: true });

  // Check cache first
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

  // Download the image with HTTP protocol
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        // Handle redirects
        if (
          response.statusCode &&
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

        // Validate HTTP status
        if (response.statusCode !== 200) {
          tryProxyFallback(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        // Validate content type
        const contentType = response.headers["content-type"] || "";

        if (!contentType.startsWith("image/") && !url.includes("raw=true")) {
          logger.warn(`Expected image but got ${contentType} from ${url}`);
          tryProxyFallback(new Error(`Invalid content type: ${contentType}`));
          return;
        }

        // Write file to disk
        const file = fs.createWriteStream(destPath);
        response.pipe(file);

        file.on("finish", () => {
          file.close((err) => {
            if (err) {
              reject(err);
              return;
            }

            // Cache the downloaded image
            if (cacheDir) {
              try {
                const cacheKey = getCacheKey(url);
                const cachedPath = path.join(
                  cacheDir,
                  `${cacheKey}-${fileName}`,
                );
                fs.mkdirSync(cacheDir, { recursive: true });
                fs.copyFileSync(destPath, cachedPath);
              } catch {}
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

    // Handle proxy fallback when download fails
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
