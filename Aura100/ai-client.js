/*
 * Aura100 AI frontend client.
 * Safe to load in the browser: it contains no API key or private credential.
 * Include this file before script.js, then use window.Aura100AI.
 */
(function (global) {
  "use strict";

  class Aura100AIClient {
    constructor(options = {}) {
      this.basePath = options.basePath || "/api/ai";
      this.timeoutMs = options.timeoutMs || 60000;
    }

    async request(endpoint, payload) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(`${this.basePath}${endpoint}`, {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("El servidor devolvió una respuesta no válida.");
        }

        if (!response.ok) {
          const error = new Error(data?.error || "No se pudo completar la solicitud.");
          error.status = response.status;
          error.code = data?.code || "REQUEST_FAILED";
          error.details = data?.details || null;
          throw error;
        }

        return data;
      } catch (error) {
        if (error.name === "AbortError") {
          const timeoutError = new Error("La solicitud tardó demasiado. Inténtalo nuevamente.");
          timeoutError.code = "REQUEST_TIMEOUT";
          throw timeoutError;
        }
        if (error instanceof TypeError) {
          const networkError = new Error("No se pudo conectar con Aura100. Comprueba que el servidor esté funcionando.");
          networkError.code = "NETWORK_ERROR";
          throw networkError;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }

    async checkHealth() {
      try {
        const response = await fetch("/api/health", { credentials: "same-origin" });
        if (!response.ok) return { status: "error", aiConfigured: false, environment: "unknown" };
        return await response.json();
      } catch {
        return { status: "offline", aiConfigured: false, environment: "unknown" };
      }
    }

    async chat(payload) {
      const data = await this.request("/chat", payload);
      if (typeof data.reply !== "string") throw new Error("Respuesta de chat incompleta.");
      return data.reply;
    }

    async evaluateWriting(payload) {
      const data = await this.request("/writing", payload);
      if (!data.evaluation || typeof data.evaluation !== "object") {
        throw new Error("Evaluación de escritura incompleta.");
      }
      return data.evaluation;
    }

    async explainTopic(payload) {
      const data = await this.request("/explain", payload);
      if (!data.explanation || typeof data.explanation !== "object") {
        throw new Error("Explicación incompleta.");
      }
      return data.explanation;
    }

    async generateExercises(payload) {
      const data = await this.request("/exercises", payload);
      if (!data.exerciseSet || !Array.isArray(data.exerciseSet.questions)) {
        throw new Error("El conjunto de ejercicios está incompleto.");
      }
      return data.exerciseSet;
    }

    async buildVocabularyEntry(payload) {
      const data = await this.request("/vocabulary", payload);
      if (!data.vocabulary || typeof data.vocabulary !== "object") {
        throw new Error("La entrada de vocabulario está incompleta.");
      }
      return data.vocabulary;
    }

    async createLearningPlan(payload) {
      const data = await this.request("/learning-plan", payload);
      if (!data.learningPlan || typeof data.learningPlan !== "object") {
        throw new Error("El plan de aprendizaje está incompleto.");
      }
      return data.learningPlan;
    }
  }

  global.Aura100AI = new Aura100AIClient();
})(window);
