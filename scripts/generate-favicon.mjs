import sharp from 'sharp';
import fs from 'fs';

const CORAL = '#F15A29';
const YELLOW = '#F5C518';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <circle cx="64" cy="64" r="42" stroke="${CORAL}" stroke-width="18" />
  <path d="M42 68 L58 84 L92 42" stroke="${YELLOW}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const markPng = await sharp(Buffer.from(svg))
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp(markPng).toFile('public/images/favicon-source.png');
await sharp(markPng).png().toFile('src/app/icon.png');
// Apple touch icons read better on a solid brand-dark tile
await sharp(markPng)
  .flatten({ background: '#0f172a' })
  .resize(180, 180)
  .png()
  .toFile('src/app/apple-icon.png');

function pngToIco(pngBuffers) {
  const count = pngBuffers.length;
  let offset = 6 + 16 * count;
  const entries = [];
  for (const png of pngBuffers) {
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);
    entries.push({
      width: w >= 256 ? 0 : w,
      height: h >= 256 ? 0 : h,
      size: png.length,
      offset,
      png,
    });
    offset += png.length;
  }
  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);
  let entryOffset = 6;
  for (const e of entries) {
    buf.writeUInt8(e.width, entryOffset);
    buf.writeUInt8(e.height, entryOffset + 1);
    buf.writeUInt8(0, entryOffset + 2);
    buf.writeUInt8(0, entryOffset + 3);
    buf.writeUInt16LE(1, entryOffset + 4);
    buf.writeUInt16LE(32, entryOffset + 6);
    buf.writeUInt32LE(e.size, entryOffset + 8);
    buf.writeUInt32LE(e.offset, entryOffset + 12);
    entryOffset += 16;
  }
  for (const e of entries) e.png.copy(buf, e.offset);
  return buf;
}

const pngs = [];
for (const s of [16, 32, 48]) {
  pngs.push(await sharp(markPng).resize(s, s).png().toBuffer());
}
fs.writeFileSync('src/app/favicon.ico', pngToIco(pngs));
console.log('favicon ready');
