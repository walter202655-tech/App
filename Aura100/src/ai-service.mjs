import OpenAI from "openai";

let client;

export function isAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "replace_with_your_private_api_key");
}

function getClient() {
  if (!isAIConfigured()) {
    const error = new Error("OPENAI_API_KEY is not configured. Copy .env.example to .env and add your private API key.");
    error.code = "AI_NOT_CONFIGURED";
    throw error;
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 60000, maxRetries: 1 });
  return client;
}

export async function moderateText(text) {
  const api = getClient();
  const result = await api.moderations.create({
    model: "omni-moderation-latest",
    input: text
  });
  return Boolean(result.results?.[0]?.flagged);
}

export async function generateText({ instructions, input, maxOutputTokens = 700 }) {
  const api = getClient();
  const response = await api.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6.1-sol",
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    store: false
  });

  if (response.status === "incomplete") {
    const error = new Error("The AI response was incomplete.");
    error.code = "INCOMPLETE_AI_RESPONSE";
    throw error;
  }
  const refusal = response.output?.some(item =>
    item.type === "message" && item.content?.some(part => part.type === "refusal")
  );
  if (refusal) {
    const error = new Error("The AI declined this request.");
    error.code = "AI_REFUSAL";
    throw error;
  }
  const output = response.output_text?.trim();
  if (!output) {
    const error = new Error("The AI service returned an empty response.");
    error.code = "EMPTY_AI_RESPONSE";
    throw error;
  }
  return output;
}

export async function generateStructured({ instructions, input, schemaName, schema, maxOutputTokens = 1400 }) {
  const api = getClient();
  const response = await api.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6.1-sol",
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    store: false,
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema
      }
    }
  });

  if (response.status === "incomplete") {
    const error = new Error("The structured AI response was incomplete.");
    error.code = "INCOMPLETE_AI_RESPONSE";
    throw error;
  }
  const refusal = response.output?.some(item =>
    item.type === "message" && item.content?.some(part => part.type === "refusal")
  );
  if (refusal) {
    const error = new Error("The AI declined this request.");
    error.code = "AI_REFUSAL";
    throw error;
  }
  const output = response.output_text?.trim();
  if (!output) {
    const error = new Error("The AI service returned an empty structured response.");
    error.code = "EMPTY_AI_RESPONSE";
    throw error;
  }

  try {
    return JSON.parse(output);
  } catch {
    const error = new Error("The AI service returned an invalid structured response.");
    error.code = "INVALID_AI_JSON";
    throw error;
  }
}
