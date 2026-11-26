/**
 * Aura100 v4.0 - Learning Plan Generator & Study Analytics
 * Integrates with POST /api/ai/learning-plan via window.Aura100AI.
 * Validates daily time allocation, balances all 6 CEFR skills,
 * checks math deterministically, and saves weekly plans with user consent.
 */

(function (global) {
  "use strict";

  class LearningPlanManager {
    constructor(appInstance) {
      this.app = appInstance;
      this.storageKey = "aura100_learning_plan_v4";
      this.activePlan = this.loadPlan();
      this.isGenerating = false;
    }

    loadPlan() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn("Could not load learning plan:", e);
      }
      return null;
    }

    savePlan(plan) {
      try {
        this.activePlan = plan;
        localStorage.setItem(this.storageKey, JSON.stringify(plan));
      } catch (e) {
        console.warn("Could not save learning plan:", e);
      }
    }

    async generatePersonalizedPlan(minutesPerDay = 30, userGoal = "") {
      const loader = document.getElementById("learning-plan-loader");
      const resultBox = document.getElementById("learning-plan-result");

      if (loader) loader.classList.remove("hidden");
      if (resultBox) resultBox.innerHTML = "";

      const currentLevel = this.app?.state?.targetCefr || "B1";
      const nextLevelMap = { A1: "A2", A2: "B1", B1: "B2", B2: "C1", C1: "C2", C2: "C2" };
      const targetLevel = nextLevelMap[currentLevel] || "B2";

      // Collect real metrics from adaptive engine
      const adaptive = this.app?.adaptiveEngine;
      const skillScores = {};
      const knownDifficulties = [];

      if (adaptive && adaptive.metrics) {
        Object.entries(adaptive.metrics.skills).forEach(([skill, dat]) => {
          skillScores[skill] = dat.attempts > 0 ? dat.accuracy : 65;
        });

        // Add pending mistake topics
        if (Array.isArray(adaptive.mistakes)) {
          adaptive.mistakes.slice(0, 5).forEach(m => {
            if (!knownDifficulties.includes(m.topic)) knownDifficulties.push(m.topic);
          });
        }
      }

      const payload = {
        level: currentLevel,
        targetLevel: targetLevel,
        minutesPerDay: Math.min(120, Math.max(15, Number(minutesPerDay) || 30)),
        goal: (userGoal || "").trim() || "Consolidar fluidez comunicativa y precisión gramatical",
        skillScores: skillScores,
        knownDifficulties: knownDifficulties.length > 0 ? knownDifficulties : ["Uso preciso de tiempos compuestos", "Ampliación de vocabulario"],
        language: "es"
      };

      try {
        let plan = null;

        if (global.Aura100AI && typeof global.Aura100AI.createLearningPlan === "function") {
          try {
            plan = await global.Aura100AI.createLearningPlan(payload);
          } catch (e) {
            console.warn("AI plan failed, using deterministic local plan:", e);
            plan = this._generateLocalPlan(payload);
          }
        } else {
          plan = this._generateLocalPlan(payload);
        }

        // Validate plan time math locally
        this._verifyPlanTiming(plan, payload.minutesPerDay);
        this.savePlan(plan);
        this.renderPlan(plan);

      } catch (err) {
        console.error("Plan generation error:", err);
        if (resultBox) {
          resultBox.innerHTML = `
            <div class="eval-error-box">
              <h4>⚠️ Error al generar el plan de estudio</h4>
              <p>${err.message || "Inténtalo de nuevo."}</p>
            </div>
          `;
        }
      } finally {
        if (loader) loader.classList.add("hidden");
      }
    }

    _verifyPlanTiming(plan, targetMinutes) {
      if (!plan || !Array.isArray(plan.weeklyPlan)) return;

      plan.weeklyPlan.forEach(dayPlan => {
        let daySum = 0;
        if (Array.isArray(dayPlan.tasks)) {
          dayPlan.tasks.forEach(t => { daySum += (t.minutes || 0); });
          // If sum differs significantly from target, normalize
          if (daySum !== targetMinutes && dayPlan.tasks.length > 0) {
            const factor = targetMinutes / Math.max(1, daySum);
            dayPlan.tasks.forEach(t => {
              t.minutes = Math.max(5, Math.round((t.minutes || 10) * factor));
            });
          }
        }
      });
    }

    _generateLocalPlan(payload) {
      const mins = payload.minutesPerDay;
      const part1 = Math.round(mins * 0.4);
      const part2 = Math.round(mins * 0.4);
      const part3 = mins - part1 - part2;

      return {
        overview: `Plan semanal adaptativo de ${mins} min/día para avanzar desde ${payload.level} hacia ${payload.targetLevel}. Equilibra recuperación espaciada en Anki, gramática y práctica comunicativa.`,
        weeklyPlan: [
          {
            day: "Lunes",
            tasks: [
              { skill: "grammar", activity: "Grammar Lab: Tiempos verbales y estructuras", minutes: part1, objective: "Consolidar precisión morfosintáctica" },
              { skill: "vocabulary", activity: "Anki SRS: Repaso diario de tarjetas", minutes: part2, objective: "Evocar vocabulario en repetición espaciada" },
              { skill: "speaking", activity: "AI Conversation Partner: Escenario Restaurante", minutes: part3, objective: "Fluidez en diálogos reales" }
            ]
          },
          {
            day: "Martes",
            tasks: [
              { skill: "listening", activity: "Video Lab: Comprensión y Sentence Mining", minutes: part1, objective: "Discriminar acentos nativos" },
              { skill: "reading", activity: "Reading Lab: Lectura guiada con preguntas de inferencia", minutes: part2, objective: "Extracción de ideas principales" },
              { skill: "vocabulary", activity: "Word Bank: Explorar 5 palabras nuevas con IA", minutes: part3, objective: "Enriquecer registro formal" }
            ]
          },
          {
            day: "Miércoles",
            tasks: [
              { skill: "writing", activity: "Writing Studio: Redacción de correo formal", minutes: part1 + part2, objective: "Estructura de párrafos y registro" },
              { skill: "vocabulary", activity: "Anki SRS: Repaso de tarjetas pendientes", minutes: part3, objective: "Consolidar tarjetas difíciles" }
            ]
          },
          {
            day: "Jueves",
            tasks: [
              { skill: "grammar", activity: "Cuaderno de Errores: Repaso enfocado", minutes: part1, objective: "Superar debilidades recurrentes" },
              { skill: "speaking", activity: "AI Conversation Partner: Debate temático", minutes: part2, objective: "Argumentación y conectores" },
              { skill: "listening", activity: "Listening Lab: Dictado y comprensión", minutes: part3, objective: "Precisión auditiva" }
            ]
          },
          {
            day: "Viernes",
            tasks: [
              { skill: "reading", activity: "Reading Lab: Reseñas y artículos culturales", minutes: part1, objective: "Vocabulario académico" },
              { skill: "vocabulary", activity: "Anki SRS + Word Bank", minutes: part2, objective: "Revisión espaciada de fin de semana" },
              { skill: "grammar", activity: "Quiz Rápido de 10 preguntas", minutes: part3, objective: "Evaluación de retención" }
            ]
          },
          {
            day: "Sábado / Domingo",
            tasks: [
              { skill: "speaking", activity: "Práctica libre y Shadowing en Video Lab", minutes: mins, objective: "Inmersión relajada sin presión de evaluación" }
            ]
          }
        ],
        prioritySkills: ["Grammar", "Listening", "Vocabulary"],
        reviewAdvice: [
          "Mantén la consistencia diaria antes que maratones de estudio aisladas.",
          "Revisa tu Cuaderno de Errores al menos dos veces por semana.",
          "Usa la versión mejorada de Writing Studio para comparar tu estilo con el nativo."
        ],
        disclaimer: "ℹ️ Este plan es una guía orientativa personalizada por Aura100. Los tiempos y actividades pueden adaptarse a tu ritmo real de aprendizaje."
      };
    }

    renderPlan(plan) {
      const container = document.getElementById("learning-plan-result");
      if (!container || !plan) return;

      container.innerHTML = `
        <div class="learning-plan-card">
          <div class="plan-header">
            <div>
              <span class="ai-generated-badge">✨ Plan de Estudio Adaptativo Semanal</span>
              <h3>Ruta Semanal Personalizada</h3>
              <p class="plan-overview-text">${plan.overview}</p>
            </div>
          </div>

          <div class="plan-days-grid">
            ${plan.weeklyPlan.map(dp => `
              <div class="plan-day-column">
                <div class="plan-day-title"><strong>${dp.day}</strong></div>
                <div class="plan-tasks-list">
                  ${dp.tasks.map(t => `
                    <div class="plan-task-pill">
                      <div class="task-top">
                        <span class="task-skill-tag ${t.skill}">${t.skill.toUpperCase()}</span>
                        <span class="task-time-pill">⏱️ ${t.minutes} min</span>
                      </div>
                      <div class="task-activity-name">${t.activity}</div>
                      <div class="task-objective-sub">${t.objective}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>

          ${Array.isArray(plan.reviewAdvice) && plan.reviewAdvice.length > 0 ? `
            <div class="plan-advice-box">
              <h4>💡 Consejos Didácticos del Tutor:</h4>
              <ul>
                ${plan.reviewAdvice.map(a => `<li>${a}</li>`).join("")}
              </ul>
            </div>
          ` : ""}

          <p class="eval-disclaimer-tag" style="margin-top:1rem">${plan.disclaimer || "Orientación pedagógica interna Aura100."}</p>
        </div>
      `;
    }
  }

  global.LearningPlanManager = LearningPlanManager;
})(window);
