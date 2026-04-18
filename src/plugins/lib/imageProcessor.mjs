import fs from "fs";
import path from "path";
import sharp from "sharp";
import { logger } from "../../utils/logger.mjs";

/**
 * Reshapes an image into a circle or square with rounded corners.
 */
export async function reshapeImage(inputPath, outputPath, shape = "circle") {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Could not extract image metadata (width/height)");
    }

    const size = Math.min(metadata.width, metadata.height);

    // Center crop to a square
    let pipeline = image.extract({
      left: Math.floor((metadata.width - size) / 2),
      top: Math.floor((metadata.height - size) / 2),
      width: size,
      height: size,
    });

    if (shape === "circle") {
      // Create circular mask
      const radius = size / 2;
      const circleSvg = Buffer.from(
        `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`,
      );

      pipeline = pipeline.composite([{ input: circleSvg, blend: "dest-in" }]);
    }

    await pipeline.png().toFile(outputPath);
    return outputPath;
  } catch (err) {
    logger.error(`Image processing failed: ${err.message}`);
    throw err;
  }
}
