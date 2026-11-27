import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const root=new URL("../",import.meta.url);
const [html,script,css,motion,pkg]=await Promise.all([
 readFile(new URL("index.html",root),"utf8"),
 readFile(new URL("script.js",root),"utf8"),
 readFile(new URL("visual-refresh.css",root),"utf8"),
 readFile(new URL("js/motion-system.js",root),"utf8"),
 readFile(new URL("package.json",root),"utf8")
]);
test("Aurora Flow is available in the theme selector",()=>{
 assert.match(script,/'aurora-flow':\s*\{/);
 assert.match(script,/theme-aurora-flow/);
 assert.match(css,/body\.theme-aurora-flow/);
});
test("visual refresh stylesheet loads after base styles",()=>{
 assert.ok(html.indexOf("style.css")<html.indexOf("visual-refresh.css"));
 assert.ok(html.includes("visual-refresh.css"));
});
test("visual system supports mobile and reduced motion",()=>{
 assert.match(css,/max-width:640px/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/hero-welcome-card/);
});
test("Anime.js animates view entrances and staggered components",()=>{
 assert.match(motion,/animateActiveView/);
 assert.match(motion,/outElastic/);
 assert.match(motion,/stagger\(68/);
 assert.match(motion,/prefers-reduced-motion/);
});
test("syntax check includes the motion system",()=>assert.match(pkg,/motion-system\.js/));
