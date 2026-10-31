// Renders each glass tile, plain and selected, in a real Chromium over black and over white.
// scripts/matte.py then recovers the transparency from the two renders.
// Usage: CHROME=/path/to/chrome node scripts/bake-tiles.js <work dir> (its Chrome needs DevTools protocol support).
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const WORK = process.argv[2];
const SCALE = 1080 / 394; // The launcher's scale on a 1920x1080 TV.
const MARGIN = 56; // Room around a tile for its glow and shadow. Matches .tile:before in src/index.html.
const TILE = { w: 326, h: 200 };
const TILES = [
  ['netflix', '#E50914', 'rgba(150,10,18,.2)', 'rgba(229,9,20,.5)', 'rgba(229,9,20,.3)'],
  ['youtube', '#FF2A2A', 'rgba(170,20,20,.18)', 'rgba(255,42,42,.5)', 'rgba(255,42,42,.28)'],
  ['prime', '#1A98FF', 'rgba(10,90,170,.2)', 'rgba(26,152,255,.5)', 'rgba(26,152,255,.3)'],
  ['spotify', '#1ED760', 'rgba(14,120,60,.2)', 'rgba(30,215,96,.5)', 'rgba(30,215,96,.26)'],
  ['disney', '#2CE8D4', 'rgba(6,130,130,.24)', 'rgba(44,232,212,.5)', 'rgba(44,232,212,.28)'],
  ['apps', '#A9C4FF', 'rgba(120,145,210,.14)', 'rgba(169,196,255,.45)', 'rgba(169,196,255,.2)'],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = (u) => new Promise((r, j) => http.get(u, (x) => { let b = ''; x.on('data', (d) => (b += d)); x.on('end', () => r(JSON.parse(b))); }).on('error', j));

const glass = fs.readFileSync('scripts/glass.css', 'utf8');
const pageFor = ([name, glow, tint, edge, cast], on, bg) => {
  const svg = fs.readFileSync('assets/tiles/' + name + '.svg').toString('base64');
  return '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:' + bg + ';overflow:hidden}'
    + '#w{position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(' + SCALE + ')}' + glass
    + '.tile{left:' + MARGIN + 'px;top:' + MARGIN + 'px;width:' + TILE.w + 'px;--glow:' + glow + ';--edge:' + edge + ';--cast:' + cast
    + ';background-color:' + tint + ';background-image:url(data:image/svg+xml;base64,' + svg + ');transition:none}'
    + '.tile.on{transform:none}</style><div id="w"><div class="tile' + (on ? ' on' : '') + '"></div></div>';
};

const chrome = spawn(process.env.CHROME, ['--headless', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9399',
  '--window-size=1920,1200', '--force-device-scale-factor=1', '--user-data-dir=' + WORK + '/profile', 'about:blank'], { stdio: 'ignore' });

(async () => {
  let tabs;
  for (let i = 0; i < 40 && !tabs; i++) { try { tabs = await get('http://127.0.0.1:9399/json'); } catch (e) { await sleep(250); } }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = {};
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) pending[m.id](m); };
  const cmd = (method, params = {}) => new Promise((r) => { pending[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  const width = Math.ceil((TILE.w + 2 * MARGIN) * SCALE);
  const height = Math.ceil((TILE.h + 2 * MARGIN) * SCALE);
  await cmd('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false, fitWindow: false });
  await cmd('Emulation.setVisibleSize', { width, height });
  await cmd('Page.enable');
  for (const tile of TILES) {
    for (const on of [false, true]) {
      for (const [label, bg] of [['black', '#000'], ['white', '#fff']]) {
        const file = WORK + '/' + tile[0] + (on ? '-on' : '') + '.' + label;
        fs.writeFileSync(file + '.html', pageFor(tile, on, bg));
        await cmd('Page.navigate', { url: 'file://' + file + '.html' });
        await sleep(500);
        const shot = await cmd('Page.captureScreenshot');
        fs.writeFileSync(file + '.png', Buffer.from(shot.result.data, 'base64'));
      }
    }
  }
  console.log('rendered', TILES.length * 4, 'frames at', width + 'x' + height);
  chrome.kill();
  process.exit(0);
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
