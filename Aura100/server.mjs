import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  chatRequestSchema,
  writingRequestSchema,
  explainRequestSchema,
  exercisesRequestSchema,
  vocabularyRequestSchema,
  learningPlanRequestSchema
} from "./src/schemas.mjs";
import {
  chatInstructions,
  writingInstructions,
  explainInstructions,
  exerciseInstructions,
  vocabularyInstructions,
  learningPlanInstructions,
  SCHEMAS
} from "./src/prompts.mjs";
import { generateText, generateStructured, moderateText, isAIConfigured } from "./src/ai-service.mjs";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.resolve(__dirname, process.env.PUBLIC_DIR || ".");
const isProduction = process.env.NODE_ENV === "production";
const accessUser = process.env.APP_ACCESS_USER || "";
const accessPassword = process.env.APP_ACCESS_PASSWORD || "";

if (isProduction && (!accessUser || !accessPassword || accessPassword.length < 16)) {
  throw new Error("Production requires APP_ACCESS_USER and an APP_ACCESS_PASSWORD of at least 16 characters.");
}

app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: "32kb" }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

const generalLimiter = rateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 600000),
  limit: Number(process.env.AI_RATE_LIMIT_MAX || 20),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Has realizado demasiadas solicitudes. Espera un momento y vuelve a intentarlo." }
});

// Shared-password protection for private beta deployments.
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

if (isProduction) {
  app.use((req, res, next) => {
    if (req.path === "/api/health") return next();
    const header = req.headers.authorization || "";
    const match = header.match(/^Basic\s+(.+)$/i);
    if (!match) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Aura100", charset="UTF-8"');
      return res.status(401).send("Acceso privado. Inicia sesión para continuar.");
    }

    let credentials = "";
    try {
      credentials = Buffer.from(match[1], "base64").toString("utf8");
    } catch {
      return res.sendStatus(401);
    }

    const separator = credentials.indexOf(":");
    const user = separator >= 0 ? credentials.slice(0, separator) : "";
    const password = separator >= 0 ? credentials.slice(separator + 1) : "";
    if (!safeEqual(user, accessUser) || !safeEqual(password, accessPassword)) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Aura100", charset="UTF-8"');
      return res.status(401).send("Credenciales incorrectas.");
    }
    next();
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Aura100",
    aiConfigured: isAIConfigured(),
    environment: process.env.NODE_ENV || "development"
  });
});

// AI routes are available in production only behind the shared-password
// protection above. This is suitable for a private beta, not public multi-user
// access; add individual accounts, quotas and billing before a public launch.
app.use("/api/ai", generalLimiter);

function parseBody(schema, req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Los datos enviados no son válidos.",
      details: result.error.issues.map(issue => ({ path: issue.path.join("."), message: issue.message }))
    });
    return null;
  }
  return result.data;
}

async function rejectIfFlagged(text, res) {
  const flagged = await moderateText(text);
  if (flagged) {
    res.status(422).json({
      error: "No puedo procesar ese contenido. Reformula la solicitud como una actividad educativa segura.",
      code: "CONTENT_REVIEW_REQUIRED"
    });
    return true;
  }
  return false;
}

async function checkGeneratedOutput(text, res) {
  const flagged = await moderateText(text);
  if (flagged) {
    res.status(502).json({
      error: "La respuesta generada no pudo mostrarse. Inténtalo con otra formulación.",
      code: "OUTPUT_BLOCKED"
    });
    return true;
  }
  return false;
}

app.post("/api/ai/chat", async (req, res, next) => {
  try {
    const data = parseBody(chatRequestSchema, req, res);
    if (!data) return;

    const conversationText = [
      ...data.history.map(item => item.content),
      data.message
    ].join("\n");
    if (await rejectIfFlagged(conversationText, res)) return;

    const history = data.history.slice(-8).map(item => ({ role: item.role, content: item.content }));
    const reply = await generateText({
      instructions: chatInstructions(data.level, data.scenario),
      input: [...history, { role: "user", content: data.message }],
      maxOutputTokens: 650
    });
    if (await checkGeneratedOutput(reply, res)) return;

    res.json({ reply });
  } catch (error) { next(error); }
});

app.post("/api/ai/writing", async (req, res, next) => {
  try {
    const data = parseBody(writingRequestSchema, req, res);
    if (!data) return;
    if (await rejectIfFlagged(`${data.taskPrompt}\n${data.text}`, res)) return;

    const result = await generateStructured({
      instructions: writingInstructions(data.level, data.taskType, data.language, data.taskPrompt),
      input: `Evaluate the following student submission.\n\n${data.text}`,
      schemaName: "aura100_writing_evaluation",
      schema: SCHEMAS.writing,
      maxOutputTokens: 2200
    });
    if (await checkGeneratedOutput(JSON.stringify(result), res)) return;
    res.json({ evaluation: result });
  } catch (error) { next(error); }
});

app.post("/api/ai/explain", async (req, res, next) => {
  try {
    const data = parseBody(explainRequestSchema, req, res);
    if (!data) return;
    if (await rejectIfFlagged(`${data.topic}\n${data.question}`, res)) return;

    const result = await generateStructured({
      instructions: explainInstructions(data.level, data.language),
      input: `Explain this English topic: ${data.topic}\nLearner's question: ${data.question || "Give me a clear lesson."}`,
      schemaName: "aura100_topic_explanation",
      schema: SCHEMAS.explanation,
      maxOutputTokens: 1300
    });
    if (await checkGeneratedOutput(JSON.stringify(result), res)) return;
    res.json({ explanation: result });
  } catch (error) { next(error); }
});

