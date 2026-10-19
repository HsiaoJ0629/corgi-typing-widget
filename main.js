const { app, BrowserWindow, screen, Tray, Menu, powerMonitor } = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(app.getPath('userData'), 'widget-config.json');
const WINDOW_W = 340;
const WINDOW_H = 292;

const DEFAULT_CONFIG = {
  x: undefined,
  y: undefined,
  // Window opacity until the user picks their own (0.5 = 50% transparent).
  opacity: 0.5,
  clickThrough: false,
  // Off until the user opts in: launching at sign-in also starts the global
  // keyboard hook, so it shouldn't happen just because the exe was tried once.
  launchAtStartup: false,
};

// Config is read once into memory and written back atomically (temp file +
// rename) on a short debounce, so dragging or Ctrl+scrolling doesn't hammer
// the disk and a crash mid-write can't leave truncated JSON behind.
function readConfigFile() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Ignoring unreadable config:', err.message);
    return {};
  }
}

const config = { ...DEFAULT_CONFIG, ...readConfigFile() };
let saveTimer = null;

function flushConfig() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try {
    const tmp = `${CONFIG_PATH}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(config));
    fs.renameSync(tmp, CONFIG_PATH);
  } catch (err) {
    console.error('Could not save config:', err.message);
  }
}

function updateConfig(changes) {
  Object.assign(config, changes);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushConfig, 300);
}

let win;
let tray;
let keyListener;

// Starting at sign-in plus a manual launch would otherwise open two widgets.
const gotInstanceLock = app.requestSingleInstanceLock();

// The portable build unpacks itself to a temp folder that changes on every
// launch, so register the original .exe (electron-builder exposes its path
// as PORTABLE_EXECUTABLE_FILE) rather than process.execPath. Re-applied on
// every start so the entry follows the exe if it was moved. Skipped when
// running unpackaged via `npm start`, which would register electron.exe.
function setLaunchAtStartup(enabled) {
  if (!app.isPackaged) return;
  app.setLoginItemSettings({
    openAtLogin: enabled,
    name: 'ClaudeIdleWidget',
    path: process.env.PORTABLE_EXECUTABLE_FILE || process.execPath,
  });
}

function defaultPosition() {
  const { x, y, width } = screen.getPrimaryDisplay().workArea;
  return { x: x + width - WINDOW_W, y: y + 40 };
}

// A saved position is only reused if most of the widget would still be on
// a connected display (e.g. not after undocking from an external monitor).
function isMostlyVisible(x, y) {
  return screen.getAllDisplays().some(({ workArea: a }) => {
    const overlapW = Math.min(x + WINDOW_W, a.x + a.width) - Math.max(x, a.x);
    const overlapH = Math.min(y + WINDOW_H, a.y + a.height) - Math.max(y, a.y);
    return overlapW >= WINDOW_W / 2 && overlapH >= WINDOW_H / 2;
  });
}

function startPosition() {
  const { x, y } = config;
  return Number.isFinite(x) && Number.isFinite(y) && isMostlyVisible(x, y) ? { x, y } : defaultPosition();
}

function resetPosition() {
  if (!win || win.isDestroyed()) return;
  const { x, y } = defaultPosition();
  win.setPosition(x, y);
  updateConfig({ x, y });
}

function ensureOnScreen() {
  if (!win || win.isDestroyed()) return;
  const [x, y] = win.getPosition();
  if (!isMostlyVisible(x, y)) resetPosition();
}

function isWidgetShowing() {
  return Boolean(win && !win.isDestroyed() && win.isVisible() && !win.isMinimized());
}

// Streams the mouse position (relative to the window, in DIPs) to the
// renderer so Cookie's eyes can follow it anywhere on screen. Only runs
// while the widget is showing and the session is unlocked, and only sends
// when the position changes.
let cursorTimer = null;
let lastCursor = null;
let sessionLocked = false;

function startCursorTimer() {
  if (cursorTimer || sessionLocked || !isWidgetShowing()) return;
  cursorTimer = setInterval(() => {
    if (!isWidgetShowing()) return stopCursorTimer();
    const p = screen.getCursorScreenPoint();
    const b = win.getContentBounds();
    const rel = { x: p.x - b.x, y: p.y - b.y };
    if (lastCursor && lastCursor.x === rel.x && lastCursor.y === rel.y) return;
    lastCursor = rel;
    win.webContents.send('cursor-pos', rel);
  }, 33);
}

function stopCursorTimer() {
  clearInterval(cursorTimer);
  cursorTimer = null;
}

function createWindow() {
  setLaunchAtStartup(config.launchAtStartup);
  const { x, y } = startPosition();

  win = new BrowserWindow({
    width: WINDOW_W,
    height: WINDOW_H,
    x,
    y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // The widget only ever shows its own local page.
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e) => e.preventDefault());

  win.setAlwaysOnTop(true, 'screen-saver');
  win.loadFile('index.html');
  win.setOpacity(config.opacity);
  if (config.clickThrough) win.setIgnoreMouseEvents(true, { forward: true });

  win.on('moved', () => {
    const [wx, wy] = win.getPosition();
    updateConfig({ x: wx, y: wy });
  });

  for (const event of ['show', 'restore']) win.on(event, startCursorTimer);
  for (const event of ['hide', 'minimize']) win.on(event, stopCursorTimer);
  win.on('show', buildTrayMenu);
  win.on('hide', buildTrayMenu);
  win.webContents.on('did-finish-load', startCursorTimer);

  win.on('closed', () => {
    stopCursorTimer();
    win = null;
  });

  screen.on('display-removed', ensureOnScreen);
  screen.on('display-metrics-changed', ensureOnScreen);

  powerMonitor.on('lock-screen', () => {
    sessionLocked = true;
    stopCursorTimer();
    resetHeldKeys();
  });
  for (const event of ['unlock-screen', 'resume']) {
    powerMonitor.on(event, () => {
      sessionLocked = false;
      resetHeldKeys();
      startCursorTimer();
    });
  }
  powerMonitor.on('suspend', resetHeldKeys);

  createTray();
  startKeyListener();
}

// Transparency presets offered in the tray menu (0 = solid). Ctrl + mouse
// wheel over the widget fine-tunes between them in 5% steps.
const TRANSPARENCY_PRESETS = [0, 0.1, 0.25, 0.4, 0.5, 0.55, 0.7];
const MIN_OPACITY = 0.2;

function setOpacity(value) {
  const opacity = Math.round(Math.min(1, Math.max(MIN_OPACITY, value)) * 20) / 20;
  if (win && !win.isDestroyed()) win.setOpacity(opacity);
  updateConfig({ opacity });
  buildTrayMenu();
}

// The whole widget is a window-drag region, which on Windows swallows wheel
// events before the page sees them, so Ctrl + wheel is read from the same
// global input hook as the keyboard. The hook's own ctrlKey flag and x/y
// aren't reliable (Ctrl reads false; coordinates are off on multi-monitor
// DPI setups), so Ctrl is tracked from key events and the cursor position
// comes from Electron. A held key auto-repeats its keydown, so Ctrl counts
// as held only if it was seen recently: a keyup swallowed by the secure
// desktop (Ctrl+Alt+Del, Win+L, UAC) then can't leave it stuck on.
const CTRL_STALE_MS = 1000;
let ctrlSeenAt = 0;

function isCtrlHeld() {
  return ctrlSeenAt > 0 && Date.now() - ctrlSeenAt < CTRL_STALE_MS;
}

function onGlobalWheel(e) {
  if (!isCtrlHeld() || !isWidgetShowing()) return;
  const point = screen.getCursorScreenPoint();
  const b = win.getBounds();
  if (point.x < b.x || point.x >= b.x + b.width || point.y < b.y || point.y >= b.y + b.height) return;
  // Wheel up (negative rotation) = more solid, wheel down = more see-through.
  setOpacity(win.getOpacity() + (e.rotation < 0 ? 0.05 : -0.05));
}

function toggleWidget() {
  if (!win || win.isDestroyed()) return;
  if (win.isVisible() && !win.isMinimized()) {
    win.hide();
  } else {
    win.show();
    win.restore();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'assets', 'tray.png'));
  tray.setToolTip('Claude Idle Widget');
  tray.on('click', toggleWidget);
  buildTrayMenu();
}

function buildTrayMenu() {
  if (!tray) return;
  const currentOpacity = config.opacity;
  const menu = Menu.buildFromTemplate([
    { label: 'Claude Idle Widget', enabled: false },
    { type: 'separator' },
    {
      label: win && !win.isDestroyed() && win.isVisible() ? 'Hide widget' : 'Show widget',
      click: toggleWidget,
    },
    { label: 'Reset position', click: resetPosition },
    {
      label: `Transparency (${Math.round((1 - currentOpacity) * 100)}%)`,
      submenu: [
        ...TRANSPARENCY_PRESETS.map((t) => ({
          label: t === 0 ? 'Off (solid)' : `${Math.round(t * 100)}%`,
          type: 'radio',
          checked: Math.abs(1 - currentOpacity - t) < 0.001,
          click: () => setOpacity(1 - t),
        })),
        { type: 'separator' },
        { label: 'Tip: Ctrl + scroll on the widget to fine-tune', enabled: false },
      ],
    },
    {
      label: 'Click-through',
      type: 'checkbox',
      checked: config.clickThrough,
      click: (item) => {
        updateConfig({ clickThrough: item.checked });
        if (win && !win.isDestroyed()) win.setIgnoreMouseEvents(item.checked, { forward: true });
      },
    },
    {
      label: 'Start with Windows',
      type: 'checkbox',
      checked: config.launchAtStartup,
      click: (item) => {
        updateConfig({ launchAtStartup: item.checked });
        setLaunchAtStartup(item.checked);
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
}

// Reacts to keystrokes made anywhere on the system, not just inside the
// widget, so Cookie can "press" the same key on screen. Key names are only
// forwarded to the widget's own renderer for the animation - never logged,
// written to disk or sent anywhere - and nothing is forwarded while the
// widget is hidden. Auto-repeats of a held key are dropped.
const heldKeys = new Set();

function resetHeldKeys() {
  heldKeys.clear();
  ctrlSeenAt = 0;
}

function startKeyListener() {
  try {
    const { uIOhook, UiohookKey } = require('uiohook-napi');
    const codeToLabel = {};
    for (const [name, code] of Object.entries(UiohookKey)) {
      codeToLabel[code] = name;
    }

    keyListener = uIOhook;
    const isCtrl = (keycode) => keycode === UiohookKey.Ctrl || keycode === UiohookKey.CtrlRight;
    keyListener.on('keyup', (e) => {
      heldKeys.delete(e.keycode);
      if (isCtrl(e.keycode)) ctrlSeenAt = 0;
    });
    keyListener.on('keydown', (e) => {
      if (isCtrl(e.keycode)) ctrlSeenAt = Date.now();
      if (heldKeys.has(e.keycode)) return;
      heldKeys.add(e.keycode);
      if (isWidgetShowing()) {
        win.webContents.send('key-pulse', codeToLabel[e.keycode] || null);
      }
    });
    keyListener.on('wheel', onGlobalWheel);
    keyListener.start();
  } catch (err) {
    console.error('Global key listener unavailable, widget will stay idle:', err.message);
  }
}

function stopKeyListener() {
  if (!keyListener) return;
  try {
    keyListener.stop();
  } catch {}
  keyListener = null;
}

if (!gotInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win || win.isDestroyed()) return;
    win.show();
    if (win.isMinimized()) win.restore();
    win.focus();
  });
  app.whenReady().then(createWindow);
}

// app.quit() (the tray's Quit) skips window-all-closed, so the hook is
// stopped and pending config flushed here, which runs on every exit path.
app.on('will-quit', () => {
  stopKeyListener();
  if (saveTimer) flushConfig();
});

app.on('window-all-closed', () => app.quit());
