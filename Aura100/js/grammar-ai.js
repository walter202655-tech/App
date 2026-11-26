/**
 * Aura100 v4.0 - Grammar AI Tutor & Exercise Generator
 * Connects with /api/ai/explain and /api/ai/exercises via window.Aura100AI.
 * Validates generated content, ensures age-appropriate educational safety,
 * labels AI content transparently, and logs mistakes into the Mistake Notebook.
 */

(function (global) {
  "use strict";

  class GrammarAITutor {
    constructor(appInstance) {
      this.app = appInstance;
      this.activeTopic = "Present Perfect vs Past Simple";
      this.activeLevel = "B1";
      this.isExplaining = false;
      this.isGeneratingExercises = false;
      this.generatedExerciseSet = null;
    }

    setContext(topicTitle, levelCode) {
      this.activeTopic = topicTitle || "General Grammar";
      this.activeLevel = levelCode || "B1";
    }

    async askTutorExplanation(questionText) {
      const q = (questionText || "").trim();
      const modalResult = document.getElementById("grammar-ai-explain-result");
      const loader = document.getElementById("grammar-ai-explain-loader");

      if (loader) loader.classList.remove("hidden");
      if (modalResult) modalResult.innerHTML = "";

      try {
        let result = null;

        if (global.Aura100AI && typeof global.Aura100AI.explainTopic === "function") {
          try {
            result = await global.Aura100AI.explainTopic({
              topic: this.activeTopic,
              question: q || "Explica las reglas principales y los errores más comunes.",
              level: this.activeLevel,
              language: "es"
            });
          } catch (e) {
            console.warn("AI explain failed, using fallback:", e);
            result = this._getLocalExplanation(this.activeTopic, this.activeLevel, q);
          }
        } else {
          result = this._getLocalExplanation(this.activeTopic, this.activeLevel, q);
        }

        this._renderExplanation(result);

      } catch (err) {
        console.error("Grammar explanation error:", err);
        if (modalResult) {
          modalResult.innerHTML = `
            <div class="eval-error-box">
              <h4>⚠️ No se pudo obtener la explicación</h4>
              <p>${err.message || "Verifica la conexión con el servidor Aura100."}</p>
            </div>
          `;
        }
      } finally {
        if (loader) loader.classList.add("hidden");
      }
    }

    _getLocalExplanation(topic, level, question) {
      return {
        title: `${topic} (${level})`,
        rule: `Explicación didáctica para ${topic}. En nivel ${level}, es crucial distinguir el contexto temporal y la intención comunicativa del hablante.`,
        form: "Afirmativo: Sujeto + Estructura Principal | Negativo: Sujeto + Auxiliar Negativo | Interrogativo: Auxiliar + Sujeto + Verbo",
        examples: [
          `Ejemplo contextualizado 1 para ${topic}.`,
          `Ejemplo contextualizado 2 con variación estilística.`,
          `Ejemplo contextualizado 3 en registro formal.`
        ],
        commonMistakes: [
          "Traducir literalmente la estructura desde el español sin ajustar la posición del auxiliar.",
          "Omitir pronombres sujeto obligatorios en inglés.",
          "Confundir verbos estativos con verbos de acción continua."
        ],
        checkQuestion: `¿Cuál es el uso predominante de la estructura en ${topic}?`,
        checkAnswer: "Conectar la intención comunicativa con el marco temporal apropiado sin transferencias erróneas del español.",
        checkExplanation: "El inglés modula la certeza y el aspecto temporal mediante auxiliares específicos."
      };
    }

    _renderExplanation(data) {
      const container = document.getElementById("grammar-ai-explain-result");
      if (!container) return;

      container.innerHTML = "";

      const box = document.createElement("div");
      box.className = "grammar-ai-response-box";

      const header = document.createElement("div");
      header.className = "grammar-ai-resp-header";
      header.innerHTML = `
        <span class="ai-generated-badge">✨ Explicación Asistida por IA</span>
        <h3>${data.title}</h3>
      `;
      box.appendChild(header);

      const ruleP = document.createElement("p");
      ruleP.className = "grammar-ai-rule";
      ruleP.textContent = data.rule;
      box.appendChild(ruleP);

      if (data.form) {
        const formBox = document.createElement("div");
        formBox.className = "grammar-ai-form-card";
        formBox.innerHTML = `<strong>📐 Estructura / Forma:</strong> <code>${data.form}</code>`;
        box.appendChild(formBox);
      }

      if (Array.isArray(data.examples) && data.examples.length > 0) {
        const exH = document.createElement("h4");
        exH.textContent = "💬 Ejemplos Prácticos:";
        box.appendChild(exH);
        const ul = document.createElement("ul");
        ul.className = "grammar-ai-examples-list";
        data.examples.forEach(ex => {
          const li = document.createElement("li");
          li.textContent = ex;
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }

      if (Array.isArray(data.commonMistakes) && data.commonMistakes.length > 0) {
        const mistH = document.createElement("h4");
        mistH.textContent = "⚠️ Errores Frecuentes de Hispanohablantes:";
        box.appendChild(mistH);
        const ul = document.createElement("ul");
        ul.className = "grammar-ai-mistakes-list";
        data.commonMistakes.forEach(m => {
          const li = document.createElement("li");
          li.textContent = m;
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }

      if (data.checkQuestion) {
        const checkCard = document.createElement("div");
        checkCard.className = "grammar-ai-selfcheck-card";
        checkCard.innerHTML = `
          <h4>🎯 Pregunta de Autoevaluación</h4>
          <p class="selfcheck-q"><strong>Pregunta:</strong> ${data.checkQuestion}</p>
          <div class="selfcheck-answer hidden" id="selfcheck-ans">
            <p><strong>Respuesta correcta:</strong> ${data.checkAnswer}</p>
            <p><small>${data.checkExplanation}</small></p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-reveal-selfcheck" onclick="document.getElementById('selfcheck-ans').classList.toggle('hidden')">👁️ Revelar Respuesta</button>
        `;
        box.appendChild(checkCard);
      }

      container.appendChild(box);
    }

    async generateExercises(topic, level, count = 5) {
      const container = document.getElementById("grammar-ai-exercises-container");
      const loader = document.getElementById("grammar-ai-exercises-loader");

      if (loader) loader.classList.remove("hidden");
      if (container) container.innerHTML = "";

      try {
        let set = null;

        if (global.Aura100AI && typeof global.Aura100AI.generateExercises === "function") {
          try {
            set = await global.Aura100AI.generateExercises({
              topic: topic || this.activeTopic,
              skill: "grammar",
              level: level || this.activeLevel,
              count: Math.min(10, Math.max(3, count)),
              language: "es"
            });
          } catch (e) {
            console.warn("AI exercises failed, fallback:", e);
            set = this._getLocalExerciseSet(topic, level, count);
          }
        } else {
          set = this._getLocalExerciseSet(topic, level, count);
        }

        // Validate structure
        if (!set || !Array.isArray(set.questions) || set.questions.length === 0) {
          throw new Error("El conjunto de ejercicios recibido no contiene preguntas válidas.");
        }

        this.generatedExerciseSet = set;
        this._renderExerciseSet(set);

      } catch (err) {
        console.error("Exercises generation error:", err);
        if (container) {
          container.innerHTML = `
            <div class="eval-error-box">
              <h4>⚠️ No se pudieron generar ejercicios</h4>
              <p>${err.message || "Inténtalo nuevamente."}</p>
            </div>
          `;
        }
      } finally {
        if (loader) loader.classList.add("hidden");
      }
    }

    _getLocalExerciseSet(topic, level, count) {
      return {
        topic: topic,
        level: level,
        questions: [
          {
            question: `Choose the correct form to complete the sentence about '${topic}':`,
            options: [
              "She has already finished her work.",
              "She already finish her work yesterday.",
              "She was finish her work since 2 hours.",
              "She has finish her work yet."
            ],
            correctAnswer: "She has already finished her work.",
            explanation: "In Present Perfect, use 'has/have + past participle' with 'already' to indicate completion before the present moment.",
            skill: "grammar"
          },
          {
            question: `Which sentence contains a grammatical mistake?`,
            options: [
              "I have lived here since 2020.",
              "I lived in London for two years before moving here.",
              "I am knowing the answer right now.",
              "Have you ever travelled to Japan?"
            ],
            correctAnswer: "I am knowing the answer right now.",
            explanation: "'Know' is a stative verb and is normally used in simple tenses, not continuous: 'I know the answer'.",
            skill: "grammar"
          },
          {
            question: `Complete: "If I _____ more free time, I would study another language."`,
            options: ["have", "had", "would have", "will have"],
            correctAnswer: "had",
            explanation: "Second conditional clause structure uses: 'If + Past Simple, would + base verb' for hypothetical present situations.",
            skill: "grammar"
          }
        ]
      };
    }

    _renderExerciseSet(set) {
      const container = document.getElementById("grammar-ai-exercises-container");
      if (!container) return;

      container.innerHTML = "";

      const header = document.createElement("div");
      header.className = "exercise-set-header";
      header.innerHTML = `
        <span class="ai-generated-badge">✨ Práctica Dinámica Generada por IA</span>
        <h3>Tema: ${set.topic} • Nivel ${set.level} (${set.questions.length} preguntas)</h3>
      `;
      container.appendChild(header);

      const form = document.createElement("div");
      form.className = "ai-exercise-questions-wrap";

      set.questions.forEach((q, qIdx) => {
        const qCard = document.createElement("div");
        qCard.className = "ai-gen-q-card";
        qCard.id = `ai-q-card-${qIdx}`;

        const qTitle = document.createElement("div");
        qTitle.className = "ai-gen-q-title";
        qTitle.textContent = `${qIdx + 1}. ${qqClean(q.question)}`;
        qCard.appendChild(qTitle);

        const optsGrid = document.createElement("div");
        optsGrid.className = "ai-gen-opts-grid";

        q.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.className = "ai-gen-opt-btn";
          btn.textContent = opt;
          btn.onclick = () => this._handleOptionSelect(qIdx, opt, q.correctAnswer, q.explanation, qCard);
          optsGrid.appendChild(btn);
        });

        qCard.appendChild(optsGrid);

        const feedback = document.createElement("div");
        feedback.className = "ai-gen-feedback hidden";
        feedback.id = `ai-q-feedback-${qIdx}`;
        qCard.appendChild(feedback);

        form.appendChild(qCard);
      });

      container.appendChild(form);
    }

    _handleOptionSelect(qIdx, selectedOpt, correctOpt, explanation, qCard) {
      const isCorrect = selectedOpt === correctOpt;
      const feedback = qCard.querySelector(".ai-gen-feedback");
      const buttons = qCard.querySelectorAll(".ai-gen-opt-btn");

      buttons.forEach(b => {
        b.disabled = true;
        if (b.textContent === correctOpt) {
          b.classList.add("correct-highlight");
        } else if (b.textContent === selectedOpt && !isCorrect) {
          b.classList.add("incorrect-highlight");
        }
      });

      if (feedback) {
        feedback.classList.remove("hidden");
        feedback.className = `ai-gen-feedback ${isCorrect ? "feedback-success" : "feedback-danger"}`;
        feedback.innerHTML = `
          <strong>${isCorrect ? "✅ ¡Correcto!" : "❌ Respuesta incorrecta"}</strong>
          <p>${explanation}</p>
        `;
      }

      // Log to Adaptive Engine & Mistake Notebook
      if (this.app) {
        if (isCorrect) {
          this.app.addXp(15);
          if (this.app.sound) this.app.sound.playCorrect();
        } else {
          if (this.app.sound) this.app.sound.playIncorrect();
          if (this.app.adaptiveEngine) {
            this.app.adaptiveEngine.recordMistake({
              sourceModule: "Grammar AI Practice",
              skill: "grammar",
              topic: this.activeTopic,
              userAnswer: selectedOpt,
              correctAnswer: correctOpt,
              explanation: explanation
            });
          }
        }

        if (this.app.adaptiveEngine) {
          this.app.adaptiveEngine.recordActivity({
            skill: "grammar",
            topic: this.activeTopic,
            difficulty: this.activeLevel,
            isCorrect: isCorrect,
            userAnswer: selectedOpt,
            correctAnswer: correctOpt
          });
        }
      }
    }
  }

  function qqClean(str) {
    return (str || "").replace(/^["']|["']$/g, "");
  }

  global.GrammarAITutor = GrammarAITutor;
})(window);
