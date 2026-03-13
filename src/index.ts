#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateImages, ImageConfig } from "./generate.js";

const ImageConfigSchema = z.object({
  width: z.number().int().min(1).max(8192).describe("Image width in pixels"),
  height: z.number().int().min(1).max(8192).describe("Image height in pixels"),
  text: z
    .string()
    .optional()
    .describe(
      'Text to display centered on image. Use "_s" to show dimensions (e.g. "800×600"). Omit or "" for blank.'
    ),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .describe(
      "Background color as hex (e.g. #A8D8EA). Omit for random from curated palette."
    ),
  path: z.string().describe("Output file path for the PNG"),
});

const server = new McpServer({
  name: "placeholder-image",
  version: "1.0.0",
});

server.tool(
  "generate_placeholder",
  "Generate one or more placeholder PNG images with colored backgrounds and optional centered text. Supports two modes: (1) provide an array of individual image configs, or (2) provide a single config template with multiple output paths to generate batch images with different random colors.",
  {
    images: z
      .array(ImageConfigSchema)
      .optional()
      .describe(
        "Array of image configurations. Each gets its own size, text, color, and output path."
      ),
    config: z
      .object({
        width: z
          .number()
          .int()
          .min(1)
          .max(8192)
          .describe("Image width in pixels"),
        height: z
          .number()
          .int()
          .min(1)
          .max(8192)
          .describe("Image height in pixels"),
        text: z
          .string()
          .optional()
          .describe(
            'Text to display centered on image. Use "_s" to show dimensions. Omit or "" for blank.'
          ),
        color: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .optional()
          .describe(
            "Background color as hex. Omit for random (each image gets a different color)."
          ),
      })
      .optional()
      .describe(
        "Single config template for batch mode. Use with `paths` to generate multiple images."
      ),
    paths: z
      .array(z.string())
      .optional()
      .describe(
        "Output file paths for batch mode. Each path produces one image with a different random color."
      ),
  },
  async (params) => {
    try {
      // Validate: must provide either `images` or `config` + `paths`
      if (params.images && params.images.length > 0) {
        const results = await generateImages({
          images: params.images as ImageConfig[],
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Generated ${results.length} image(s):\n${results
                .map(
                  (r) => `  - ${r.path} (${r.width}x${r.height}, ${r.color})`
                )
                .join("\n")}`,
            },
          ],
        };
      }

      if (params.config && params.paths && params.paths.length > 0) {
        const results = await generateImages({
          config: params.config,
          paths: params.paths,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Generated ${results.length} image(s):\n${results
                .map(
                  (r) => `  - ${r.path} (${r.width}x${r.height}, ${r.color})`
                )
                .join("\n")}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: 'Error: Provide either `images` (array of configs) or `config` + `paths` (batch mode).',
          },
        ],
        isError: true,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error generating images: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
