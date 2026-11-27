import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const hub = await readFile(new URL("../js/academy-hub.js", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const styles = await readFile(new URL("../academy-hub.css", import.meta.url), "utf8");

test("Academy Hub views are wired into navigation and loaded after the main app", () => {
  for (const view of ["calendar", "daily-games", "cambridge-b2", "exam-chat"]) {
    assert.match(html, new RegExp('id="view-' + view + '"'));
    assert.match(html, new RegExp('data-view="' + view + '"'));
  }
  assert.ok(html.indexOf('src="script.js"') < html.indexOf('src="js/academy-hub.js"'));
  assert.match(html, /href="academy-hub\.css"/);
});

test("the hub contains calendar, daily games, vocabulary assessment and progress records", () => {
  for (const feature of [
    "generateCalendarPlan", "renderCalendarPlan", "submitWordle",
    "selectConnect", "renderVocabularyQuiz", "recordQuestion",
    "renderProgressExtras", "generateProgressSummary"
  ]) {
    assert.ok(hub.includes(feature), "Missing feature: " + feature);
  }
});

test("Cambridge B2 preparation covers all four papers and cautious practice feedback", () => {
  for (const paper of ["Reading and Use of English", "Writing", "Listening", "Speaking"]) {
    assert.ok(hub.includes(paper), "Missing Cambridge paper: " + paper);
  }
  assert.match(hub, /Predictive Notes/);
  assert.match(hub, /No equivale a una puntuación Cambridge English Scale/);
  assert.match(hub, /FALLBACK_QUESTIONS/);
});

test("hub markup escapes user and model-provided text and responsive styles exist", () => {
  assert.match(hub, /function escapeHTML/);
  assert.match(hub, /escapeHTML\(message\.content\)/);
  assert.match(styles, /@media\(max-width:760px\)/);
  assert.match(styles, /@media\(max-width:440px\)/);
  assert.doesNotMatch(hub, /\beval\s*\(/);
  assert.doesNotMatch(hub, /new Function\s*\(/);
});


test("calendar task rewards can only be claimed once, even after unchecking", () => {
  assert.match(hub, /calendarRewards: parsed\.calendarRewards/);
  assert.match(hub, /const shouldReward = !checked && !this\.state\.calendarRewards\[id\]/);
  assert.match(hub, /if \(shouldReward\) this\.state\.calendarRewards\[id\] = true/);
  assert.match(hub, /if \(shouldReward\) this\.app\.addXp\(3\)/);
});
