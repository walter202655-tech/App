import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [motion, html, css, pkg] = await Promise.all([
  readFile(new URL("js/motion-system.js", root), "utf8"),
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("motion-effects.css", root), "utf8"),
  readFile(new URL("package.json", root), "utf8")
]);

test("Anime.js motion layer is loaded after its library and stylesheet", () => {
  assert.ok(html.includes("motion-effects.css"));
  assert.ok(html.indexOf("anime.umd.min.js") < html.indexOf("js/motion-system.js"));
  assert.ok(html.includes("https://cdn.jsdelivr.net;"));
});

test("motion layer degrades safely and respects reduced motion", () => {
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(motion, /typeof animate !== "function"\) return/);
  assert.match(motion, /MutationObserver/);
});

test("motion layer covers staggered cards, progress bars and button feedback", () => {
  assert.match(motion, /stagger\(48/);
  assert.match(motion, /animateProgress/);
  assert.match(motion, /pointerdown/);
  assert.match(css, /prefers-reduced-motion/);
});

test("syntax check includes the motion system", () => {
  assert.match(pkg, /motion-system\.js/);
});
