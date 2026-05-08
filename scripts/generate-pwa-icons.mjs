import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = join(root, 'assets/favicon.svg');
const out = [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
];

for (const [size, name] of out) {
  await sharp(svg).resize(size, size).png().toFile(join(root, 'assets', name));
}
