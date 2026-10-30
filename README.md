# Avatar Q Launcher

A TizenBrew launcher module for a Samsung TV: a pixel avatar that flips and jumps across rows of two large tiles.

## Install

In TizenBrew, open the Module Manager, choose the GitHub option, and enter:

    sidmalh1512-design/tv-launcher

## Remote

| Button | Action |
| --- | --- |
| Arrows | Move the avatar between tiles |
| OK | Open the tile |
| Back | Return to TizenBrew, or leave All Apps |

If you make this module auto-launch, hold Up while TizenBrew starts to stay in TizenBrew.

## Preview

Open `dist/index.html` in a browser. Arrows move, Enter opens, Esc is Back. Nothing launches in preview mode.

## Build

    npm install
    npm run build

`dist/index.html` is committed because TizenBrew serves the module directly from the tagged repo through jsDelivr. Rebuild it and bump the version before tagging a release.

`src/avatar.js` holds the avatar's poses. The move animations are in `src/launcher.js`.

## Tile artwork

Each tile is an image from `assets/tiles/`, built into `dist/index.html`. Replace a file and rebuild to change it. The logos belong to their owners and come from Wikimedia Commons.

## Opening apps

TizenBrew module pages have no access to the `tizen` API, so `src/service.js` runs as the module's service, where `tizen` is available. The page asks it over `http://127.0.0.1:8086` to list installed apps and launch them. It only answers requests from the launcher page.

A matching app's ID from the TV's list is tried first, followed by the known IDs in `src/launcher.js`. If `tizen.application.launch` fails, the service tries the TV's REST API. If the service isn't running, the page calls that REST API directly.

## All Apps

The last tile opens an alphabetical list of installed apps with a search bar. The list comes from the module service. If the service isn't running, it comes from the TV's local remote-control socket, and the TV asks for permission the first time.
