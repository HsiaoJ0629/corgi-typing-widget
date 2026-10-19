# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small always-on-top, frameless, transparent Electron desktop widget for Windows. It shows "Cookie" the corgi sitting at a desk with a 60% keyboard. Cookie presses the same key on screen whenever you type anywhere on the system, and Cookie's eyes follow the mouse. The scene also has a clock and a status board you can click to cycle the mood.

## Commands

- `npm start`: run unpackaged with Electron.
- `npm run dist`: build a Windows portable `.exe` into `dist/` with electron-builder.

VS Code's integrated terminal sets `ELECTRON_RUN_AS_NODE`, which makes `require('electron')` fail. It is also inherited by anything launched from there, including the built exe, which then exits at once. Clear it first: `env -u ELECTRON_RUN_AS_NODE npm start` (and the same for `npm run dist` or when launching the exe).

`npm run dist` edits the exe's icon and version info (`signAndEditExecutable: true`). It needs electron-builder's winCodeSign toolkit, whose archive contains macOS symlinks that Windows can't create without admin rights or Developer Mode. If the build fails on that, unpack it into the cache by hand and the symlink errors can be ignored:
`node_modules/7zip-bin/win/x64/7za.exe x -snld -y <cache>/winCodeSign/<id>.7z -o<cache>/winCodeSign/winCodeSign-2.6.0`, where `<cache>` is `%LOCALAPPDATA%/electron-builder/Cache`. The build isn't code-signed, since there's no certificate.

Electron is pinned to an exact version, and `allowScripts` in package.json must name that same version or its binary download is blocked.

There are no tests, linter or bundler. The source is plain CommonJS and browser JS, loaded directly. Opening `index.html` in a plain browser also works as a rough preview: it falls back to `mousemove` for eye tracking, and the keyboard stays idle.

## Architecture

Three files work together over IPC:

- **[main.js](main.js)** (main process) owns the window, tray menu, config and all global input:
  - **Global keyboard/wheel:** uses `uiohook-napi`. Each new keydown is sent to the renderer as `key-pulse` with the uiohook key *name* (from `UiohookKey`). Auto-repeats are dropped (`heldKeys`), nothing is sent while the widget is hidden or minimised, and key data is never logged. If the native module fails to load, the widget still runs, just without key reactions. The hook is stopped in `will-quit`, because the tray's Quit (`app.quit()`) skips `window-all-closed`.
  - **Cursor:** `screen.getCursorScreenPoint()` is polled every ~33 ms and sent as `cursor-pos`, relative to the window's content bounds, and only when it changes. The timer only runs while the widget is showing and the session is unlocked.
  - **Opacity:** Ctrl + mouse wheel over the widget changes opacity. This has to go through the global hook, because the whole window is a `-webkit-app-region: drag` area and Windows swallows wheel events there. uiohook's own `ctrlKey` and x/y are unreliable, so Ctrl comes from key events and the cursor position from Electron. Ctrl only counts as held if a Ctrl keydown (auto-repeat included) was seen within `CTRL_STALE_MS`, because the secure desktop (Ctrl+Alt+Del, Win+L) swallows its keyup.
  - **Config:** `userData/widget-config.json` holds position, opacity, clickThrough and launchAtStartup. It is read once into the in-memory `config` (merged over `DEFAULT_CONFIG`: 50% opacity, launch at startup off) and written by `updateConfig()` on a 300 ms debounce, via a temp file plus rename. Pending writes are flushed on quit. When unpackaged, `userData` is `%APPDATA%/claude-idle-widget`.
  - **Position:** a saved position is only reused if at least half the widget lands on a connected display's work area (`isMostlyVisible`). Otherwise it opens top-right on the primary display. The same check reruns when displays change. Electron reports display coordinates in DIPs, not physical pixels, so mixed-DPI monitor layouts differ from what WinForms or Win32 report.
  - **Tray:** Show/Hide (a left-click toggles too), Reset position, transparency presets, Click-through (also applied at startup), Start with Windows, Quit.
  - **Single instance and launch at startup:** the app holds a single-instance lock. Launch at startup registers `PORTABLE_EXECUTABLE_FILE`, because the portable build unpacks to a temp dir that changes each run. It is re-applied on every start so it follows a moved exe, and is a no-op when unpackaged.
  - **Hardening:** the renderer is sandboxed, has a CSP `<meta>` in index.html, and navigation and `window.open` are blocked.
