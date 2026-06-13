// scripts/gen-icons.mjs
// Gera ícones PNG do PWA a partir de public/icons/icon.svg.
// Sizes: 192, 512 (any), 512 (maskable com safe zone de 20%).
// Rode com: node scripts/gen-icons.mjs (precisa de `sharp` instalado em devDep).
import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ICONS_DIR = join(ROOT, "public", "icons");
const SVG_PATH = join(ICONS_DIR, "icon.svg");

mkdirSync(ICONS_DIR, { recursive: true });

const svg = readFileSync(SVG_PATH);

async function render(size, suffix, padding = 0) {
  const inner = Math.round(size * (1 - padding * 2));
  const offset = Math.round(size * padding);

  const composed = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0f172a — bate com theme_color
    },
  })
    .composite([
      {
        input: await sharp(svg).resize(inner, inner).png().toBuffer(),
        top: offset,
        left: offset,
      },
    ])
    .png()
    .toBuffer();

  const out = join(ICONS_DIR, `icon-${size}${suffix}.png`);
  writeFileSync(out, composed);
  console.log(`✓ ${out} (${composed.length} bytes)`);
}

await render(192, "");
await render(512, "");
// Maskable: 20% de safe zone para Android adaptive icons
await render(512, "-maskable", 0.2);

console.log("\nÍcones gerados. Lembre de atualizar manifest.json se ainda aponta para SVG.");
