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

// Pre-rendered tiles are inlined, in the same order as NAMES in src/launcher.js.
const baked = (file) => 'url(data:image/webp;base64,' + fs.readFileSync('assets/baked/' + file + '.webp').toString('base64') + ')';
const images = ['netflix', 'youtube', 'prime', 'spotify', 'disney', 'apps'].map((name, i) => {
  const tile = '.tile:nth-child(' + (i + 1) + ')';
  return tile + ':before{background-image:' + baked(name) + '}\n' + tile + '.on:before{background-image:' + baked(name + '-on') + '}';
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
