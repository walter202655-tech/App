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

    async talkStream(payload, onChunk, externalSignal) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      const abort = () => controller.abort();
      if (externalSignal) { if (externalSignal.aborted) abort(); else externalSignal.addEventListener("abort", abort, { once: true }); }
      try {
        const response = await fetch(this.basePath + "/talk", { method:"POST", credentials:"same-origin", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload), signal:controller.signal });
        if (!response.ok) { let data={}; try { data=await response.json(); } catch {} const e=new Error(data.error||"No se pudo completar la conversación."); e.status=response.status; e.code=data.code||"REQUEST_FAILED"; throw e; }
        const reader=response.body && response.body.getReader ? response.body.getReader() : null;
        if (!reader) { const text=await response.text(); if(onChunk)onChunk(text); return text.trim(); }
        const decoder=new TextDecoder(); let raw="";
        for (;;) { const part=await reader.read(); if(part.done)break; raw+=decoder.decode(part.value,{stream:true}); const cut=raw.indexOf("\\u0000"); if(onChunk)onChunk(cut<0?raw:raw.slice(0,cut)); }
        raw+=decoder.decode(); const cut=raw.indexOf("\\u0000"); const text=(cut<0?raw:raw.slice(0,cut)).trim(); const marker=cut<0?"":raw.slice(cut+1);
        if(marker==="BLOCKED"){const e=new Error("La respuesta generada no pudo mostrarse.");e.code="OUTPUT_BLOCKED";throw e;}
        if(marker==="ERROR"||!text){const e=new Error("La conversación se interrumpió. Inténtalo nuevamente.");e.code="STREAM_ERROR";throw e;}
        if(onChunk)onChunk(text); return text;
      } catch(error) { if(error.name==="AbortError"){const e=new Error("La solicitud tardó demasiado o fue cancelada.");e.code=externalSignal&&externalSignal.aborted?"REQUEST_ABORTED":"REQUEST_TIMEOUT";throw e;} throw error; }
      finally { clearTimeout(timeout); if(externalSignal)externalSignal.removeEventListener("abort",abort); }
    }

    async talkFeedback(payload) {
      const data=await this.request("/talk/feedback",payload);
      if(!data.feedback||typeof data.feedback!=="object")throw new Error("Feedback incompleto.");
      return data.feedback;
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
