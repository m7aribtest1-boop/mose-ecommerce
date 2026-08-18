const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = (() => {
      const t = [];
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
      }
      return t;
    })();
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, y * w * 4 + w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const INK = [28, 27, 25];
const GOLD = [185, 152, 90];

// apple-touch-icon.png 180x180 — gold disc on ink
{
  const W = 180, H = 180;
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - W / 2, dy = y - H / 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const c = d <= 54 ? GOLD : INK;
      const i = (y * W + x) * 4;
      buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
    }
  }
  fs.writeFileSync(path.join('public', 'apple-touch-icon.png'), encodePNG(W, H, buf));
  console.log('wrote public/apple-touch-icon.png');
}

// og-image.png 1200x630 — ink bg with gold disc (brand placeholder)
{
  const W = 1200, H = 630;
  const buf = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - W / 2, dy = y - H / 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const c = d <= 110 ? GOLD : INK;
      const i = (y * W + x) * 4;
      buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
    }
  }
  fs.writeFileSync(path.join('public', 'og-image.png'), encodePNG(W, H, buf));
  console.log('wrote public/og-image.png');
}

// manifest.json
const manifest = {
  name: 'موسى | MOSE',
  short_name: 'MOSE',
  description: 'متجر إلكتروني مغربي لبيع الجلابة والقفطان والتكشيطة بأسلوب عصري وجودة عالية.',
  start_url: '/',
  display: 'standalone',
  background_color: '#1c1b19',
  theme_color: '#1c1b19',
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
};
fs.writeFileSync(path.join('public', 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('wrote public/manifest.json');
