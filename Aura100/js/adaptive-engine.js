/**
 * Aura100 v4.0 - Adaptive Learning Engine & Mistake Notebook
 * Implements deterministic quantitative competency tracking across 6 CEFR skills,
 * spaced retrieval scheduling, automatic mistake logging with deduplication,
 * multi-criteria practice recommendations, and seamless Anki SRS synchronization.
 */

(function (global) {
  "use strict";

  class AdaptiveLearningEngine {
    constructor(appInstance) {
      this.app = appInstance;
      this.storageKey = "aura100_adaptive_v4";
      this.mistakesStorageKey = "aura100_mistakes_v4";
      this.metrics = this.loadMetrics();
      this.mistakes = this.loadMistakes();
    }

    loadMetrics() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn("Could not load adaptive metrics:", e);
      }
      return this._getDefaultMetrics();
    }

    saveMetrics() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.metrics));
      } catch (e) {
        console.warn("Could not save adaptive metrics:", e);
      }
    }

    loadMistakes() {
      try {
        const raw = localStorage.getItem(this.mistakesStorageKey);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn("Could not load mistakes notebook:", e);
      }
      return [];
    }

    saveMistakes() {
      try {
        localStorage.setItem(this.mistakesStorageKey, JSON.stringify(this.mistakes));
      } catch (e) {
        console.warn("Could not save mistakes notebook:", e);
      }
      if (this.app && typeof this.app.updateHeaderAndSidebarUI === "function") {
        this.app.updateHeaderAndSidebarUI();
      }
    }

    computeCompetencies() {
      const out = {};
      Object.entries(this.metrics.skills || {}).forEach(([k, v]) => {
        out[k] = v.attempts > 0 ? v.accuracy : 0;
      });
      return out;
    }

    renderMistakesNotebook() {
      this.renderMistakeNotebook();
    }

    _getDefaultMetrics() {
      return {
        version: "4.0",
        lastUpdated: new Date().toISOString(),
        skills: {
          grammar: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" },
          vocabulary: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" },
          reading: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" },
          listening: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" },
          writing: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" },
          speaking: { attempts: 0, correct: 0, accuracy: 0, estimatedCefr: "B1", status: "evaluating" }
        },
        topics: {}, // e.g. "Present Perfect": { attempts: 12, correct: 9, accuracy: 75, lastPracticed: ..., difficulty: 'B1', masteryStatus: 'learning' }
        overallAccuracy: 0,
        totalActivitiesCompleted: 0
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1. ACTIVITY & MASTERY RECORDING
    // ──────────────────────────────────────────────────────────────────────────
    recordActivity({ skill, topic, difficulty = "B1", isCorrect, userAnswer = "", correctAnswer = "", score = null }) {
      const validSkill = this.metrics.skills[skill] ? skill : "grammar";
      const sData = this.metrics.skills[validSkill];

      sData.attempts++;
      if (isCorrect) sData.correct++;
      sData.accuracy = Math.round((sData.correct / sData.attempts) * 100);

      // Topic metrics
      const tKey = (topic || "General").trim();
      if (!this.metrics.topics[tKey]) {
        this.metrics.topics[tKey] = {
          skill: validSkill,
          difficulty,
          attempts: 0,
          correct: 0,
          accuracy: 0,
          recentMistakes: 0,
          lastPracticed: Date.now(),
          consecutiveCorrect: 0,
          masteryStatus: "learning"
        };
      }

      const tData = this.metrics.topics[tKey];
      tData.attempts++;
      tData.lastPracticed = Date.now();
      tData.difficulty = difficulty;

      if (isCorrect) {
        tData.correct++;
        tData.consecutiveCorrect = (tData.consecutiveCorrect || 0) + 1;
        tData.recentMistakes = Math.max(0, (tData.recentMistakes || 0) - 1);
        // Check if any pending mistake for this topic can be advanced
        this._handleMistakeSuccess(tKey);
      } else {
        tData.consecutiveCorrect = 0;
        tData.recentMistakes = (tData.recentMistakes || 0) + 1;
      }

      tData.accuracy = Math.round((tData.correct / tData.attempts) * 100);

      // Deterministic Mastery Status calculation
      if (tData.attempts >= 8 && tData.accuracy >= 85 && tData.consecutiveCorrect >= 3) {
        tData.masteryStatus = "mastered";
      } else if (tData.attempts >= 4 && tData.accuracy >= 65) {
        tData.masteryStatus = "reviewing";
      } else if (tData.attempts >= 1) {
        tData.masteryStatus = "learning";
      } else {
        tData.masteryStatus = "new";
      }

      // Update global metrics
      this.metrics.totalActivitiesCompleted = (this.metrics.totalActivitiesCompleted || 0) + 1;
      let totalAtt = 0, totalCorr = 0;
      Object.values(this.metrics.skills).forEach(s => {
        totalAtt += s.attempts;
        totalCorr += s.correct;
      });
      this.metrics.overallAccuracy = totalAtt > 0 ? Math.round((totalCorr / totalAtt) * 100) : 0;
      this.metrics.lastUpdated = new Date().toISOString();

      this.saveMetrics();
      if (this.app) this.app.renderDashboard();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. MISTAKE NOTEBOOK (CUADERNO DE ERRORES)
    // ──────────────────────────────────────────────────────────────────────────
    recordMistake({ sourceModule, skill, topic, userAnswer, correctAnswer, explanation }) {
      const cleanTopic = (topic || "General").trim();
      const existing = this.mistakes.find(m => 
        m.topic.toLowerCase() === cleanTopic.toLowerCase() &&
        m.correctAnswer.toLowerCase() === (correctAnswer || "").toLowerCase()
      );

      const today = new Date().toISOString().split("T")[0];

      if (existing) {
        existing.frequency = (existing.frequency || 1) + 1;
        existing.userAnswer = userAnswer;
        existing.timestamp = Date.now();
        existing.status = "pending";
        existing.consecutiveSuccesses = 0;
        existing.nextReviewDate = today;
      } else {
        const mistake = {
          id: `mst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sourceModule: sourceModule || "Practice",
          skill: skill || "grammar",
          topic: cleanTopic,
          userAnswer: userAnswer || "Sin respuesta",
          correctAnswer: correctAnswer || "",
          explanation: explanation || "Revisa la estructura para reforzar la precisión.",
          timestamp: Date.now(),
          frequency: 1,
          status: "pending", // 'pending' | 'reviewing' | 'mastered'
          consecutiveSuccesses: 0,
          nextReviewDate: today
        };
        this.mistakes.unshift(mistake);
      }

      this.saveMistakes();
      this.renderMistakeNotebook();
    }

    _handleMistakeSuccess(topic) {
      const pendingForTopic = this.mistakes.filter(m => 
        m.topic.toLowerCase() === topic.toLowerCase() && m.status !== "mastered"
      );

      pendingForTopic.forEach(m => {
        m.consecutiveSuccesses = (m.consecutiveSuccesses || 0) + 1;
        if (m.consecutiveSuccesses >= 2) {
          m.status = "mastered";
          m.masteredDate = new Date().toISOString();
        } else {
          m.status = "reviewing";
          // Schedule next review in 3 days
          const d = new Date();
          d.setDate(d.getDate() + 3);
          m.nextReviewDate = d.toISOString().split("T")[0];
        }
      });

      if (pendingForTopic.length > 0) this.saveMistakes();
    }

    exportMistakesToAnki() {
      if (!this.app || !this.app.state || !Array.isArray(this.app.state.ankiDeck)) return 0;

      const pending = this.mistakes.filter(m => m.status !== "mastered");
      let addedCount = 0;

      pending.forEach(m => {
        const exists = this.app.state.ankiDeck.some(
          c => c.front.toLowerCase() === m.correctAnswer.toLowerCase() ||
               c.explanation.includes(m.id)
        );

        if (!exists && m.correctAnswer) {
          this.app.state.ankiDeck.unshift({
            id: `anki_mst_${m.id}`,
            front: `[Repaso de Error] ¿Cómo se dice o completa correctamente: "${m.topic}"?`,
            back: m.correctAnswer,
            level: this.app.state.targetCefr || "B1",
            phonetic: "",
            example: `Tu respuesta previa: "${m.userAnswer}"`,
            exampleEs: m.explanation,
            explanation: `Cuaderno de Errores (${m.skill}) • ${m.sourceModule}`,
            tag: "Cuaderno de Errores ⚠️",
            repetitions: 0,
            interval: 0,
            easeFactor: 2.2,
            dueDate: new Date().toISOString().split("T")[0],
            state: "learning"
          });
          addedCount++;
        }
      });

      if (addedCount > 0) {
        this.app.saveState();
        this.app.showToast(`🧠 ${addedCount} tarjetas de errores añadidas a Anki SRS.`, "purple");
      } else {
        this.app.showToast("Todos tus errores pendientes ya están en tu mazo Anki.", "info");
      }

      return addedCount;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. ADAPTIVE RECOMMENDATION ENGINE
    // ──────────────────────────────────────────────────────────────────────────
    getNextRecommendation() {
      const topicsList = Object.entries(this.metrics.topics);
      const pendingMistakes = this.mistakes.filter(m => m.status === "pending");

      // Priority 1: High frequency pending mistakes
      if (pendingMistakes.length >= 3) {
        return {
          type: "mistake_review",
          title: "Cuaderno de Errores: Sesión Prioritaria",
          reason: `Tienes ${pendingMistakes.length} errores pendientes identificados en tus actividades recientes.`,
          skill: pendingMistakes[0].skill,
          actionLabel: "Repasar Errores",
          actionView: "mistakes"
        };
      }

      // Priority 2: Low accuracy topics (< 60%) with at least 3 attempts
      const weakTopics = topicsList.filter(([_, data]) => data.attempts >= 3 && data.accuracy < 60);
      if (weakTopics.length > 0) {
        weakTopics.sort((a, b) => a[1].accuracy - b[1].accuracy);
        const [topName, topData] = weakTopics[0];
        return {
          type: "weakness_focus",
          title: `Refuerzo: ${topName}`,
          reason: `Tu precisión actual en este tema es del ${topData.accuracy}% (${topData.correct}/${topData.attempts} aciertos).`,
          skill: topData.skill,
          actionLabel: "Practicar Ahora",
          actionView: "modules",
          topic: topName
        };
      }

      // Priority 3: Skill with lowest practice attempts
      const skillEntries = Object.entries(this.metrics.skills);
      skillEntries.sort((a, b) => a[1].attempts - b[1].attempts);
      const [leastSkill, leastData] = skillEntries[0];

      const skillMap = {
        grammar: { view: "modules", name: "Grammar Lab" },
        vocabulary: { view: "word-bank", name: "Word Bank" },
        reading: { view: "modules", name: "Reading Lab" },
        listening: { view: "modules", name: "Listening Lab" },
        writing: { view: "modules", name: "Writing Studio" },
        speaking: { view: "chatbot", name: "AI Conversation Partner" }
      };

      const target = skillMap[leastSkill] || { view: "lessons", name: "Ruta A1-C2" };
      return {
        type: "balance_skills",
        title: `Desarrollo Integral: ${target.name}`,
        reason: `Es tu habilidad con menor tiempo de práctica reciente (${leastData.attempts} ejercicios registrados).`,
        skill: leastSkill,
        actionLabel: `Ir a ${target.name}`,
        actionView: target.view
      };
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. MISTAKE NOTEBOOK UI RENDERING
    // ──────────────────────────────────────────────────────────────────────────
    renderMistakeNotebook() {
      const container = document.getElementById("mistakes-notebook-list");
      const countEl = document.getElementById("mistakes-pending-count");
      const masteredEl = document.getElementById("mistakes-mastered-count");

      if (!container) return;

      const pending = this.mistakes.filter(m => m.status !== "mastered");
      const mastered = this.mistakes.filter(m => m.status === "mastered");

      if (countEl) countEl.textContent = pending.length;
      if (masteredEl) masteredEl.textContent = mastered.length;

      if (this.mistakes.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <span class="empty-icon">🛡️</span>
            <h4>¡Cuaderno de Errores Limpio!</h4>
            <p>No tienes errores pendientes. Cuando falles en una lección o quiz, se registrará aquí hasta que lo consolides con 2 aciertos consecutivos.</p>
            <button type="button" class="btn btn-primary btn-sm" style="margin-top:0.85rem" onclick="app.navigate('lessons')">Ir a Lecciones →</button>
          </div>
        `;
        return;
      }

      container.innerHTML = "";

      this.mistakes.forEach(m => {
        const item = document.createElement("div");
        item.className = `mistake-notebook-item ${m.status}`;

        const isPending = m.status !== "mastered";
        const successes = Math.min(2, m.consecutiveSuccesses || 0);
        const dateStr = new Date(m.timestamp).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

        item.innerHTML = `
          <div class="mst-header-row">
            <span class="mst-skill-badge ${m.skill}">${m.skill.toUpperCase()}</span>
            <span class="mst-topic-tag">${m.topic}</span>
            <span class="mst-status-pill ${m.status}">${m.status === "mastered" ? "✅ Consolidado (2/2)" : (m.status === "reviewing" ? `🔄 En Revisión (${successes}/2)` : `⏳ Pendiente (${successes}/2)`)}</span>
            <span class="mst-freq-tag">Frecuencia: ${m.frequency}x</span>
            <span class="mst-date-tag">${dateStr}</span>
          </div>
          <div class="mst-body-row">
            <div class="mst-user-ans"><strong>Tu respuesta:</strong> <span class="strike">${m.userAnswer}</span></div>
            <div class="mst-corr-ans"><strong>Solución correcta:</strong> <span>${m.correctAnswer}</span></div>
            <div class="mst-expl"><strong>💡 Explicación didáctica:</strong> ${m.explanation}</div>
          </div>
          <div class="mst-actions-row">
            <span class="mst-module-tag">Módulo: ${m.sourceModule}</span>
            ${isPending ? `<button class="btn btn-secondary btn-sm" onclick='app.adaptiveEngine.markMistakeResolved("${m.id}")'>✓ Marcar repasado (${successes}/2)</button>` : ""}
            <button class="btn btn-ghost btn-sm" onclick='app.adaptiveEngine.deleteMistake("${m.id}")' title="Eliminar" aria-label="Eliminar error">🗑️</button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    markMistakeResolved(id) {
      const mistake = this.mistakes.find(m => m.id === id);
      if (mistake) {
        mistake.consecutiveSuccesses = (mistake.consecutiveSuccesses || 0) + 1;
        if (mistake.consecutiveSuccesses >= 2) {
          mistake.status = "mastered";
          mistake.masteredDate = new Date().toISOString();
        } else {
          mistake.status = "reviewing";
        }
        this.saveMistakes();
        this.renderMistakeNotebook();
        if (this.app) this.app.showToast("Progreso registrado en el Cuaderno de Errores.", "cyan");
      }
    }

    deleteMistake(id) {
      this.mistakes = this.mistakes.filter(m => m.id !== id);
      this.saveMistakes();
      this.renderMistakeNotebook();
    }
  }

  global.AdaptiveLearningEngine = AdaptiveLearningEngine;
})(window);
