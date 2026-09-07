/**
 * Regenerates the pretty-URL copies (e.g. login/index.html) from the root
 * pages (login.html). The copies are identical except for a <base href="../">
 * tag so relative asset paths keep working one level deeper.
 *
 * Run after editing any root page:  node scripts/sync-pages.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const skip = new Set(["index.html", "404.html"]);

let updated = 0;
for (const file of fs.readdirSync(root)) {
    if (!file.endsWith(".html") || skip.has(file)) continue;

    const name = file.replace(/\.html$/, "");
    const dir = path.join(root, name);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    let html = fs.readFileSync(path.join(root, file), "utf8");
    if (!html.includes('<base href="../">')) {
        html = html.replace(/<head>\s*\n/, match => `${match}    <base href="../">\n`);
    }

    const target = path.join(dir, "index.html");
    const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
    if (existing !== html) {
        fs.writeFileSync(target, html);
        updated++;
        console.log(`updated ${name}/index.html`);
    }
}
console.log(updated ? `${updated} page copies refreshed.` : "All page copies already in sync.");
