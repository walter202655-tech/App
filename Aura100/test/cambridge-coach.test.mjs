import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const coach = await readFile(new URL("../js/cambridge-coach.js", import.meta.url), "utf8");
const prompts = await readFile(new URL("../src/prompts.mjs", import.meta.url), "utf8");
const schemas = await readFile(new URL("../src/schemas.mjs", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../academy-hub.css", import.meta.url), "utf8");

test("Cambridge coach exposes the three improvement stages", () => {
  for (const feature of ["coach-progress", "coach-adaptive", "coach-speaking", "coach-mock", "renderListening", "submitWriting", "startAdaptivePractice"]) {
    assert.ok(coach.includes(feature), "Missing Cambridge feature: " + feature);
  }
  assert.match(html, /src="js\/cambridge-coach\.js"/);
});

test("Speaking simulation has a dedicated age-appropriate AI scenario", () => {
  assert.match(schemas, /cambridge_speaking/);
  assert.match(prompts, /cambridge_speaking/);
  assert.match(coach, /pronunciation and actual spoken fluency cannot be assessed from typed answers/i);
});

test("Cambridge Writing uses the four B2 First assessment criteria", () => {
  for (const criterion of ["Content", "Communicative Achievement", "Organisation", "Language"]) {
    assert.ok(prompts.includes(criterion));
    assert.ok(prompts.includes(criterion));
  }
  assert.match(coach, /CAMBRIDGE_B2_FIRST_RUBRIC/);
});

test("integrated mock covers all four exam papers and is clearly formative", () => {
  for (const paper of ["reading", "writing", "listening", "speaking"]) assert.ok(coach.includes(paper));
  assert.match(coach, /no una reproducción del examen oficial completo/i);
  assert.match(coach, /No se calcula una puntuación Cambridge English Scale/);
  assert.match(css, /@media\(max-width:760px\)/);
});
