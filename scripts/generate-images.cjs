const fs = require("fs");
const path = require("path");

const COLORS = [
  ["#1e3a5f", "#0d1117"],
  ["#2d1b4e", "#0d1117"],
  ["#0f3d3e", "#0d1117"],
  ["#3d2c1f", "#0d1117"],
  ["#1a2f4a", "#16213e"],
  ["#2c1810", "#0d1117"],
];

function svg(label, colorPair, w = 800, h = 450) {
  const [c1, c2] = colorPair;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${c1}"/><stop offset="100%" style="stop-color:${c2}"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="system-ui,sans-serif" font-size="24">${label}</text>
</svg>`;
}

const categories = require("../data/categories.json");
const topics = require("../data/topics.json");
const theories = require("../data/theories.json");

categories.forEach((c, i) => {
  const file = path.join(__dirname, "../public/images/categories", c.slug + ".svg");
  fs.writeFileSync(file, svg(c.name, COLORS[i % COLORS.length]));
});
console.log("Wrote", categories.length, "category images");

topics.forEach((t, i) => {
  const file = path.join(__dirname, "../public/images/topics", t.slug + ".svg");
  fs.writeFileSync(file, svg(t.name, COLORS[i % COLORS.length]));
});
console.log("Wrote", topics.length, "topic images");

const seen = new Set();
theories.forEach((t) => {
  [t.coverImage, ...(t.galleryImages || [])].filter(Boolean).forEach((src) => {
    const base = src.replace("/images/theories/", "").replace(/\.[a-z]+$/, "");
    if (seen.has(base)) return;
    seen.add(base);
    const file = path.join(__dirname, "../public/images/theories", base + ".svg");
    fs.writeFileSync(file, svg(t.title + " " + base, COLORS[parseInt(t.id, 10) % COLORS.length], 600, 400));
  });
});
console.log("Wrote", seen.size, "theory images");
