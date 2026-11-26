import test from "node:test";
import assert from "node:assert/strict";
import {
  chatRequestSchema,
  writingRequestSchema,
  explainRequestSchema,
  exercisesRequestSchema,
  vocabularyRequestSchema,
  learningPlanRequestSchema
} from "../src/schemas.mjs";

test("chat schema accepts a valid message and supplies defaults", () => {
  const result = chatRequestSchema.parse({ message: "Hello, how are you?" });
  assert.equal(result.level, "B1");
  assert.equal(result.scenario, "free");
  assert.deepEqual(result.history, []);
});

test("chat schema rejects empty messages and unexpected properties", () => {
  assert.equal(chatRequestSchema.safeParse({ message: " " }).success, false);
  assert.equal(chatRequestSchema.safeParse({ message: "Hello", isAdmin: true }).success, false);
});

test("writing schema enforces minimum text length and CEFR levels", () => {
  assert.equal(writingRequestSchema.safeParse({ text: "Too short" }).success, false);
  assert.equal(writingRequestSchema.safeParse({ text: "This is a sufficiently long student writing sample." }).success, true);
  assert.equal(writingRequestSchema.safeParse({ text: "This is a sufficiently long student writing sample.", level: "C7" }).success, false);
});

test("explanation and exercise schemas validate bounded requests", () => {
  assert.equal(explainRequestSchema.safeParse({ topic: "Present perfect" }).success, true);
  assert.equal(explainRequestSchema.safeParse({ topic: "x" }).success, false);
  assert.equal(exercisesRequestSchema.safeParse({ topic: "Conditionals", count: 5 }).success, true);
  assert.equal(exercisesRequestSchema.safeParse({ topic: "Conditionals", count: 50 }).success, false);
});

test("vocabulary schema rejects empty and oversized terms", () => {
  assert.equal(vocabularyRequestSchema.safeParse({ word: "resilient" }).success, true);
  assert.equal(vocabularyRequestSchema.safeParse({ word: "" }).success, false);
  assert.equal(vocabularyRequestSchema.safeParse({ word: "x".repeat(101) }).success, false);
});

test("learning plan schema validates study time and goals", () => {
  const valid = {
    minutesPerDay: 30,
    goal: "Improve my English communication skills"
  };
  assert.equal(learningPlanRequestSchema.safeParse(valid).success, true);
  assert.equal(learningPlanRequestSchema.safeParse({ ...valid, minutesPerDay: 500 }).success, false);
  assert.equal(learningPlanRequestSchema.safeParse({ ...valid, goal: "ok" }).success, false);
});
