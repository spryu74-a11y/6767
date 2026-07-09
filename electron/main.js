const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isSmokeTest = process.argv.includes("--smoke-test");

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    backgroundColor: "#000000",
    title: "FREDDY 1",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.once("ready-to-show", () => {
    if (!isSmokeTest) {
      window.show();
    }
  });

  window.webContents.once("did-finish-load", () => {
    if (isSmokeTest) {
      setTimeout(() => app.quit(), 300);
    }
  });

  window.webContents.on("did-fail-load", (_event, code, description) => {
    console.error(`Renderer failed to load: ${code} ${description}`);
    if (isSmokeTest) {
      process.exitCode = 1;
      app.quit();
    }
  });

  window.loadFile(path.join(__dirname, "..", "src", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.on("app:quit", () => app.quit());
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
