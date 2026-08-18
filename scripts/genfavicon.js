const fs = require('fs');
const S = 32;
const buf = Buffer.alloc(22 + 40 + S * S * 4);
let o = 0;
// ICONDIR
buf.writeUInt16LE(0, o); o += 2;
buf.writeUInt16LE(1, o); o += 2;
buf.writeUInt16LE(1, o); o += 2;
// ICONDIRENTRY
buf[o++] = S; buf[o++] = S; buf[o++] = 0; buf[o++] = 0;
buf.writeUInt16LE(1, o); o += 2;
buf.writeUInt16LE(32, o); o += 2;
buf.writeUInt32LE(40 + S * S * 4, o); o += 4;
buf.writeUInt32LE(22, o); o += 4;
// BITMAPINFOHEADER
buf.writeUInt32LE(40, o); o += 4;
buf.writeInt32LE(S, o); o += 4;
buf.writeInt32LE(S * 2, o); o += 4;
buf.writeUInt16LE(1, o); o += 2;
buf.writeUInt16LE(32, o); o += 2;
buf.writeUInt32LE(0, o); o += 4;
buf.writeUInt32LE(S * S * 4, o); o += 4;
buf.writeInt32LE(0, o); o += 4;
buf.writeInt32LE(0, o); o += 4;
buf.writeUInt32LE(0, o); o += 4;
buf.writeUInt32LE(0, o); o += 4;
function px(r, g, b) { return [b, g, r, 255]; }
const ink = px(28, 27, 25);
const gold = px(185, 152, 90);
for (let y = S - 1; y >= 0; y--) {
  for (let x = 0; x < S; x++) {
    const dx = x - (S / 2 - 0.5);
    const dy = y - (S / 2 - 0.5);
    const d = Math.sqrt(dx * dx + dy * dy);
    const c = d <= 12 ? gold : ink;
    buf[o++] = c[0]; buf[o++] = c[1]; buf[o++] = c[2]; buf[o++] = c[3];
  }
}
fs.writeFileSync('public/favicon.ico', buf.slice(0, 22 + 40 + S * S * 4));
console.log('wrote public/favicon.ico bytes=', buf.length);
