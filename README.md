# Avatar Q Launcher

A TizenBrew launcher module for a Samsung TV: a pixel avatar that flips and jumps between six tiles.

## Install

In TizenBrew, open the Module Manager, choose the GitHub option, and enter:

    sidmalh1512-design/tv-launcher

## Remote

| Button | Action |
| --- | --- |
| Arrows | Move the avatar between tiles |
| OK | Open the tile |
| Back | Return to TizenBrew |

If you make this module auto-launch, hold Up while TizenBrew starts to stay in TizenBrew.

## Preview

Open `dist/index.html` in a browser. Arrows move, Enter opens, Esc is Back. Nothing launches in preview mode.

## Build

    npm install
    npm run build

`dist/index.html` is committed because TizenBrew serves the module directly from the tagged repo through jsDelivr. Rebuild it and bump the version before tagging a release.

`src/avatar.js` holds the avatar's poses. The move animations are in `src/launcher.js`.

## Tile icons and app IDs

At startup the launcher reads the TV's installed-apps list with `tizen.application.getAppsInfo`. A matching app's ID is tried first, followed by the known IDs in `src/launcher.js`. Its real icon replaces the generic one only if it loads. Module pages are served over http, so the TV may refuse to load local icon files, and those tiles keep the generic icon and text label.

## HDMI tiles

Tizen's input-switching API needs a privilege TizenBrew doesn't have, so these tiles send `KEY_HDMI1` and `KEY_HDMI2` through the TV's local remote-control socket. The TV asks for permission the first time.
