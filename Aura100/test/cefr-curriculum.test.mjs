import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../script.js", import.meta.url), "utf8");
const match = source.match(/const ADDITIONAL_CEFR_LESSONS =\s*(\[[\s\S]*?\]);\s*LESSONS_DATA\.push/);
assert.ok(match, "The additional CEFR lesson dataset must be present.");
const lessons = JSON.parse(match[1]);

test("exactly 50 additional CEFR lessons are registered", () => {
  assert.equal(lessons.length, 50);
  assert.match(source, /LESSONS_DATA\.push\(\.\.\.ADDITIONAL_CEFR_LESSONS\)/);
});

test("the 50 modules are distributed across all six CEFR levels", () => {
  const counts = Object.fromEntries(["A1", "A2", "B1", "B2", "C1", "C2"].map(level => [
    level,
    lessons.filter(lesson => lesson.cefr === level).length
  ]));
  assert.deepEqual(counts, { A1: 9, A2: 9, B1: 8, B2: 8, C1: 8, C2: 8 });
});

test("each additional module has a unique id, sequential number and two exercises", () => {
  const ids = lessons.map(lesson => lesson.id);
  assert.equal(new Set(ids).size, 50);
  lessons.forEach((lesson, index) => {
    assert.equal(lesson.number, index + 16);
    assert.ok(lesson.title && lesson.description && lesson.icon);
    assert.equal(lesson.exercises.length, 2);
    lesson.exercises.forEach(exercise => {
      assert.ok(["multiple-choice", "fill-blank"].includes(exercise.type));
      assert.ok(exercise.question || exercise.sentence);
      assert.ok(Array.isArray(exercise.options));
      assert.equal(exercise.options.length, 3);
      assert.ok(exercise.options.includes(exercise.correctAnswer));
      assert.ok(exercise.explanation);
    });
  });
});

test("module identifiers do not overlap the original 1-15 sequence", () => {
  assert.ok(lessons.every(lesson => /^lesson_extra_\d{2}$/.test(lesson.id)));
  assert.deepEqual(lessons.map(lesson => lesson.number), Array.from({ length: 50 }, (_, i) => i + 16));
});
