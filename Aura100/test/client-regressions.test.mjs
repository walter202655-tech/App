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