- **[preload.js](preload.js)** exposes `window.widgetAPI` (`onKeyPulse`, `onCursorPos`) through `contextBridge`. Each returns an unsubscribe function. `contextIsolation` is on and `nodeIntegration` is off.
- **[renderer.js](renderer.js)** draws everything on one 300×222 `<canvas>` from `frame()`. It is capped at about 30 fps when idle and runs at the full display rate for 2 s after each keystroke. Easing goes through `easeFactor(perFrame, dt)` so motion doesn't depend on the frame rate. There is no DOM UI apart from one transparent `#statusHit` div positioned over the status board, which is `no-drag` so it can be clicked.

### Renderer details worth knowing

- **Key names must match.** In `ROWS`, each key is `[keyName, label, widthUnits]`, and `keyName` must exactly match the name uiohook reports (for example, the Windows key arrives as `Meta`). Every row must add up to 15 units so the board stays rectangular. Fn is drawn but can never light up, because the OS never sees it.
- **Mascot coordinates.** The mascot is SVG-style `Path2D` data in a fixed design space centred on `(DESIGN_CX, DESIGN_CY)`. It is placed with `translate(MASCOT_CENTER_X - DESIGN_CX, MASCOT_SHIFT_Y)`. The head group also gets the idle bob; the torso is drawn separately and does not bob.
- **Draw order is the layering.** `frame()` draws, back to front: clock, status board, chair, torso, desk, PC tower, name tag, keyboard, arms, head. Change this order on purpose only.
- **Layout units.** Layout uses `SCENE_W`/`SCENE_H` (CSS px), never `canvas.width`/`canvas.height`. The canvas backing store is scaled by `devicePixelRatio` (`syncPixelRatio()`, re-checked every frame).
- **Noctis theme and the PC tower.** The visual theme is "Noctis N-9" (from a design canvas): near-black parts with one red accent (`NOCTIS_*` constants) and the `TECH_FONT` stack (Bahnschrift stands in for Chakra Petch, which isn't available offline). The PC tower on the left of the desk mirrors the name tag on the right. Keystrokes raise a shared `heat` value (0–1) that cools over time; it drives the tower's °C readout, its glow and the fan speed (`fanAngle`).
- **Status drives the face.** The status (`currentMood()`: ONLINE / LUNCH / AFK / BUSY) picks Cookie's expression in `drawFace`. It is held in memory only and is not saved.
- **Reactions on top of the mood.** `drawMascotBody` builds a `face` object:
  - `petting`: the cursor rests on the head for 500 ms.
  - `peeking`: a key is pressed while AFK or at LUNCH.
  - `panting`: heat above 0.75 while ONLINE.
  - `sweating`: heat above 0.85.
  - AFK also slows and dims the backlight and holds the fans at idle. The system's reduced-motion setting slows the colour wave and removes the bob.
- **Cached drawing objects.** Constant `Path2D` strings and fixed-coordinate gradients are cached (`cachedPath`, `cachedGradient`). Only things that depend on heat or position are built each frame.
- **Hands.** `onKeyPulse` assigns a key to the left or right hand by which half of the canvas the key is on. `updateHand` then eases the paw from home row (F/J) to the key and back over about 420 ms.
- **Shared keyboard colour.** The keyboard backlight and the clock and status rings all use the same `rgbWaveColor` deep red/bright red/pink wave.

## Notes

- electron-builder's `build.files` whitelists `main.js`, `preload.js`, `index.html`, `renderer.js` and `assets/**`. Add any new source file there, or it will be missing from the packaged exe.