app.post("/api/ai/exercises", async (req, res, next) => {
  try {
    const data = parseBody(exercisesRequestSchema, req, res);
    if (!data) return;
    if (await rejectIfFlagged(data.topic, res)) return;

    const result = await generateStructured({
      instructions: exerciseInstructions(data.level, data.skill, data.language, data.count),
      input: `Create ${data.count} new exercises about: ${data.topic}.`,
      schemaName: "aura100_exercise_set",
      schema: SCHEMAS.exercises,
      maxOutputTokens: 1800
    });
    const validQuestions = Array.isArray(result.questions)
      && result.questions.length === data.count
      && result.questions.every(question =>
        Array.isArray(question.options)
        && question.options.length === 4
        && new Set(question.options).size === 4
        && question.options.includes(question.correctAnswer)
      );
    if (!validQuestions) {
      return res.status(502).json({
        error: "El generador produjo ejercicios con un formato inconsistente. Inténtalo nuevamente.",
        code: "INVALID_EXERCISE_SET"
      });
    }
    if (await checkGeneratedOutput(JSON.stringify(result), res)) return;
    res.json({ exerciseSet: result });
  } catch (error) { next(error); }
});

app.post("/api/ai/vocabulary", async (req, res, next) => {
  try {
    const data = parseBody(vocabularyRequestSchema, req, res);
    if (!data) return;
    if (await rejectIfFlagged(`${data.word}\n${data.context}`, res)) return;

    const result = await generateStructured({
      instructions: vocabularyInstructions(data.level, data.language),
      input: `Teach the vocabulary item: ${data.word}\nContext: ${data.context || "No additional context."}`,
      schemaName: "aura100_vocabulary_entry",
      schema: SCHEMAS.vocabulary,
      maxOutputTokens: 1100
    });
    if (await checkGeneratedOutput(JSON.stringify(result), res)) return;
    res.json({ vocabulary: result });
  } catch (error) { next(error); }
});

app.post("/api/ai/learning-plan", async (req, res, next) => {
  try {
    const data = parseBody(learningPlanRequestSchema, req, res);
    if (!data) return;
    const reviewText = `${data.goal}\n${data.knownDifficulties.join("\n")}`;
    if (await rejectIfFlagged(reviewText, res)) return;

    const result = await generateStructured({
      instructions: learningPlanInstructions(data.level, data.targetLevel, data.minutesPerDay, data.language),
      input: JSON.stringify({
        goal: data.goal,
        skillScores: data.skillScores,
        knownDifficulties: data.knownDifficulties,
        minutesPerDay: data.minutesPerDay
      }),
      schemaName: "aura100_weekly_learning_plan",
      schema: SCHEMAS.learningPlan,
      maxOutputTokens: 1800
    });
    const validDays = Array.isArray(result.weeklyPlan)
      && result.weeklyPlan.length === 7
      && result.weeklyPlan.every(day =>
        Array.isArray(day.tasks)
        && day.tasks.every(task => Number.isInteger(task.minutes) && task.minutes > 0)
        && day.tasks.length >= 2
        && day.tasks.every(task => task.minutes <= data.minutesPerDay)
        && day.tasks.reduce((sum, task) => sum + task.minutes, 0) === data.minutesPerDay
      );
    if (!validDays) {
      return res.status(502).json({
        error: "El planificador produjo un horario inconsistente. Inténtalo nuevamente.",
        code: "INVALID_LEARNING_PLAN"
      });
    }
    if (await checkGeneratedOutput(JSON.stringify(result), res)) return;
    res.json({ learningPlan: result });
  } catch (error) { next(error); }
});

// Do not expose backend files when the current frontend is served from the project root.
// For deployment, prefer moving the frontend into /public and setting PUBLIC_DIR=./public.
const blockedStaticPaths = [
  /^\/server\.mjs$/i,
  /^\/package(?:-lock)?\.json$/i,
  /^\/\.env(?:\..*)?$/i,
  /^\/\.gitignore$/i,
  /^\/src(?:\/|$)/i,
  /^\/node_modules(?:\/|$)/i,
  /^\/backup[^\/]*(?:\/|$)/i,
  /\.bak$/i,
  /\.py$/i,
  /\.md$/i
];
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  if (blockedStaticPaths.some(pattern => pattern.test(req.path))) return res.sendStatus(404);
  next();
});
app.use(express.static(publicRoot, { dotfiles: "deny", index: "index.html" }));

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.use((error, _req, res, _next) => {
  const status = error?.status || (error?.code === "AI_NOT_CONFIGURED" ? 503 : 500);
  // Do not log user prompts or API keys.
  console.error("Aura100 server error:", error?.code || error?.name || "UnknownError");
  res.status(status).json({
    error: status === 503
      ? "La IA no está configurada. Revisa el archivo .env."
      : "No se pudo completar la solicitud. Inténtalo nuevamente.",
    code: isProduction ? "INTERNAL_ERROR" : (error?.code || "INTERNAL_ERROR")
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aura100 server ready on port ${PORT}`);
  console.log(`AI configured: ${isAIConfigured() ? "yes" : "no"}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
