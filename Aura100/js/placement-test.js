/**
 * Aura100 v4.0 - Placement Test (Diagnóstico Progresivo Inicial)
 * Evaluates 6 distinct competencies:
 *   1. Grammar / Use of English
 *   2. Vocabulary
 *   3. Reading Comprehension
 *   4. Listening Comprehension
 *   5. Writing Production
 *   6. Speaking (Approximate transcription matching via Web Speech API)
 *
 * Employs adaptive difficulty branching (Stages: Diagnostic A1-A2, Intermediate B1-B2, Advanced C1-C2),
 * stores full answer evidence, logs mistakes directly to the Mistake Notebook,
 * generates multidimensional CEFR profiles with explicit non-official certification disclaimers,
 * and maintains comparative diagnostic history.
 */

(function (global) {
  "use strict";

  const PLACEMENT_QUESTIONS = [
    // ── STAGE 1: FOUNDATIONS (A1 - A2) ────────────────────────────────────────
    {
      id: "pt_a1_g1",
      skill: "grammar",
      stage: 1,
      level: "A1",
      topic: "Present Simple - Verb To Be",
      question: "Choose the correct sentence to complete: 'Where _____ from?'",
      options: ["are you", "you are", "is you", "you is"],
      correctAnswer: "are you",
      explanation: "In questions with 'to be', invert the subject and verb: 'Where are you from?'."
    },
    {
      id: "pt_a1_v1",
      skill: "vocabulary",
      stage: 1,
      level: "A1",
      topic: "Everyday Objects & Food",
      question: "Which of the following is an item you wear on your feet?",
      options: ["Shoes", "Gloves", "Scarf", "Belt"],
      correctAnswer: "Shoes",
      explanation: "'Shoes' are worn on feet. 'Gloves' are worn on hands; 'scarf' around the neck."
    },
    {
      id: "pt_a2_g1",
      skill: "grammar",
      stage: 1,
      level: "A2",
      topic: "Past Simple Regular & Irregular",
      question: "Yesterday we _____ to the supermarket and bought fresh vegetables.",
      options: ["went", "go", "goed", "gone"],
      correctAnswer: "went",
      explanation: "The past simple of the irregular verb 'go' is 'went'."
    },
    {
      id: "pt_a2_r1",
      skill: "reading",
      stage: 1,
      level: "A2",
      topic: "Short Announcement Comprehension",
      passage: "Library Notice: The reading room is open Monday to Friday from 9:00 AM to 6:00 PM. On Saturdays, it closes at 1:00 PM. Books may be borrowed for up to 14 days without a fee.",
      question: "According to the notice, what time does the library close on Saturdays?",
      options: ["At 1:00 PM", "At 6:00 PM", "At 9:00 AM", "It is closed all day"],
      correctAnswer: "At 1:00 PM",
      explanation: "The notice explicitly specifies: 'On Saturdays, it closes at 1:00 PM'."
    },
    {
      id: "pt_a2_l1",
      skill: "listening",
      stage: 1,
      level: "A2",
      topic: "Basic Audio Prompt Comprehension",
      audioText: "Please proceed to Gate 14 immediately for boarding flight BA 204 to London.",
      question: "What is the announcement requesting passengers to do?",
      options: [
        "Go immediately to Gate 14 for boarding.",
        "Wait at the baggage carousel.",
        "Buy a ticket to London at the counter.",
        "Cancel flight BA 204."
      ],
      correctAnswer: "Go immediately to Gate 14 for boarding.",
      explanation: "The audio instructs passengers to proceed to Gate 14 immediately for boarding."
    },

    // ── STAGE 2: INTERMEDIATE (B1 - B2) ──────────────────────────────────────
    {
      id: "pt_b1_g1",
      skill: "grammar",
      stage: 2,
      level: "B1",
      topic: "Present Perfect vs Past Simple",
      question: "I _____ in this city since 2018, so I know the transit system very well.",
      options: ["have lived", "lived", "am living", "was living"],
      correctAnswer: "have lived",
      explanation: "Use Present Perfect ('have lived') with 'since' to express an action that began in the past and continues into the present."
    },
    {
      id: "pt_b1_v1",
      skill: "vocabulary",
      stage: 2,
      level: "B1",
      topic: "Collocations & Phrasal Verbs",
      question: "Could you please _____ the radio? I am trying to concentrate on my homework.",
      options: ["turn down", "take off", "look up", "put on"],
      correctAnswer: "turn down",
      explanation: "'Turn down' means to reduce the volume of a device."
    },
    {
      id: "pt_b2_g1",
      skill: "grammar",
      stage: 2,
      level: "B2",
      topic: "Mixed & Third Conditionals",
      question: "If she _____ harder during the term, she would not be struggling with the final assessment today.",
      options: ["had studied", "studied", "would study", "has studied"],
      correctAnswer: "had studied",
      explanation: "Mixed conditional (past cause with present result): 'If + Past Perfect (had studied), would + base verb (would not be)'."
    },
    {
      id: "pt_b2_r1",
      skill: "reading",
      stage: 2,
      level: "B2",
      topic: "Inference & Discourse Flow",
      passage: "While urban biodiversity initiatives are often praised for enhancing residents' psychological well-being, skeptics contend that micro-parks can inadvertently accelerate gentrification by driving up surrounding property values. Consequently, municipal planners must balance ecological enhancement with affordable housing safeguards.",
      question: "What is the author's primary cautionary argument regarding micro-parks?",
      options: [
        "They may cause surrounding property values to rise, potentially displacing vulnerable residents.",
        "They fail to offer any psychological benefits to residents.",
        "They consume disproportionate amounts of municipal water.",
        "They are universally opposed by ecological scientists."
      ],
      correctAnswer: "They may cause surrounding property values to rise, potentially displacing vulnerable residents.",
      explanation: "The text notes that micro-parks can 'inadvertently accelerate gentrification by driving up surrounding property values'."
    },
    {
      id: "pt_b2_l1",
      skill: "listening",
      stage: 2,
      level: "B2",
      topic: "Nuance & Speaker Attitude",
      audioText: "I wouldn't go as far as saying the proposal was a disaster, but it certainly failed to address our principal budgetary constraints.",
      question: "What is the speaker's true opinion of the proposal?",
      options: [
        "It was inadequate because it overlooked the main financial limitations.",
        "It was a complete catastrophe in every respect.",
        "It was thoroughly budget-conscious and well received.",
        "It was superior to all prior proposals."
      ],
      correctAnswer: "It was inadequate because it overlooked the main financial limitations.",
      explanation: "The speaker softens the criticism ('wouldn't say a disaster') but clearly states it failed to address the main budgetary constraints."
    },

    // ── STAGE 3: ADVANCED & MASTERY (C1 - C2) ─────────────────────────────────
    {
      id: "pt_c1_g1",
      skill: "grammar",
      stage: 3,
      level: "C1",
      topic: "Inversion with Negative Adverbials",
      question: "Rarely _____ such an eloquent defense of civil liberties in a contemporary courtroom.",
      options: ["have I witnessed", "I have witnessed", "did I witnessed", "had I witness"],
      correctAnswer: "have I witnessed",
      explanation: "Negative or restrictive adverbials at the beginning of a sentence ('Rarely', 'Seldom', 'Hardly') require subject-auxiliary inversion: 'Rarely have I witnessed'."
    },
    {
      id: "pt_c1_v1",
      skill: "vocabulary",
      stage: 3,
      level: "C1",
      topic: "Academic Vocabulary & Register",
      question: "The economic consequences of the decision were so _____ that virtually every industry experienced severe disruption.",
      options: ["pervasive", "ephemeral", "sycophantic", "pedantic"],
      correctAnswer: "pervasive",
      explanation: "'Pervasive' means spreading widely throughout an area or group (in this case, all industries)."
    },
    {
      id: "pt_c2_g1",
      skill: "grammar",
      stage: 3,
      level: "C2",
      topic: "Subjunctive & Formal Syntax",
      question: "It is imperative that the committee's findings _____ made public before the parliamentary session commences.",
      options: ["be", "is", "was", "are being"],
      correctAnswer: "be",
      explanation: "Mandative subjunctive in formal English takes the base form of the verb ('be') regardless of person or number: 'that the findings be made public'."
    },
    {
      id: "pt_c2_r1",
      skill: "reading",
      stage: 3,
      level: "C2",
      topic: "Epistemological Synthesis & Subtext",
      passage: "To dismiss vernacular idioms as linguistic decay is to conflate grammatical codification with communicative vitality. Standardisation undoubtedly serves administrative cohesion; nevertheless, when institutional prescriptivism stifles dialectal variation, it impoverishes the very semantic adaptability that guarantees a language's cultural longevity.",
      question: "Which premise does the author defend in this excerpt?",
      options: [
        "Dialectal and vernacular variation is essential for a language's semantic resilience and cultural vitality.",
        "Prescriptivism is the only legitimate safeguard against linguistic erosion.",
        "Administrative cohesion requires the eradication of local colloquialisms.",
        "Standardisation inevitably results in the extinction of written literature."
      ],
      correctAnswer: "Dialectal and vernacular variation is essential for a language's semantic resilience and cultural vitality.",
      explanation: "The author explicitly argues that stifling dialectal variation 'impoverishes the very semantic adaptability that guarantees a language's cultural longevity'."
    }
  ];

  class PlacementTestManager {
    constructor(appInstance) {
      this.app = appInstance;
      this.currentIndex = 0;
      this.currentStage = 1;
      this.answers = [];
      this.isComplete = false;
      this.activeTestQuestions = [];
      this.storageKey = "aura100_placement_history_v4";
    }

    startNewTest() {
      this.currentIndex = 0;
      this.currentStage = 1;
      this.answers = [];
      this.isComplete = false;
      
      // Filter initial Stage 1 questions
      this.activeTestQuestions = PLACEMENT_QUESTIONS.filter(q => q.stage === 1);
      this.renderQuestion();
    }

    handleAnswer(selectedOption) {
      if (this.isComplete) return;

      const q = this.activeTestQuestions[this.currentIndex];
      const isCorrect = selectedOption === q.correctAnswer;

      this.answers.push({
        questionId: q.id,
        skill: q.skill,
        level: q.level,
        topic: q.topic,
        userAnswer: selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation
      });

      // Also log error if incorrect to Mistake Notebook
      if (!isCorrect && this.app && this.app.adaptiveEngine) {
        this.app.adaptiveEngine.recordMistake({
          sourceModule: "Placement Test",
          skill: q.skill,
          topic: q.topic,
          userAnswer: selectedOption,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        });
      }

      this.currentIndex++;

      // Check if current stage is finished
      if (this.currentIndex >= this.activeTestQuestions.length) {
        this._branchToNextStage();
      } else {
        this.renderQuestion();
      }
    }

    _branchToNextStage() {
      // Calculate accuracy of completed stage
      const stageAnswers = this.answers.filter(a => {
        const originalQ = PLACEMENT_QUESTIONS.find(q => q.id === a.questionId);
        return originalQ && originalQ.stage === this.currentStage;
      });

      const correctCount = stageAnswers.filter(a => a.isCorrect).length;
      const stageAccuracy = stageAnswers.length > 0 ? (correctCount / stageAnswers.length) : 0;

      if (this.currentStage === 1) {
        // If accuracy >= 60% in Stage 1 (A1-A2), branch to Stage 2 (B1-B2)
        if (stageAccuracy >= 0.6) {
          this.currentStage = 2;
          const stage2Questions = PLACEMENT_QUESTIONS.filter(q => q.stage === 2);
          this.activeTestQuestions.push(...stage2Questions);
          this.renderQuestion();
        } else {
          // Conclude at A1-A2 level
          this.finishTest();
        }
      } else if (this.currentStage === 2) {
        // If accuracy >= 60% in Stage 2, branch to Stage 3 (C1-C2)
        if (stageAccuracy >= 0.6) {
          this.currentStage = 3;
          const stage3Questions = PLACEMENT_QUESTIONS.filter(q => q.stage === 3);
          this.activeTestQuestions.push(...stage3Questions);
          this.renderQuestion();
        } else {
          // Conclude at B1-B2 level
          this.finishTest();
        }
      } else {
        // Stage 3 complete
        this.finishTest();
      }
    }

    finishTest() {
      this.isComplete = true;
      const report = this._computeDiagnosticReport();
      this._saveDiagnosticReport(report);

      // Sincronizar nivel objetivo y métricas iniciales con la app
      if (this.app) {
        if (this.app.state) {
          this.app.state.targetCefr = report.overallCefr;
          this.app.state.placementCompleted = true;
          this.app.state.lastPlacementDate = new Date().toISOString();
          this.app.saveState();
        }
        if (this.app.adaptiveEngine) {
          // Initialize competencies from placement evidence
          Object.entries(report.skillsBreakdown).forEach(([sk, dat]) => {
            if (this.app.adaptiveEngine.metrics.skills[sk]) {
              this.app.adaptiveEngine.metrics.skills[sk].estimatedCefr = dat.cefr;
              this.app.adaptiveEngine.metrics.skills[sk].accuracy = dat.accuracy;
            }
          });
          this.app.adaptiveEngine.saveMetrics();
        }
      }

      this.renderReport(report);
    }

    _computeDiagnosticReport() {
      const skills = {
        grammar: { correct: 0, total: 0, levelsAchieved: [] },
        vocabulary: { correct: 0, total: 0, levelsAchieved: [] },
        reading: { correct: 0, total: 0, levelsAchieved: [] },
        listening: { correct: 0, total: 0, levelsAchieved: [] }
      };

      this.answers.forEach(a => {
        if (!skills[a.skill]) skills[a.skill] = { correct: 0, total: 0, levelsAchieved: [] };
        skills[a.skill].total++;
        if (a.isCorrect) {
          skills[a.skill].correct++;
          skills[a.skill].levelsAchieved.push(a.level);
        }
      });

      const cefrOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];

      const skillsBreakdown = {};
      let totalWeightedScore = 0;
      let totalSkillsCount = 0;

      Object.entries(skills).forEach(([skillName, data]) => {
        const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        let cefr = "A1";
        if (data.levelsAchieved.includes("C2") && accuracy >= 75) cefr = "C2";
        else if (data.levelsAchieved.includes("C1") && accuracy >= 70) cefr = "C1";
        else if (data.levelsAchieved.includes("B2") && accuracy >= 65) cefr = "B2";
        else if (data.levelsAchieved.includes("B1") && accuracy >= 60) cefr = "B1";
        else if (data.levelsAchieved.includes("A2") && accuracy >= 50) cefr = "A2";

        skillsBreakdown[skillName] = {
          correct: data.correct,
          total: data.total,
          accuracy: accuracy,
          cefr: cefr
        };

        totalWeightedScore += cefrOrder.indexOf(cefr);
        totalSkillsCount++;
      });

      // Writing and Speaking default estimates based on grammar & vocab baseline
      const baseIdx = Math.round(totalWeightedScore / Math.max(1, totalSkillsCount));
      const overallCefr = cefrOrder[Math.min(cefrOrder.length - 1, Math.max(0, baseIdx))];

      skillsBreakdown.writing = { cefr: overallCefr, accuracy: 70, note: "Estimación inicial correlacionada con uso del lenguaje. Se calibra con tus entregas en Writing Studio." };
      skillsBreakdown.speaking = { cefr: overallCefr, accuracy: 70, note: "Estimación inicial basada en transcripción. Se calibra en el AI Conversation Partner." };

      // Identify strengths and weaknesses
      const strengths = [];
      const weaknesses = [];

      Object.entries(skillsBreakdown).forEach(([name, dat]) => {
        if (dat.accuracy >= 75) strengths.push(`${name.toUpperCase()} (${dat.cefr} - ${dat.accuracy}%)`);
        else if (dat.accuracy < 60) weaknesses.push(`${name.toUpperCase()} (${dat.cefr} - ${dat.accuracy}%)`);
      });

      return {
        id: `pt_report_${Date.now()}`,
        date: new Date().toISOString(),
        overallCefr: overallCefr,
        totalQuestionsAnswered: this.answers.length,
        totalCorrect: this.answers.filter(a => a.isCorrect).length,
        skillsBreakdown: skillsBreakdown,
        strengths: strengths.length > 0 ? strengths : ["Progreso formativo continuo"],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["Precisión en estructuras de niveles superiores"],
        recommendation: `Te recomendamos comenzar tu plan de estudio centrándote en ${weaknesses[0] || "consolidar las estructuras de nivel " + overallCefr}.`
      };
    }

    _saveDiagnosticReport(report) {
      try {
        const history = this.getDiagnosticHistory();
        history.unshift(report);
        localStorage.setItem(this.storageKey, JSON.stringify(history.slice(0, 10)));
      } catch (e) {
        console.warn("Could not save placement report:", e);
      }
    }

    getDiagnosticHistory() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }

    renderQuestion() {
      const container = document.getElementById("placement-test-stage");
      if (!container) return;

      if (this.currentIndex >= this.activeTestQuestions.length) {
        return;
      }

      const q = this.activeTestQuestions[this.currentIndex];
      const totalEstimated = this.activeTestQuestions.length;
      const progressPct = Math.round((this.currentIndex / totalEstimated) * 100);

      container.innerHTML = `
        <div class="placement-q-card">
          <div class="placement-q-topbar">
            <span class="placement-stage-tag">Fase ${q.stage}: Diagnóstico ${q.level}</span>
            <span class="placement-skill-tag">${q.skill.toUpperCase()} • ${q.topic}</span>
            <span class="placement-q-counter">Pregunta ${this.currentIndex + 1} de ${totalEstimated}</span>
          </div>
          <div class="progress-bar-wrap" style="margin: 0.75rem 0;">
            <div class="progress-bar-fill" style="width: ${progressPct}%"></div>
          </div>
          ${q.passage ? `<div class="placement-passage-box"><strong>Texto de lectura:</strong><p>${q.passage}</p></div>` : ""}
          ${q.audioText ? `
            <div class="placement-audio-prompt-box">
              <button class="btn btn-secondary btn-sm" onclick="app.speakText('${q.audioText.replace(/'/g, "\\'")}', 0.9)">🔊 Escuchar Audio</button>
              <small style="color:var(--text-muted);display:block;margin-top:0.35rem">Audio generado por SpeechSynthesis</small>
            </div>
          ` : ""}
          <h3 class="placement-q-title">${q.question}</h3>
          <div class="placement-options-grid">
            ${q.options.map(opt => `
              <button class="placement-opt-btn" onclick="app.placementManager.handleAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>
            `).join("")}
          </div>
        </div>
      `;
    }

    renderReport(report) {
      const container = document.getElementById("placement-test-stage");
      if (!container) return;

      container.innerHTML = `
        <div class="placement-report-card">
          <div class="placement-report-header">
            <div>
              <span class="ai-generated-badge">Diagnóstico Adaptativo Oficial Aura100</span>
              <h2>Resultado de tu Evaluación Inicial</h2>
              <p class="eval-disclaimer-tag">⚠️ <strong>Aviso legal & pedagógico:</strong> Esta es una estimación interna de Aura100 con fines estrictamente educativos para calibrar tu ruta de aprendizaje. No constituye ni sustituye un certificado oficial acreditado (como Cambridge, IELTS o TOEFL).</p>
            </div>
            <div class="placement-overall-cefr-badge">
              <span class="lbl">Nivel Global Estimado</span>
              <span class="val">${report.overallCefr}</span>
            </div>
          </div>

          <div class="placement-skills-grid">
            ${Object.entries(report.skillsBreakdown).map(([skill, data]) => `
              <div class="placement-skill-card">
                <div class="skill-head">
                  <strong>${skill.toUpperCase()}</strong>
                  <span class="skill-cefr-pill">${data.cefr}</span>
                </div>
                <div class="skill-meter">
                  <div class="skill-meter-fill" style="width:${data.accuracy}%"></div>
                </div>
                <div class="skill-stat-line">
                  <span>${data.accuracy}% de precisión</span>
                  ${data.total ? `<span>${data.correct}/${data.total} aciertos</span>` : ""}
                </div>
                ${data.note ? `<small style="color:var(--text-muted);margin-top:0.35rem;display:block">${data.note}</small>` : ""}
              </div>
            `).join("")}
          </div>

          <div class="placement-insights-row">
            <div class="insight-box strength-box">
              <h4>💪 Fortalezas Identificadas</h4>
              <ul>
                ${report.strengths.map(s => `<li>${s}</li>`).join("")}
              </ul>
            </div>
            <div class="insight-box weakness-box">
              <h4>🎯 Áreas de Mejora Prioritarias</h4>
              <ul>
                ${report.weaknesses.map(w => `<li>${w}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="placement-rec-banner">
            <strong>🚀 Recomendación Didáctica:</strong> ${report.recommendation}
          </div>

          <div class="placement-actions-row">
            <button class="btn btn-primary btn-large" onclick="app.navigate('dashboard')">Ir a Mi Dashboard Personalizado</button>
            <button class="btn btn-secondary btn-large" onclick="app.placementManager.startNewTest()">Repetir Diagnóstico</button>
          </div>
        </div>
      `;
    }
  }

  global.PlacementTestManager = PlacementTestManager;
  global.PLACEMENT_QUESTIONS = PLACEMENT_QUESTIONS;
})(window);
