# Corgi Typing Widget

A small desktop widget for Windows. Cookie the corgi sits at a desk and presses the same key on screen whenever you type, and Cookie's eyes follow your mouse. The widget stays on top of other windows and has a transparent background.

This guide explains how to turn the source code into a single `.exe` file you can run. You only need to do this once. No programming knowledge is needed: just follow the steps in order.

---

## What you need

- A Windows 10 or 11 PC.
- An internet connection (the build downloads about 700 MB of tools the first time).
- About 1.5 GB of free disk space.

---

## Step 1: Install Node.js

Node.js is the tool that builds the app.

1. Go to <https://nodejs.org>.
2. Download the **LTS** version for Windows (the `.msi` installer).
3. Run the installer and click **Next** through every screen. The default options are fine.
4. When it finishes, restart your PC (or at least close and reopen any terminal windows).

To check it worked, open **PowerShell** (press the Windows key, type `powershell`, press Enter) and run:

```
node -v
npm -v
```

Each command should print a version number, such as `v24.19.0` and `11.17.0`. If you see "not recognized", restart your PC and try again.

---

## Step 2: Download the source code

1. Open <https://github.com/HsiaoJ0629/corgi-typing-widget>.
2. Click the green **Code** button, then **Download ZIP**.
3. Find the ZIP in your Downloads folder, right-click it and choose **Extract All…**.
4. Pick a simple location, for example `C:\corgi-typing-widget`, and click **Extract**.

Make sure the folder you end up with directly contains `package.json`, `main.js` and so on. Sometimes Windows creates a folder inside a folder (for example `corgi-typing-widget-main\corgi-typing-widget-main`). If so, use the inner one.

> Already have Git? You can run `git clone https://github.com/HsiaoJ0629/corgi-typing-widget.git` instead.

---

## Step 3: Turn on Developer Mode (one-time)

The build tool unpacks a file that Windows only allows with Developer Mode or admin rights. Turning on Developer Mode is the easiest fix.

1. Open **Settings**.
2. Windows 11: go to **System → For developers**. Windows 10: go to **Update & Security → For developers**.
3. Switch **Developer Mode** on and confirm.

If you can't or don't want to do this, run PowerShell **as administrator** in the next step instead (right-click PowerShell → **Run as administrator**).

---

## Step 4: Build the exe

1. Open the project folder in File Explorer.
2. Click the address bar at the top, type `powershell`, and press Enter. A PowerShell window opens already inside the project folder.
3. Run these two commands, one at a time, waiting for each to finish:

```
npm install
npm run dist
```

- `npm install` downloads everything the app needs. It can take a few minutes.
- `npm run dist` builds the exe. It can also take a few minutes the first time.

Warnings in yellow are normal. The build worked if the last lines don't say `ERROR` or `failed`.

---

## Step 5: Run it

Open the new **`dist`** folder inside the project folder. Your app is:

```
dist\ClaudeIdleWidget 1.0.0.exe
```

Double-click it to start Cookie. It is a portable app, so there is nothing to install. You can copy this one file anywhere (your Desktop, a USB stick) and delete the rest of the project folder if you like.

**"Windows protected your PC" warning:** the exe isn't signed with a paid certificate, so Windows SmartScreen may warn you the first time. Click **More info → Run anyway**.

---

## Using the widget

- **Move it:** drag it with the mouse.
- **Change transparency:** hold **Ctrl** and scroll the mouse wheel over the widget.
- **Change Cookie's status:** click the status board (ONLINE / LUNCH / AFK / BUSY).
- **More options:** right-click the widget's icon in the system tray (bottom-right of the taskbar, you may need to click the **^** arrow). From there you can show or hide the widget, reset its position, set transparency, turn on click-through, start it with Windows, or quit.

The widget only reacts to which key is pressed. It never records or saves what you type.

---

## Troubleshooting

**`npm` is not recognized**
Node.js isn't installed, or the terminal was opened before installing it. Restart your PC and try again.

**The build fails with a message about `winCodeSign` or "symbolic link"**
Developer Mode isn't on. Go back to Step 3, or run PowerShell as administrator, then run `npm run dist` again.

**The exe opens and closes straight away, or `npm start` says it can't load Electron**
This happens if you run the commands from the terminal inside VS Code, which sets a variable that breaks Electron. Use a normal PowerShell window instead (see Step 4), or clear it first:

```
Remove-Item Env:ELECTRON_RUN_AS_NODE
```

**`npm install` fails with network errors**
Check your internet connection. Company networks or VPNs sometimes block downloads; try another network.

**Starting fresh**
If something went wrong and you want to try again from scratch, delete the `node_modules` and `dist` folders inside the project folder, then repeat Step 4.

---

## For developers

- `npm start` runs the widget directly without building an exe.
- `npm run dist` builds the portable exe into `dist/`.

See [CLAUDE.md](CLAUDE.md) for an overview of how the code is organised.
