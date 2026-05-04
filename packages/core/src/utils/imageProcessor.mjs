import fs from "fs";
import path from "path";
import sharp from "sharp";
import { logger } from "@portosaur/logger";

//  Image Processing Pipeline
export async function reshapeImage(inputPath, outputPath, shape = "circle") {
  try {
    // Validate input file
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Create output directory
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Load and analyze image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Could not extract image metadata (width/height)");
    }

    // Extract and crop to square
    const size = Math.min(metadata.width, metadata.height);

    let pipeline = image.extract({
      left: Math.floor((metadata.width - size) / 2),
      top: Math.floor((metadata.height - size) / 2),
      width: size,
      height: size,
    });

    if (shape === "circle") {
      const radius = size / 2;
      const circleSvg = Buffer.from(
        `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" /></svg>`,
      );

      pipeline = pipeline.composite([{ input: circleSvg, blend: "dest-in" }]);
    }

    // Write output file
    await pipeline.png().toFile(outputPath);
    return outputPath;
  } catch (err) {
    logger.error(`Image processing failed: ${err.message}`);
    throw err;
  }
}
