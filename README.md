# Placeholder Image MCP Server

Generate PNG placeholder images with random colors, optional centered text, and smart contrast for readable text.

## Features

- 🎨 **30-color curated palette** — muted pastels easy on the eyes
- 📝 **Text support** — centered text, `_s` for dimensions, or blank
- 🌈 **Smart contrast** — automatically picks black or white text based on background luminance (WCAG 2.0)
- 🔄 **Batch generation** — generate multiple images in one call with different random colors
- 📍 **Relative paths** — save to your project directory without absolute paths

## Usage

Call the `generate_placeholder` tool with one of two modes:

### Mode 1: Array of images

```json
{
  "images": [
    {
      "width": 800,
      "height": 600,
      "text": "_s",
      "path": "placeholder1.png"
    },
    {
      "width": 400,
      "height": 300,
      "text": "Hello",
      "color": "#A8D8EA",
      "path": "images/placeholder2.png"
    }
  ]
}
```

### Mode 2: Batch (one config, multiple paths)

```json
{
  "config": {
    "width": 600,
    "height": 400,
    "text": "My App"
  },
  "paths": [
    "banner-light.png",
    "banner-dark.png",
    "banner-accent.png"
  ]
}
```

Each path in batch mode gets a different random color.

## Parameters

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| `width` | number | required | 1–8192 pixels |
| `height` | number | required | 1–8192 pixels |
| `text` | string | `""` | Text to center. Use `"_s"` for dimensions (e.g., "800×600") |
| `color` | string | random | Hex color (e.g., `#A8D8EA`). Omit for random from palette |
| `path` | string | required | File path. Relative paths resolve to Claude Code's open directory |

## Path Resolution

- **Relative paths** (e.g., `placeholder.png`, `images/hero.png`) → resolved to Claude Code's current working directory
- **Absolute paths** (e.g., `/tmp/image.png`) → used as-is

When Claude Code opens a directory, the MCP saves relative paths there automatically—no need for absolute paths.

## Color Palette

Soft, muted colors that look good as backgrounds:

```
#A8D8EA  #AA96DA  #FCBAD3  #FFFFD2  #B5EAD7  #E2F0CB  #C7CEEA
#FFB7B2  #FFDAC1  #F0E6EF  #95B8D1  #DDA0DD  #98D8C8  #F7DC6F
#AED6F1  #D5AAFF  #85E3FF  #BAFFC9  #FFE156  #FF9AA2  #D4A5A5
#A0CED9  #FFC75F  #C3B1E1  #B4F8C8  #FFE5B4  #E0BBE4  #957DAD
#D291BC  #FEC8D8
```

## Building

```bash
npm install
npm run build
npm start
```

## Implementation

- **SVG + Sharp** — no native dependencies, lightweight and fast
- **WCAG 2.0 contrast** — text color automatically chosen for accessibility
- **TypeScript** — fully typed with Zod validation

## Environment Variables

- `CLAUDE_CWD` — override the base directory for relative paths (optional; Claude Code usually handles this)