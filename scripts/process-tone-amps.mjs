/**
 * Builds assets/tone-amps-wall.png: transparent surround + soft gray halos removed, 1024×576.
 * Uses assets/_tone-amps-import.png when present; otherwise Cursor assets matching SRC_FRAGMENT.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'assets', 'tone-amps-wall.png');
const CURSOR_PROJECT = path.join(
  process.env.USERPROFILE ?? '',
  '.cursor',
  'projects',
  'c-JOBS-WIZE-MICE-site-may-2026',
  'assets'
);
const SRC_FRAGMENT = 'amps-42c135f9';

/** True black surrounds */
const BLACK_MAX = 22;
/** Soft shadow / glow: dark, low‑chroma pixels */
const HALO_MAX = 60;
const CHROMA_CAP = 22;

function resolveSrc() {
  const localImport = path.join(ROOT, 'assets', '_tone-amps-import.png');
  if (fs.existsSync(localImport)) return localImport;
  if (!fs.existsSync(CURSOR_PROJECT)) throw new Error('Cursor assets not found: ' + CURSOR_PROJECT);
  const hit = fs.readdirSync(CURSOR_PROJECT).find((n) => n.includes(SRC_FRAGMENT));
  if (!hit) throw new Error('No file matching ' + SRC_FRAGMENT + ' in ' + CURSOR_PROJECT);
  return path.join(CURSOR_PROJECT, hit);
}

function knockoutBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const chroma = mx - mn;
    if (mx <= BLACK_MAX) data[i + 3] = 0;
    else if (mx <= HALO_MAX && chroma <= CHROMA_CAP) data[i + 3] = 0;
  }
}

const input = resolveSrc();
const meta = await sharp(input).rotate().metadata();

let pipeline = sharp(input).rotate();
if (meta.width !== 1024 || meta.height !== 576) {
  pipeline = pipeline.resize(1024, 576, { fit: 'cover', position: 'centre' });
}

const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
knockoutBackground(data, info.channels);
await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(OUT_PATH);

console.warn('OK', path.basename(OUT_PATH), '<-', path.basename(input));
