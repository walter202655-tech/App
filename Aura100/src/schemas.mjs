import { z } from "zod";

export const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  level: cefrLevelSchema.default("B1"),
  scenario: z.enum(["free", "restaurant", "hotel", "directions", "job", "friends", "academic_debate", "presentation", "cambridge_exam", "study_coach"]).default("free"),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(1500)
  })).max(10).default([])
}).strict();

export const writingRequestSchema = z.object({
  text: z.string().trim().min(30).max(10000),
  taskType: z.enum(["essay", "article", "report", "review", "email", "letter", "summary", "other"]).default("essay"),
  level: cefrLevelSchema.default("B2"),
  taskPrompt: z.string().trim().max(1500).default(""),
  language: z.enum(["es", "en"]).default("es")
}).strict();

export const explainRequestSchema = z.object({
  topic: z.string().trim().min(2).max(180),
  question: z.string().trim().max(1200).default(""),
  level: cefrLevelSchema.default("B1"),
  language: z.enum(["es", "en"]).default("es")
}).strict();

export const exercisesRequestSchema = z.object({
  topic: z.string().trim().min(2).max(180),
  skill: z.enum(["grammar", "vocabulary", "reading", "use_of_english"]).default("grammar"),
  level: cefrLevelSchema.default("B1"),
  count: z.number().int().min(3).max(10).default(5),
  language: z.enum(["es", "en"]).default("es")
}).strict();

export const vocabularyRequestSchema = z.object({
  word: z.string().trim().min(1).max(100),
  context: z.string().trim().max(500).default(""),
  level: cefrLevelSchema.default("B2"),
  language: z.enum(["es", "en"]).default("es")
}).strict();

export const learningPlanRequestSchema = z.object({
  level: cefrLevelSchema.default("B1"),
  targetLevel: cefrLevelSchema.default("B2"),
  minutesPerDay: z.number().int().min(10).max(120).default(30),
  goal: z.string().trim().min(3).max(500),
  skillScores: z.object({
    grammar: z.number().min(0).max(100).optional(),
    vocabulary: z.number().min(0).max(100).optional(),
    reading: z.number().min(0).max(100).optional(),
    listening: z.number().min(0).max(100).optional(),
    writing: z.number().min(0).max(100).optional(),
    speaking: z.number().min(0).max(100).optional()
  }).default({}),
  knownDifficulties: z.array(z.string().trim().max(120)).max(12).default([]),
  language: z.enum(["es", "en"]).default("es")
}).strict();
