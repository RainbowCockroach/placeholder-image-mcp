# placeholder-image-mcp

Generates PNG placeholder images with colored background and text. Support batch generate.

## Installation

```bash
git clone https://github.com/RainbowCockroach/placeholder-image-mcp.git
cd placeholder-image-mcp
npm install
npm run build
```

Then register it as an MCP server in your agent's config (check the documentation in of your AI agent). Or just ask it to install this MCP for you. It's good at doing that.

## Usage

Once connected, just ask your agent to generate placeholder images. It will call the tool automatically.

**Examples:**

- "Create 64x64 image and save it to desktop"
- "Create three placeholder banners at 100x100 with text "frog", save to {some folder}"
- "Create 200x200 pink image, show its dimension"

Two calling modes:

### Individual images

Each image has its own size, text, color, and output path:

```json
{
  "images": [
    { "width": 800, "height": 600, "text": "ss", "path": "hero.png" },
    {
      "width": 400,
      "height": 300,
      "text": "Frog",
      "color": "#1a874f",
      "path": "frog.png"
    }
  ]
}
```

### Batch (same config, multiple files)

One config applied to multiple paths — each file gets a different random color:

```json
{
  "config": { "width": 600, "height": 400, "text": "Yayaya" },
  "paths": ["is-cucumber.png", "fruit.png", "or-veggie.png"]
}
```

## Parameters

| Parameter | Type   | Required | Description                                                                                                           |
| --------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `width`   | number | yes      | Width in pixels (1–8192)                                                                                              |
| `height`  | number | yes      | Height in pixels (1–8192)                                                                                             |
| `text`    | string | no       | Centered text. Use `"ss"` to show dimensions (e.g. `800×600`). Blank by default.                                      |
| `color`   | string | no       | Hex background color (e.g. `#A8D8EA`). Omit for random.                                                               |
| `path`    | string | yes      | Output path. Relative paths resolve against the `CLAUDE_CWD` env var if set, otherwise the process working directory. |

## Color palette

30 soft pastel colors chosen to look good as backgrounds:

```
#A8D8EA  #AA96DA  #FCBAD3  #FFFFD2  #B5EAD7  #E2F0CB  #C7CEEA
#FFB7B2  #FFDAC1  #F0E6EF  #95B8D1  #DDA0DD  #98D8C8  #F7DC6F
#AED6F1  #D5AAFF  #85E3FF  #BAFFC9  #FFE156  #FF9AA2  #D4A5A5
#A0CED9  #FFC75F  #C3B1E1  #B4F8C8  #FFE5B4  #E0BBE4  #957DAD
#D291BC  #FEC8D8
```

Text is automatically black or white based on WCAG 2.0 contrast ratio.
