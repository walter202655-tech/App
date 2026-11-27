import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const script = await readFile(new URL("../script.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../style.css", import.meta.url), "utf8");

test("profile renderer has a scoped HTML escaping helper", () => {
  assert.match(script, /function escapeHTML\(value\)/);
  assert.match(script, /<h2[^\n]*\$\{escapeHTML\(username\)\}/);
  assert.match(script, /value="\$\{escapeHTML\(username\)\}"/);
});

test("saved state recovery merges nested defaults and validates collections", () => {
  assert.match(script, /categoriesPracticed:\s*\{/);
  assert.match(script, /weeklyXp:\s*\{/);
  assert.match(script, /if \(!Array\.isArray\(state\[key\]\)\)/);
});

test("profile editing and avatar selection have input constraints", () => {
  assert.match(script, /maxlength="24"/);
  assert.match(script, /slice\(0, 24\)/);
  assert.match(script, /allowedAvatars\.includes\(emoji\)/);
  assert.match(script, /profile-avatar-trigger/);
});

test("navigation rejects unknown views and keyboard shortcuts ignore editable fields", () => {
  assert.match(script, /!target \|\| !target\.classList\.contains\('content-view'\)/);
  assert.match(script, /if \(isEditing\) return/);
});

test("profile controls include visible keyboard focus styling", () => {
  assert.match(styles, /\.profile-avatar-trigger:focus-visible/);
  assert.match(styles, /#profile-username-input/);
});


test("all navigation destinations exist and HTML ids are unique", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const destinations = [...html.matchAll(/data-view="([^"]+)"/g)].map(match => match[1]);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.ok(destinations.length > 0, "Expected navigation destinations");
  for (const view of new Set(destinations)) {
    assert.ok(ids.includes("view-" + view), "Missing view container: " + view);
  }
  assert.equal(ids.length, new Set(ids).size, "HTML contains duplicate ids");
});


test("premium products are separated into six sections with explicit feature workspaces", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const id of ["grammar","pronunciation","themes","avatars","writing","multiplier"]) {
    assert.match(html, new RegExp('data-premium-feature="' + id + '"'));
  }
  assert.match(html, /id="premium-feature-workspace"/);
  assert.match(script, /renderPremiumGrammar\(\)/);
  assert.match(script, /renderPremiumPronunciation\(\)/);
  assert.match(script, /renderPremiumWriting\(\)/);
  assert.match(script, /renderPremiumThemes\(\)/);
  assert.match(script, /renderPremiumAvatars\(\)/);
  assert.match(script, /renderPremiumMultiplier\(\)/);
});

test("premium avatar collection is gated by ownership", () => {
  assert.match(script, /this\.state\.premiumAvatars \? \['🐙'/);
  assert.match(script, /Este avatar pertenece a la colección Premium/);
});

test("premium writing evaluation validates length and prevents duplicate AI requests", () => {
  assert.match(script, /async evaluatePremiumWriting\(\)/);
  assert.match(script, /words < 120 \|\| words > 220/);
  assert.match(script, /if \(this\.premiumWritingBusy\) return/);
  assert.match(script, /finally \{/);
});

test("premium theme palettes are applied only after unlocking and persist", async () => {
  const styles = await readFile(new URL("../style.css", import.meta.url), "utf8");
  assert.match(script, /if \(!this\.state\.premiumThemes\)/);
  assert.match(script, /this\.state\.premiumThemeSkin = skin/);
  assert.match(styles, /premium-skin-obsidian-gold/);
  assert.match(styles, /premium-skin-arctic-mint/);
  assert.match(styles, /premium-skin-sakura-pulse/);
});
