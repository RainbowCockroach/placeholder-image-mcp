// Curated palette of easy-on-the-eyes colors
// Muted pastels and soft tones that work well as placeholder backgrounds
export const PALETTE = [
  "#A8D8EA", // soft sky blue
  "#AA96DA", // lavender
  "#FCBAD3", // soft pink
  "#FFFFD2", // cream yellow
  "#B5EAD7", // mint green
  "#E2F0CB", // light lime
  "#C7CEEA", // periwinkle
  "#FFB7B2", // salmon pink
  "#FFDAC1", // peach
  "#F0E6EF", // pale mauve
  "#95B8D1", // steel blue
  "#DDA0DD", // plum
  "#98D8C8", // seafoam
  "#F7DC6F", // soft gold
  "#AED6F1", // light cornflower
  "#D5AAFF", // soft violet
  "#85E3FF", // baby blue
  "#BAFFC9", // light mint
  "#FFE156", // warm yellow
  "#FF9AA2", // rose
  "#D4A5A5", // dusty rose
  "#A0CED9", // powder blue
  "#FFC75F", // mango
  "#C3B1E1", // wisteria
  "#B4F8C8", // spring green
  "#FFE5B4", // bisque
  "#E0BBE4", // thistle
  "#957DAD", // muted purple
  "#D291BC", // orchid pink
  "#FEC8D8", // blush
] as const;

/**
 * Parse a hex color string to RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Compute relative luminance per WCAG 2.0.
 * Returns a value between 0 (black) and 1 (white).
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Pick a high-contrast text color (black or white) for the given background.
 */
export function contrastTextColor(bgHex: string): string {
  return relativeLuminance(bgHex) > 0.4 ? "#222222" : "#FFFFFF";
}

/**
 * Pick a random color from the palette, optionally excluding certain colors.
 */
export function randomColor(exclude?: Set<string>): string {
  const available = exclude
    ? PALETTE.filter((c) => !exclude.has(c))
    : [...PALETTE];
  if (available.length === 0) {
    // All colors used — reset and allow duplicates
    return PALETTE[Math.floor(Math.random() * PALETTE.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}
