/**
 * Center-crops source PNGs to 4:3, exports 800×600 PNGs with RGBA transparency.
 * Original art uses solid black #000 surrounds; pixels with max(R,G,B) ≤ BLACK_MAX → alpha 0.
 * Run: npm install (in scripts/) then node process-feature-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUT_W = 800;
const OUT_H = 600;
/** Pixels with max(R,G,B) ≤ this become fully transparent (sources use solid black #000 backgrounds). */
const BLACK_MAX = 22;
const ROOT = path.resolve(__dirname, '..');
const OUT_ASSETS = path.join(ROOT, 'assets');

const CURSOR_PROJECT =
  path.join(process.env.USERPROFILE ?? '', '.cursor', 'projects', 'c-JOBS-WIZE-MICE-site-may-2026', 'assets');
const LOCAL_IMPORTS = path.join(ROOT, 'assets', '_feature-imports');

/** High processing power card: fragment `processor-fa40e228` → `../assets/feat-selling-pcb.png` */
function resolveSrc(fragment) {
  const preferred = `${fragment}.png`;
  const dirs = [LOCAL_IMPORTS, CURSOR_PROJECT].filter((d) => fs.existsSync(d));

  if (!dirs.length)
    throw new Error('No import folders found. Create ' + LOCAL_IMPORTS + ' or ' + CURSOR_PROJECT);

  for (const dir of dirs) {
    const names = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith('.png'));
    const exact = names.find((n) => n === preferred);
    const hit =
      exact ??
      names
        .slice()
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        .find((n) => n.includes(fragment));
    if (hit) return path.join(dir, hit);
  }

  throw new Error(
    'No PNG matching "' + fragment + '" in ' + dirs.join(' or ') + ' (e.g. name it ' + preferred + ')'
  );
}

function cropAspect43(meta) {
  const w = meta.width;
  const h = meta.height;
  const ar = w / h;
  const target = 4 / 3;
  if (Math.abs(ar - target) < 1e-4)
    return { left: 0, top: 0, width: w, height: h };
  if (ar > target) {
    const cw = Math.round(h * target);
    return { left: Math.round((w - cw) / 2), top: 0, width: cw, height: h };
  }
  const ch = Math.round(w / target);
  return { left: 0, top: Math.round((h - ch) / 2), width: w, height: ch };
}

async function applyTransparentBlack(rgbPipeline) {
  const { data, info } = await rgbPipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const t = BLACK_MAX;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (Math.max(r, g, b) <= t) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 });
}

async function processPair(fragment, filename) {
  const input = resolveSrc(fragment);
  const meta = await sharp(input).rotate().metadata();
  const ex = cropAspect43(meta);
  const resized = sharp(input).rotate().extract(ex).resize(OUT_W, OUT_H, { fit: 'fill' });
  const out = await applyTransparentBlack(resized);
  await out.toFile(path.join(OUT_ASSETS, filename));
  console.warn('OK', filename, '<-', path.basename(input));
}

await processPair('rat_meteor_ride', 'feat-selling-plugins.png');
await processPair('instruments_outline', 'feat-selling-instruments.png');
await processPair('processor-fa40e228', 'feat-selling-pcb.png');
