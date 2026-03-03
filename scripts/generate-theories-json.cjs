const fs = require("fs");
const path = require("path");

const tsPath = path.join(__dirname, "..", "data", "theories.ts");
const jsonPath = path.join(__dirname, "..", "data", "theories.json");
const ts = fs.readFileSync(tsPath, "utf8");
const start = ts.indexOf("[");
const end = ts.lastIndexOf("]") + 1;
const arrStr = ts.slice(start, end);
const fn = new Function("return " + arrStr);
const data = fn();
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
console.log("Wrote", data.length, "entries to data/theories.json");
