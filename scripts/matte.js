// Combines each tile's black and white renders into a transparent WebP in assets/baked/.
// Usage: node scripts/matte.js <work dir>
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const work = process.argv[2];
const WIDTH = 1201; // Tile plus margins at the TV's scale, as rendered by scripts/bake-tiles.js.
const HEIGHT = 856;
const raw = (file) => sharp(path.join(work, file)).extract({ left: 0, top: 0, width: WIDTH, height: HEIGHT }).removeAlpha().raw().toBuffer({ resolveWithObject: true });

(async () => {
  fs.mkdirSync('assets/baked', { recursive: true });
  const names = fs.readdirSync(work).filter((f) => f.endsWith('.black.png')).map((f) => f.split('.')[0]);
  let total = 0;
  for (const name of names) {
    const black = await raw(name + '.black.png');
    const white = await raw(name + '.white.png');
    const { width, height } = black.info;
    const out = Buffer.alloc(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      // A pixel shows the background by (1 - alpha), so its change between backgrounds gives alpha.
      let change = 0;
      for (let c = 0; c < 3; c++) change += white.data[i * 3 + c] - black.data[i * 3 + c];
      const alpha = Math.min(1, Math.max(0, 1 - change / (3 * 255)));
      for (let c = 0; c < 3; c++) out[i * 4 + c] = alpha > 0 ? Math.min(255, Math.round(black.data[i * 3 + c] / alpha)) : 0;
      out[i * 4 + 3] = Math.round(alpha * 255);
    }
    const file = 'assets/baked/' + name + '.webp';
    await sharp(out, { raw: { width, height, channels: 4 } }).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(file);
    total += fs.statSync(file).size;
    console.log(name, width + 'x' + height, Math.round(fs.statSync(file).size / 1024) + ' KB');
  }
  console.log('total', Math.round(total / 1024) + ' KB');
})();
