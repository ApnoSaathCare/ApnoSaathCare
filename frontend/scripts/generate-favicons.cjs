const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const publicDir = path.resolve(__dirname, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

function renderSvg(width, height) {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: width,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// Build standard ICO file containing multiple PNG resolution entries
function buildIco(pngEntries) {
  const count = pngEntries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries = [];
  for (const { width, height, buffer } of pngEntries) {
    const entry = Buffer.alloc(16);
    entry[0] = width >= 256 ? 0 : width;
    entry[1] = height >= 256 ? 0 : height;
    entry[2] = 0; // color count
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngEntries.map(p => p.buffer)]);
}

console.log('Generating high-res favicons...');

const png16 = renderSvg(16, 16);
const png32 = renderSvg(32, 32);
const png48 = renderSvg(48, 48);
const png64 = renderSvg(64, 64);
const png180 = renderSvg(180, 180);
const png512 = renderSvg(512, 512);

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);

const icoBuffer = buildIco([
  { width: 16, height: 16, buffer: png16 },
  { width: 32, height: 32, buffer: png32 },
  { width: 48, height: 48, buffer: png48 },
  { width: 64, height: 64, buffer: png64 },
]);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

console.log('✅ Generated favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png');
