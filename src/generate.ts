import sharp from "sharp";
import path from "path";
import fs from "fs";
import { contrastTextColor, randomColor } from "./colors.js";

export interface ImageConfig {
  width: number;
  height: number;
  text?: string; // "" = blank, "ss" = show size, else literal text
  color?: string; // hex color, or omit for random
  path: string; // output file path (relative or absolute)
}

/**
 * Resolve a file path relative to the Claude Code project directory.
 * - If the path is absolute, use it as-is
 * - If relative, resolve it relative to CLAUDE_CWD env var (if set) or process.cwd()
 */
function resolvePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  // Use CLAUDE_CWD if set (for multi-folder workspaces or future enhancements)
  // Otherwise use process.cwd()
  const baseDir = process.env.CLAUDE_CWD || process.cwd();
  return path.resolve(baseDir, filePath);
}

/**
 * Escape special XML characters for safe SVG embedding.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build an SVG string for the placeholder image.
 */
function buildSvg(
  width: number,
  height: number,
  bgColor: string,
  text: string,
): string {
  const textColor = contrastTextColor(bgColor);

  // Scale font size relative to image dimensions
  const minDim = Math.min(width, height);
  let fontSize = Math.max(12, Math.floor(minDim / 8));

  // For long text, shrink font to fit within ~80% of width
  if (text.length > 0) {
    const maxTextWidth = width * 0.8;
    const estimatedCharWidth = fontSize * 0.6;
    const estimatedTextWidth = text.length * estimatedCharWidth;
    if (estimatedTextWidth > maxTextWidth) {
      fontSize = Math.max(10, Math.floor(maxTextWidth / (text.length * 0.6)));
    }
  }

  let textElement = "";
  if (text.length > 0) {
    textElement = `
    <text
      x="50%" y="50%"
      dominant-baseline="central"
      text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${fontSize}"
      font-weight="600"
      fill="${textColor}"
    >${escapeXml(text)}</text>`;
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${textElement}
</svg>`;
}

/**
 * Generate a single placeholder image and save it to disk.
 */
export async function generateImage(
  config: ImageConfig,
  assignedColor?: string,
): Promise<{ path: string; color: string; width: number; height: number }> {
  const bgColor = config.color || assignedColor || randomColor();

  // Resolve text
  let displayText = "";
  if (config.text === "ss") {
    displayText = `${config.width}\u00D7${config.height}`;
  } else if (config.text !== undefined && config.text !== "") {
    displayText = config.text;
  }

  const svg = buildSvg(config.width, config.height, bgColor, displayText);

  // Ensure output directory exists
  const outputPath = resolvePath(config.path);
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });

  await sharp(Buffer.from(svg)).png().toFile(outputPath);

  return {
    path: outputPath,
    color: bgColor,
    width: config.width,
    height: config.height,
  };
}

/**
 * Generate multiple placeholder images.
 * - If `images` is provided: each entry is a full config.
 * - If `config` + `count` + `paths` is provided: generate `count` images
 *   from one config template, each with a different random color.
 */
export async function generateImages(
  params:
    | { images: ImageConfig[] }
    | { config: Omit<ImageConfig, "path">; paths: string[] },
): Promise<{ path: string; color: string; width: number; height: number }[]> {
  const usedColors = new Set<string>();

  if ("images" in params) {
    const results = await Promise.all(
      params.images.map((img) => {
        const color = img.color || randomColor(usedColors);
        usedColors.add(color);
        return generateImage(img, color);
      }),
    );
    return results;
  }

  // Batch mode: one config, multiple paths
  const { config, paths } = params;
  const results = await Promise.all(
    paths.map((p) => {
      const color = config.color || randomColor(usedColors);
      usedColors.add(color);
      return generateImage({ ...config, path: p }, color);
    }),
  );
  return results;
}
