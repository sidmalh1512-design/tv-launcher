// Joins src/ into one self-contained dist/index.html, transpiled to ES5 so Tizen 4.0's Chromium 56 can run it.
const fs = require('fs');
const babel = require('@babel/core');
const acorn = require('acorn');

const source = ['src/avatar.js', 'src/launcher.js'].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const wrapped = '(function(){\n' + source + '\n})();';
const { code } = babel.transformSync(wrapped, {
  babelrc: false,
  configFile: false,
  sourceType: 'script',
  presets: [['@babel/preset-env', { targets: { ie: '11' }, modules: false }]],
});

// Fails the build if any syntax newer than ES5 survived.
acorn.parse(code, { ecmaVersion: 5 });

// Tile artwork is inlined, in the same order as NAMES in src/launcher.js.
const images = [
  ['netflix', '#E50914', 'rgba(150,10,18,.2)', 'rgba(229,9,20,.5)', 'rgba(229,9,20,.3)'],
  ['youtube', '#FF2A2A', 'rgba(170,20,20,.18)', 'rgba(255,42,42,.5)', 'rgba(255,42,42,.28)'],
  ['prime', '#1A98FF', 'rgba(10,90,170,.2)', 'rgba(26,152,255,.5)', 'rgba(26,152,255,.3)'],
  ['spotify', '#1ED760', 'rgba(14,120,60,.2)', 'rgba(30,215,96,.5)', 'rgba(30,215,96,.26)'],
  ['disney', '#2CE8D4', 'rgba(6,130,130,.24)', 'rgba(44,232,212,.5)', 'rgba(44,232,212,.28)'],
  ['apps', '#A9C4FF', 'rgba(120,145,210,.14)', 'rgba(169,196,255,.45)', 'rgba(169,196,255,.2)'],
].map(([name, glow, tint, edge, cast], i) => {
  const svg = fs.readFileSync('assets/tiles/' + name + '.svg').toString('base64');
  return '.tile:nth-child(' + (i + 1) + '){--glow:' + glow + ';--edge:' + edge + ';--cast:' + cast + ';background-color:' + tint + ';background-image:url(data:image/svg+xml;base64,' + svg + ')}';
}).join('\n');
const html = fs.readFileSync('src/index.html', 'utf8')
  .replace('/*TILE_IMAGES*/', () => images)
  .replace('/*BUNDLE*/', () => code);
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
const service = fs.readFileSync('src/service.js', 'utf8');
acorn.parse(service, { ecmaVersion: 5 });
fs.writeFileSync('dist/service.js', service);
console.log('dist/index.html', html.length, 'bytes');
