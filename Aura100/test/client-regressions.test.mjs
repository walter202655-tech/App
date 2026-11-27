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
