import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { favicons } from "favicons";
import { downloadImage } from "./lib/imageDownloader.mjs";
import { reshapeImage } from "./lib/imageProcessor.mjs";
import { getCssVar } from "./lib/cssUtils.mjs";
import { extractSvg } from "./lib/iconExtractor.mjs";
import { logger } from "../utils/logger.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

function cleanupFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (e) {
      // Ignore cleanup errors
    }
  }
  return false;
}

function processManifest(manifestFile, outputDir, appVersion) {
  try {
    const manifest = JSON.parse(manifestFile.contents);
    manifest.version = appVersion;

    fs.writeFileSync(
      path.join(outputDir, manifestFile.name),
      JSON.stringify(manifest, null, 2),
    );
    return true;
  } catch (err) {
    logger.error(`Failed to process manifest: ${err.message}`);
    fs.writeFileSync(
      path.join(outputDir, manifestFile.name),
      manifestFile.contents,
    );
    return false;
  }
}

export async function generateFavicons(context, options = {}) {
  logger.info("Generating favicons...");

  const { siteConfig } = context;
  const profilePicUrl =
    options.imagePath || siteConfig.customFields.heroSection.profilePic;
  const appVersion = siteConfig.customFields.version || "1.0";
  const circular = options.circular !== false;
  const shape = options.shape || "circle";
  const proxies = siteConfig.customFields.corsProxyList || [];

  const staticBaseDir = path.resolve(context.siteDir, "static");
  const imgDir = path.join(staticBaseDir, "img", "svg");
  const outputDir = path.join(
    context.siteDir,
    ".docusaurus/portosaurus",
    options.outputPath || "favicon",
  );

  // --- Smart Caching ---
  const configHash = Buffer.from(
    JSON.stringify({
      profilePicUrl,
      shape,
      circular,
      outputPath: options.outputPath,
    }),
  ).toString("base64");

  const hashFilePath = path.join(outputDir, ".favicon.hash");

  if (fs.existsSync(hashFilePath)) {
    const existingHash = fs.readFileSync(hashFilePath, "utf-8");

    if (existingHash === configHash) {
      // Check if critical files actually exist
      if (fs.existsSync(path.join(outputDir, "favicon.ico"))) {
        logger.success("Favicons are up to date, skipping generation.");
        return true;
      }
    }
  }
  // ---------------------

  // Use a consolidated cache directory inside .docusaurus
  const cacheDir = path.join(
    context.siteDir,
    ".docusaurus",
    "portosaurus",
    "cache",
  );
  createDirectoryIfNotExists(cacheDir);

  const reshapedImagePath = path.join(cacheDir, "profile_pic_reshaped.png");

  const tempFiles = [];

  try {
    const iconColor = { color: getCssVar("--ifm-color-primary") };
    const iconsToGenerate = ["note", "blog"];

    for (const icon of iconsToGenerate) {
      await extractSvg(icon, imgDir, iconColor);
    }

    const configuration = {
      path: `/${options.outputPath || "favicon"}/`,
      appName: siteConfig.title || "Portfolio",
      appDescription: siteConfig.tagline || "Portfolio",
      background: getCssVar("--ifm-background-color"),
      theme_color: getCssVar("--ifm-color-primary"),
      appleStatusBarStyle: "black-translucent",
      display: "standalone",
      scope: "/",
      start_url: "/",
      version: appVersion,
      orientation: "natural",
      logging: false,
      loadManifestWithCredentials: true,
      manifestMaskable: true,
      icons: {
        android: {
          offset: 0,
          background: false,
          mask: true,
          overlayGlow: false,
          androidPlayStore: true,
        },
        favicons: true,
        appleIcon: true,
        appleStartup: false,
        windows: false,
        yandex: false,
      },
    };

    // 1. Resolve image source (Remote URL vs Local Path)
    let downloadedRes;
    const isRemote = /^https?:\/\//.test(profilePicUrl);

    if (isRemote) {
      // Download remote image with proxy support + caching
      downloadedRes = await downloadImage(
        profilePicUrl,
        cacheDir,
        "profile_pic_src.png",
        { proxies, cacheDir: path.join(cacheDir, "downloads") },
      );
      tempFiles.push(downloadedRes);
    } else {
      // Handle local path
      let localPath = null;
      // Static directories are provided in siteConfig or we check common ones
      const staticDirs = siteConfig.staticDirectories || ["static"];

      for (const sDir of staticDirs) {
        const fullPath = path.resolve(context.siteDir, sDir, profilePicUrl);
        if (fs.existsSync(fullPath)) {
          localPath = fullPath;
          break;
        }
      }

      if (!localPath) {
        // Fallback: check Porto asset dir if not found in user static
        const portoAssetDir = path.resolve(__dirname, "../../assets");
        const portoPath = path.resolve(portoAssetDir, profilePicUrl);
        if (fs.existsSync(portoPath)) {
          localPath = portoPath;
        }
      }

      if (!localPath) {
        throw new Error(`Local profile picture not found: ${profilePicUrl}`);
      }
      downloadedRes = localPath;
    }

    // 2. Reshape if needed
    let finalImagePath = downloadedRes;
    if (circular) {
      finalImagePath = await reshapeImage(
        downloadedRes,
        reshapedImagePath,
        shape,
      );
      // Only cleanup if it's a generated temp file, not the original local source
      if (finalImagePath !== downloadedRes) {
        tempFiles.push(finalImagePath);
      }
    }

    createDirectoryIfNotExists(outputDir);

    logger.info(`Generating favicon assets from ${finalImagePath}`);
    const response = await favicons(finalImagePath, configuration);

    let imageCount = 0,
      fileCount = 0;

    if (Array.isArray(response.images)) {
      for (const image of response.images) {
        fs.writeFileSync(path.join(outputDir, image.name), image.contents);
        imageCount++;
      }
    }

    if (Array.isArray(response.files)) {
      for (const file of response.files) {
        if (file.name.includes("manifest")) {
          processManifest(file, outputDir, appVersion);
        } else {
          fs.writeFileSync(path.join(outputDir, file.name), file.contents);
        }
        fileCount++;
      }
    }

    logger.success(
      `Generated ${imageCount} favicon images and ${fileCount} support files`,
    );

    // Write the hash file to enable smart caching next time
    fs.writeFileSync(hashFilePath, configHash, "utf-8");

    // Cleanup temporary files
    tempFiles.forEach(cleanupFile);
    return {
      success: true,
      html: response.html || [],
    };
  } catch (error) {
    logger.warn(`Favicon generation skipped: ${error.message}`);
    tempFiles.forEach(cleanupFile);
    // Don't throw - allow the build to continue
    return {
      success: false,
      html: [],
    };
  }
}

export default function (context, options = {}) {
  const {
    imagePath = null,
    outputPath = "favicon",
    circular = true,
    shape = "circle",
    generateOnDev = true,
  } = options;

  let generatedTags = [];

  return {
    name: "favicon-generator",

    async loadContent() {
      const shouldGenerate =
        process.env.NODE_ENV === "production" ||
        process.env.GENERATE_FAVICONS ||
        generateOnDev;

      if (shouldGenerate) {
        // Non-fatal execution
        const result = await generateFavicons(context, {
          imagePath,
          outputPath,
          circular,
          shape,
        });
        if (result.success) {
          generatedTags = result.html;
        }
      }
    },

    injectHtmlTags() {
      if (generatedTags.length > 0) {
        return {
          headTags: generatedTags.map((tag) => {
            // Convert string tags to Docusaurus headTags objects if needed
            // Actually Docusaurus supports returning a string or objects
            // The simplest is to return the strings as raw HTML if possible
            // But injectHtmlTags expects objects or strings
            return tag;
          }),
        };
      }
      return {};
    },
  };
}
