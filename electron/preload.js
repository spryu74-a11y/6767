const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("freddyDesktop", {
  quit: () => ipcRenderer.send("app:quit")
});
