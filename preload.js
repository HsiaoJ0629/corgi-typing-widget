const { contextBridge, ipcRenderer } = require('electron');

// Each subscribe call returns a function that removes its listener.
function subscribe(channel, callback) {
  const listener = (event, payload) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('widgetAPI', {
  onKeyPulse: (callback) => subscribe('key-pulse', callback),
  onCursorPos: (callback) => subscribe('cursor-pos', callback),
});
