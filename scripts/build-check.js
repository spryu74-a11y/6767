const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const requiredFiles = [
  "package.json",
  "electron/main.js",
  "electron/preload.js",
  "src/index.html",
  "src/main.js",
  "src/style.css",
  "scripts/build-html-version.js",
  "assets/office/office-layout.png",
  "assets/office/left-panel-default.png",
  "assets/office/right-panel-default.png",
  "assets/sprites/camera-text.png",
  "assets/sprites/camera-ui-hud.png",
  "assets/sprites/cctv-button.png",
  "assets/sprites/cctv-blip-flash.png",
  "assets/sprites/cctv-cam-1.png",
  "assets/sprites/cctv-cam-1-feed.png",
  "assets/sprites/cctv-cam-2.png",
  "assets/sprites/cctv-cam-2-feed.png",
  "assets/sprites/cctv-cam-3.png",
  "assets/sprites/cctv-cam-3-feed.png",
  "assets/sprites/cctv-cam-4.png",
  "assets/sprites/cctv-cam-4-feed-0.png",
  "assets/sprites/cctv-cam-4-feed-1.png",
  "assets/sprites/cctv-cam-4-feed-2.png",
  "assets/sprites/cctv-cam-4-feed-3.png",
  "assets/sprites/cctv-map-layout.png",
  "assets/sprites/cctv-open-panel.png",
  "assets/sprites/cctv-static.png",
  "assets/sprites/death-static.png",
  "assets/sprites/menu-background.png",
  "assets/sprites/menu-quit.png",
  "assets/sprites/menu-start.png",
  "assets/sprites/music-box-kim.png",
  "assets/sprites/music-box-room.png",
  "assets/sprites/office-camera.png",
  "assets/sprites/tongtong-kim-left.png",
  "assets/sprites/tongtong-kim-right.png",
  "assets/audio/blip3.mp3",
  "assets/audio/camera-video-load.mp3",
  "assets/audio/chimes-2.mp3",
  "assets/audio/darkness-music.mp3",
  "assets/audio/death-static.mp3",
  "assets/audio/put-down.mp3",
  "assets/audio/door-toggle.mp3",
  "assets/audio/Error.mp3",
  "assets/audio/light-hum.mp3",
  "assets/audio/windowscare.mp3",
  "assets/audio/Xscream.mp3"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error("Missing required files:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const requiredScripts = ["dev", "start", "build", "html", "dist", "dist:win", "dist:portable"];
const missingScripts = requiredScripts.filter((script) => !packageJson.scripts?.[script]);
if (missingScripts.length > 0) {
  console.error(`Missing npm scripts: ${missingScripts.join(", ")}`);
  process.exit(1);
}

if (packageJson.build?.productName !== "FREDDY 1") {
  console.error("Expected electron-builder productName to be FREDDY 1.");
  process.exit(1);
}

console.log("FREDDY 1 CCTV prototype build check passed.");
