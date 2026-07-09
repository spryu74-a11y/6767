const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "src");
const assetsDir = path.join(root, "assets");
const outputDir = path.join(root, "html-version");

function ensureInsideRoot(target) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(root + path.sep)) {
    throw new Error(`Refusing to write outside project: ${resolved}`);
  }
  return resolved;
}

function rewriteAssetPaths(text) {
  return text.replace(/\.\.\/assets\//g, "./assets/");
}

function writeText(relativePath, text) {
  const target = ensureInsideRoot(path.join(outputDir, relativePath));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, "utf8");
}

fs.rmSync(ensureInsideRoot(outputDir), { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.cpSync(assetsDir, path.join(outputDir, "assets"), { recursive: true });

let html = fs.readFileSync(path.join(sourceDir, "index.html"), "utf8");
html = rewriteAssetPaths(html)
  .replace('<link rel="stylesheet" href="./style.css">', [
    '<link rel="stylesheet" href="./style.css">',
    '  <link rel="manifest" href="./manifest.webmanifest">',
    '  <meta name="theme-color" content="#000000">',
    '  <meta name="mobile-web-app-capable" content="yes">',
    '  <meta name="apple-mobile-web-app-capable" content="yes">',
    '  <meta name="apple-mobile-web-app-title" content="FREDDY 1">'
  ].join("\n"))
  .replace('<script type="module" src="./main.js"></script>', '<script src="./main.js"></script>');

writeText("index.html", html);
writeText("style.css", rewriteAssetPaths(fs.readFileSync(path.join(sourceDir, "style.css"), "utf8")));
writeText("main.js", rewriteAssetPaths(fs.readFileSync(path.join(sourceDir, "main.js"), "utf8")));
writeText("manifest.webmanifest", JSON.stringify({
  name: "FREDDY 1",
  short_name: "FREDDY 1",
  start_url: "./index.html",
  display: "fullscreen",
  background_color: "#000000",
  theme_color: "#000000",
  orientation: "any"
}, null, 2));

console.log(`HTML version built at ${path.relative(root, outputDir)}`);
