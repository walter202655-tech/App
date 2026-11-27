(function (global) {
  "use strict";

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function dateKey(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function localDate(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const WORDLE_WORDS = [
    "learn", "speak", "write", "study", "brain", "clear", "focus", "topic",
    "skill", "words", "build", "ideas", "think", "share", "sound", "teach",
    "first", "great", "point", "proof", "basic", "above", "daily", "enjoy"
  ];
  const WORDLE_GUESSES = new Set(WORDLE_WORDS.concat([
    "about", "after", "again", "along", "apple", "begin", "bring", "cause",
    "class", "close", "could", "every", "field", "found", "group", "house",
    "large", "might", "often", "other", "place", "right", "small", "under",
    "value", "water", "which", "world", "young"
  ]));

  const CONNECT_PAIRS = [
    { word: "accurate", meaning: "preciso" },
    { word: "brief", meaning: "breve" },
    { word: "challenge", meaning: "desafío" },
    { word: "evidence", meaning: "evidencia" },
    { word: "improve", meaning: "mejorar" },
    { word: "likely", meaning: "probable" },
    { word: "maintain", meaning: "mantener" },
    { word: "outcome", meaning: "resultado" },
    { word: "reliable", meaning: "fiable" },
    { word: "require", meaning: "requerir" },
    { word: "approach", meaning: "enfoque" },
    { word: "aware", meaning: "consciente" },
    { word: "benefit", meaning: "beneficio" },
    { word: "complex", meaning: "complejo" },
    { word: "develop", meaning: "desarrollar" },
    { word: "increase", meaning: "aumentar" },
    { word: "purpose", meaning: "propósito" },
    { word: "reduce", meaning: "reducir" },
    { word: "suitable", meaning: "adecuado" },
    { word: "valuable", meaning: "valioso" }
  ];

  const CAMBRIDGE_GUIDES = {
    reading: {
      title: "Reading and Use of English",
      meta: "1 h 15 min · 7 partes · 52 preguntas · 40% de la calificación",
      intro: "Evalúa comprensión lectora y control del vocabulario y la gramática. La prueba combina textos y tareas con distintos mecanismos de respuesta.",
      parts: [
        ["Parte 1 - Multiple-choice cloze", "Lee el texto completo antes de elegir. Identifica colocaciones, expresiones fijas, phrasal verbs y diferencias de significado. Comprueba qué opción encaja con toda la frase, no solo con el espacio."],
        ["Parte 2 - Open cloze", "Determina qué función gramatical falta: artículo, preposición, auxiliar, pronombre, conector o partícula. Lee la frase anterior y la siguiente para recuperar el contexto."],
        ["Parte 3 - Word formation", "Clasifica la palabra base y decide qué transformación exige el contexto. Revisa prefijos, sufijos, forma negativa, plural y cambios de categoría gramatical."],
        ["Parte 4 - Key word transformations", "Conserva la palabra clave sin modificarla. Identifica la estructura que relaciona ambas frases y revisa que el significado sea equivalente. Respeta el límite de palabras indicado en la hoja."],
        ["Parte 5 - Multiple choice", "Localiza la evidencia en el texto. Distingue idea principal, intención, opinión, tono e inferencia. No elijas una opción solo porque repita una palabra del texto."],
        ["Parte 6 - Gapped text", "Observa referencias, pronombres, conectores, tiempos verbales y continuidad temática. Antes de colocar un párrafo, comprueba que encaje tanto con lo que viene antes como con lo que sigue."],
        ["Parte 7 - Multiple matching", "Lee primero las afirmaciones y subraya la información que debes localizar. Busca sinónimos y paráfrasis, no coincidencias literales. Comprueba cada afirmación con el fragmento completo."]
      ]
    },
    writing: {
      title: "Writing",
      meta: "1 h 20 min · 2 tareas · ensayo obligatorio en la Parte 1",
      intro: "Debes redactar dos textos de 140-190 palabras. En la Parte 1 escribes un ensayo obligatorio; en la Parte 2 eliges una tarea entre tres opciones.",
      parts: [
        ["Parte 1 - Essay", "Analiza el enunciado y las dos ideas que se proporcionan. Añade una tercera idea propia, desarrolla una postura clara y justifica cada argumento. Organiza el texto en introducción, desarrollo y conclusión."],
        ["Parte 2 - Texto a elegir", "Lee el contexto, el propósito y el destinatario antes de empezar. Adapta el registro y la estructura al tipo de texto solicitado: artículo, correo o carta, informe o reseña. En B2 First for Schools pueden aparecer tareas distintas, como una historia."]
      ]
    },
    listening: {
      title: "Listening",
      meta: "Unos 40 min · 4 partes · 30 preguntas",
      intro: "Escucharás cada grabación dos veces. Los ejercicios incluyen monólogos, conversaciones y diferentes objetivos de comprensión.",
      parts: [
        ["Parte 1 - Multiple choice", "Lee las preguntas y opciones antes de escuchar. Identifica qué diferencia a los distractores y escucha el sentido, la actitud y la intención del hablante."],
        ["Parte 2 - Sentence completion", "Predice qué tipo de palabra falta. Durante la escucha anota la información concreta y revisa ortografía, número y forma gramatical."],
        ["Parte 3 - Multiple matching", "Relaciona cada hablante con una idea, actitud o experiencia. Diferencia opiniones parecidas y utiliza la segunda escucha para verificar."],
        ["Parte 4 - Multiple choice", "Sigue el desarrollo de la conversación. Presta atención a cambios de opinión, acuerdos parciales, razones y detalles que aclaran la respuesta."]
      ]
    },
    speaking: {
      title: "Speaking",
      meta: "4 partes · unos 14 min por pareja de candidatos",
      intro: "Se evalúa tu capacidad para comunicarte con el examinador y con otro candidato. La interacción y la claridad importan tanto como el vocabulario.",
      parts: [
        ["Parte 1 - Interview", "Responde de forma natural y amplía la respuesta con una razón o un ejemplo. Evita memorizar discursos largos; contesta exactamente a lo que te preguntan."],
        ["Parte 2 - Long turn", "Compara las fotografías y desarrolla una idea común. Utiliza expresiones de comparación y especulación, y responde a la pregunta sin describir cada detalle."],
        ["Parte 3 - Collaborative task", "Intercambia ideas con tu compañero, justifica propuestas y reacciona a sus aportaciones. No monopolices la conversación: invita a la otra persona a participar."],
        ["Parte 4 - Discussion", "Profundiza en el tema de la Parte 3. Explica por qué estás de acuerdo o en desacuerdo, matiza tu postura y aporta ejemplos concretos."]
      ]
    }
  };

  const FALLBACK_QUESTIONS = [
    { question: "The new library gives students the opportunity to ___ their research skills.", options: ["develop", "make", "do", "take"], correctAnswer: "develop", explanation: "Develop skills es una colocación natural: desarrollar habilidades.", skill: "vocabulary" },
    { question: "Although the task was difficult, she managed ___ it on time.", options: ["finish", "finishing", "to finish", "finished"], correctAnswer: "to finish", explanation: "Manage va seguido de infinitivo con to.", skill: "grammar" },
    { question: "We have lived in this neighbourhood ___ 2021.", options: ["for", "since", "during", "from"], correctAnswer: "since", explanation: "Since introduce el punto de inicio de un periodo que continúa.", skill: "grammar" },
    { question: "The film was so ___ that several people watched it twice.", options: ["engaged", "engaging", "engagement", "engage"], correctAnswer: "engaging", explanation: "Se necesita un adjetivo que describa el efecto que produce la película.", skill: "vocabulary" },
    { question: "If I had more free time, I ___ a new language.", options: ["learn", "will learn", "would learn", "would have learnt"], correctAnswer: "would learn", explanation: "El second conditional expresa una situación hipotética: if + past simple, would + infinitive.", skill: "grammar" },
    { question: "The teacher asked us ___ our answers before handing in the test.", options: ["check", "checking", "to check", "checked"], correctAnswer: "to check", explanation: "Ask someone va seguido de objeto + infinitivo con to.", skill: "grammar" },
    { question: "Her explanation was clear; ___, the examples made the idea easier to understand.", options: ["however", "moreover", "unless", "despite"], correctAnswer: "moreover", explanation: "Moreover añade información que refuerza la idea anterior.", skill: "vocabulary" },
    { question: "The museum, ___ opened last year, has already attracted many visitors.", options: ["who", "where", "which", "whose"], correctAnswer: "which", explanation: "Which introduce una oración relativa explicativa referida a una cosa.", skill: "grammar" },
    { question: "The report provides convincing ___ to support its conclusion.", options: ["evidence", "proofs", "prove", "evident"], correctAnswer: "evidence", explanation: "Evidence es un sustantivo incontable habitual en este contexto.", skill: "vocabulary" },
    { question: "I wish I ___ more carefully before making that decision.", options: ["think", "have thought", "had thought", "would think"], correctAnswer: "had thought", explanation: "Wish + past perfect expresa arrepentimiento sobre una situación pasada.", skill: "grammar" },
    { question: "The event was postponed ___ the heavy rain.", options: ["due to", "although", "whereas", "despite of"], correctAnswer: "due to", explanation: "Due to significa 'debido a' y va seguido de un sustantivo o grupo nominal.", skill: "vocabulary" },
    { question: "No sooner ___ the lesson started than the fire alarm rang.", options: ["had", "did", "has", "was"], correctAnswer: "had", explanation: "No sooner al inicio exige inversión: No sooner had + sujeto + participio.", skill: "grammar" }
  ];

  class AcademyHub {
    constructor(app) {
      this.app = app;
      this.storageKey = "aura100_academy_hub_v1";
      this.state = this.loadState();
      this.vocabularyTab = "saved";
      this.cambridgeTab = "guides";
      this.vocabQuiz = null;
      this.currentRun = null;
      this.runTimer = null;
      this.examChatHistory = this.state.examChatHistory || [];
      this.connectPick = { left: null, right: null };
    }

    loadState() {
      const fallback = { calendarChecks: {}, gameResults: {}, examResults: [], questionLog: [], notes: [], examChatHistory: [], progressSummary: "" };
      try {
        const parsed = JSON.parse(localStorage.getItem(this.storageKey) || "null");
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
        return {
          ...fallback, ...parsed,
          calendarChecks: parsed.calendarChecks && typeof parsed.calendarChecks === "object" ? parsed.calendarChecks : {},
          gameResults: parsed.gameResults && typeof parsed.gameResults === "object" ? parsed.gameResults : {},
          examResults: Array.isArray(parsed.examResults) ? parsed.examResults : [],
          questionLog: Array.isArray(parsed.questionLog) ? parsed.questionLog : [],
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          examChatHistory: Array.isArray(parsed.examChatHistory) ? parsed.examChatHistory : []
        };
      } catch (_) {
        return fallback;
      }
    }

    saveState() {
      try { localStorage.setItem(this.storageKey, JSON.stringify(this.state)); } catch (error) { console.warn("Academy Hub storage unavailable.", error); }
    }

    today() { return dateKey(new Date()); }

    setVocabularyTab(tab) {
      this.vocabularyTab = tab === "quiz" ? "quiz" : "saved";
      const saved = document.getElementById("word-bank-saved-panel");
      const quiz = document.getElementById("word-bank-quiz-panel");
      const savedTab = document.getElementById("vocab-tab-saved");
      const quizTab = document.getElementById("vocab-tab-quiz");
      if (saved) saved.classList.toggle("academy-hidden", this.vocabularyTab !== "saved");
      if (quiz) quiz.classList.toggle("academy-hidden", this.vocabularyTab !== "quiz");
      if (savedTab) savedTab.classList.toggle("active", this.vocabularyTab === "saved");
      if (quizTab) quizTab.classList.toggle("active", this.vocabularyTab === "quiz");
      if (this.vocabularyTab === "saved") this.renderSavedWords();
      else this.renderVocabularyQuiz();
    }

    renderSavedWords() {
      const panel = document.getElementById("vocabulary-saved-cards");
      if (!panel) return;
      const deck = Array.isArray(this.app.state.ankiDeck) ? this.app.state.ankiDeck : [];
      if (!deck.length) {
        panel.innerHTML = '<div class="academy-empty"><h3>Aún no hay palabras guardadas</h3><p>Añade vocabulario desde los cursos o desde el diccionario para crear tu colección personal.</p><button class="btn btn-primary" onclick="app.navigate(\\'modules\\')">Explorar vocabulario</button></div>';
        return;
      }
      panel.innerHTML = '<div class="academy-section-heading"><div><h3>Tu colección</h3><p>' + deck.length + ' tarjetas guardadas y disponibles para repaso.</p></div><button class="btn btn-secondary btn-sm" onclick="app.navigate(\\'anki-srs\\')">Abrir repaso SRS</button></div><div class="academy-saved-grid">' +
        deck.slice(0, 60).map(function (card) {
          return '<article class="academy-saved-card"><div class="academy-saved-word">' + escapeHTML(card.front) + '</div><div class="academy-saved-meaning">' + escapeHTML(card.back) + '</div><div class="academy-saved-meta">' + escapeHTML(card.level || "B1") + ' · ' + escapeHTML(card.state || "saved") + '</div></article>';
        }).join("") + '</div>';
    }

    renderVocabularyQuiz() {
      const box = document.getElementById("vocabulary-quiz-content");
      if (!box) return;
      const deck = Array.isArray(this.app.state.ankiDeck) ? this.app.state.ankiDeck.filter(function (card) { return card.front && card.back; }) : [];
      if (deck.length < 4) {
        box.innerHTML = '<div class="academy-empty"><h3>Necesitas al menos cuatro tarjetas</h3><p>Guarda algunas palabras para poder crear una evaluación con opciones plausibles.</p><button class="btn btn-primary" onclick="app.navigate(\\'modules\\')">Ir a vocabulario</button></div>';
        return;
      }
      const items = shuffle(deck).slice(0, Math.min(10, deck.length));
      this.vocabQuiz = { items: items, index: 0, score: 0, answered: false };
      this.renderVocabularyQuestion();
    }

    renderVocabularyQuestion() {
      const box = document.getElementById("vocabulary-quiz-content");
      const run = this.vocabQuiz;
      if (!box || !run) return;
      if (run.index >= run.items.length) {
        const pct = Math.round(run.score / run.items.length * 100);
        box.innerHTML = '<div class="academy-result"><h3>Evaluación completada</h3><div class="academy-result-score">' + pct + '%</div><p>' + run.score + ' de ' + run.items.length + ' respuestas correctas.</p><button class="btn btn-primary" onclick="app.academyHub.renderVocabularyQuiz()">Volver a evaluar</button></div>';
        this.app.addXp(Math.max(5, run.score * 2));
        this.app.adaptiveEngine && this.app.adaptiveEngine.recordActivity({ skill: "vocabulary", topic: "Evaluación de palabras guardadas", difficulty: this.app.state.targetCefr || "B1", isCorrect: pct >= 70, score: pct });
        this.recordExamLikeResult("Vocabulario guardado", run.score, run.items.length);
        return;
      }
      const card = run.items[run.index];
      const others = shuffle((this.app.state.ankiDeck || []).filter(function (item) { return item.id !== card.id; })).slice(0, 3);
      const choices = shuffle([card].concat(others));
      box.innerHTML = '<div class="academy-quiz-top"><span>Pregunta ' + (run.index + 1) + ' / ' + run.items.length + '</span><span>' + run.score + ' correctas</span></div><div class="academy-quiz-card"><p class="academy-eyebrow">TRADUCE LA PALABRA</p><h3>' + escapeHTML(card.front) + '</h3><div class="academy-options">' +
        choices.map(function (choice, index) {
          return '<button class="academy-option" onclick="app.academyHub.answerVocabulary(' + index + ')" data-choice="' + index + '">' + escapeHTML(choice.back) + '</button>';
        }).join("") + '</div><p id="vocab-quiz-feedback" class="academy-feedback" aria-live="polite"></p></div>';
      run.currentChoices = choices;
      run.answered = false;
    }

    answerVocabulary(choiceIndex) {
      const run = this.vocabQuiz;
      if (!run || run.answered || !run.currentChoices[choiceIndex]) return;
      run.answered = true;
      const card = run.items[run.index];
      const selected = run.currentChoices[choiceIndex];
      const correct = selected.id === card.id;
      if (correct) run.score++;
      document.querySelectorAll("#vocabulary-quiz-content .academy-option").forEach(function (button, index) {
        button.disabled = true;
        if (run.currentChoices[index].id === card.id) button.classList.add("is-correct");
        else if (index === choiceIndex) button.classList.add("is-wrong");
      });
      const feedback = document.getElementById("vocab-quiz-feedback");
      if (feedback) feedback.textContent = correct ? "Correcto. " + card.front + " significa " + card.back + "." : "Respuesta correcta: " + card.back + ".";
      this.recordQuestion({ source: "Vocabulario", skill: "vocabulary", question: card.front, answer: selected.back, correctAnswer: card.back, isCorrect: correct });
      this.app.adaptiveEngine && this.app.adaptiveEngine.recordActivity({ skill: "vocabulary", topic: "Vocabulario guardado", difficulty: card.level || "B1", isCorrect: correct, userAnswer: selected.back, correctAnswer: card.back });
      run.index++;
      global.setTimeout(() => this.renderVocabularyQuestion(), 900);
    }

    renderCalendar() {
      const box = document.getElementById("calendar-content");
      if (!box) return;
      const manager = this.app.learningPlanManager;
      const plan = manager && manager.activePlan;
      const minutes = plan && plan.minutesPerDay ? plan.minutesPerDay : 30;
      box.innerHTML = '<div class="academy-plan-form"><div><span class="academy-eyebrow">PLAN PERSONALIZADO</span><h3>Diseña tu semana de estudio</h3><p>La IA utiliza tu nivel, tus resultados y tus errores frecuentes para distribuir las actividades.</p></div><div class="academy-form-grid"><label>Minutos al día<input id="academy-plan-minutes" class="text-input" type="number" min="10" max="120" value="' + minutes + '"></label><label>Objetivo principal<input id="academy-plan-goal" class="text-input" maxlength="500" value="Prepararme para el Cambridge B2 First y mejorar mis habilidades generales."></label></div><button id="academy-generate-plan" class="btn btn-primary" onclick="app.academyHub.generateCalendarPlan()">Generar plan con IA</button><span id="academy-plan-status" class="academy-muted" aria-live="polite"></span></div><div id="academy-plan-render"></div>';
      if (plan) this.renderCalendarPlan(plan);
    }

    async generateCalendarPlan() {
      const button = document.getElementById("academy-generate-plan");
      const status = document.getElementById("academy-plan-status");
      const minutes = Math.min(120, Math.max(10, Number(document.getElementById("academy-plan-minutes")?.value) || 30));
      const goal = (document.getElementById("academy-plan-goal")?.value || "").trim() || "Prepararme para el Cambridge B2 First.";
      if (button) button.disabled = true;
      if (status) status.textContent = "Preparando tu plan semanal...";
      try {
        if (!this.app.learningPlanManager) throw new Error("El planificador de estudio no está disponible.");
        await this.app.learningPlanManager.generatePersonalizedPlan(minutes, goal);
        const plan = this.app.learningPlanManager.activePlan;
        if (!plan || !Array.isArray(plan.weeklyPlan)) throw new Error("No se pudo validar el plan generado.");
        this.state.activeGoal = goal;
        this.state.planUpdatedAt = new Date().toISOString();
        this.saveState();
        this.renderCalendarPlan(plan);
        if (status) status.textContent = "Plan guardado. Las tareas se pueden marcar al completarlas.";
      } catch (error) {
        if (status) status.textContent = error.message || "No se pudo generar el plan.";
      } finally {
        if (button) button.disabled = false;
      }
    }

    renderCalendarPlan(plan) {
      const box = document.getElementById("academy-plan-render");
      if (!box || !plan || !Array.isArray(plan.weeklyPlan)) return;
      const start = new Date();
      const weekday = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - weekday);
      const weekTitle = start.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
      const end = new Date(start); end.setDate(end.getDate() + 6);
      const range = weekTitle + " - " + end.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
      box.innerHTML = '<div class="academy-calendar-heading"><div><span class="academy-eyebrow">TU SEMANA</span><h3>' + escapeHTML(range) + '</h3></div><span class="academy-muted">' + (plan.minutesPerDay || 30) + ' min diarios</span></div><div class="academy-week-grid">' +
        plan.weeklyPlan.map((day, dayIndex) => {
          const date = new Date(start); date.setDate(start.getDate() + dayIndex);
          const key = dateKey(date);
          const tasks = Array.isArray(day.tasks) ? day.tasks : [];
          const done = tasks.filter((task, taskIndex) => this.state.calendarChecks[key + ":" + taskIndex]).length;
          return '<article class="academy-day-card ' + (key === this.today() ? "is-today" : "") + '"><div class="academy-day-head"><div><strong>' + escapeHTML(day.day) + '</strong><span>' + date.toLocaleDateString("es-PE", { day: "numeric", month: "short" }) + '</span></div><span class="academy-day-count">' + done + '/' + tasks.length + '</span></div><div class="academy-day-tasks">' +
            tasks.map((task, taskIndex) => {
              const id = key + ":" + taskIndex;
              const checked = Boolean(this.state.calendarChecks[id]);
              return '<label class="academy-task ' + (checked ? "is-done" : "") + '"><input type="checkbox" ' + (checked ? "checked" : "") + ' onchange="app.academyHub.toggleCalendarTask(\\'' + id + '\\')"><span><strong>' + escapeHTML(task.activity) + '</strong><small>' + escapeHTML(task.objective) + '</small><em>' + escapeHTML(task.skill) + ' · ' + Number(task.minutes || 0) + ' min</em></span></label>';
            }).join("") + '</div></article>';
        }).join("") + '</div><p class="academy-disclaimer">' + escapeHTML(plan.disclaimer || "Plan orientativo. Puedes adaptar las sesiones según tu disponibilidad.") + '</p>';
    }

    toggleCalendarTask(id) {
      const checked = Boolean(this.state.calendarChecks[id]);
      this.state.calendarChecks[id] = !checked;
      this.saveState();
      if (!checked) {
        this.app.addXp(3);
        this.recordQuestion({ source: "Calendario", skill: "study", question: "Tarea completada: " + id, answer: "Completada", correctAnswer: "Completada", isCorrect: true });
      }
      const plan = this.app.learningPlanManager && this.app.learningPlanManager.activePlan;
      if (plan) this.renderCalendarPlan(plan);
    }

    ensureDailyGames() {
      const today = this.today();
      if (!this.state.gameResults[today]) this.state.gameResults[today] = {
        wordle: { guesses: [], done: false, won: false },
        connect: { matches: [], done: false }
      };
      return this.state.gameResults[today];
    }

    dailyWord() {
      const seed = this.today().split("-").join("").split("").reduce((sum, digit) => sum + Number(digit), 0);
      return WORDLE_WORDS[seed % WORDLE_WORDS.length];
    }

    renderDailyGames() {
      const box = document.getElementById("daily-games-content");
      if (!box) return;
      this.ensureDailyGames();
      box.innerHTML = '<div class="academy-game-intro"><span class="academy-eyebrow">RETO DIARIO · ' + escapeHTML(this.today()) + '</span><h3>Practica un poco de inglés cada día</h3><p>El objetivo y las palabras cambian con la fecha. Tu resultado queda guardado en este dispositivo.</p></div><div class="academy-games-grid"><section class="academy-game-card"><div class="academy-game-heading"><div><span class="academy-eyebrow">JUEGO 01</span><h3>Wordle English</h3><p>Adivina una palabra inglesa de cinco letras en seis intentos.</p></div><span class="academy-game-icon">5×6</span></div><div id="academy-wordle-board"></div></section><section class="academy-game-card"><div class="academy-game-heading"><div><span class="academy-eyebrow">JUEGO 02</span><h3>Conecta palabras</h3><p>Relaciona cada palabra con su significado en español.</p></div><span class="academy-game-icon">↔</span></div><div id="academy-connect-board"></div></section></div>';
      this.renderWordle();
      this.renderConnectGame();
    }

    evaluateWordleGuess(guess, answer) {
      const result = Array(5).fill("absent");
      const remaining = {};
      for (let i = 0; i < 5; i++) {
        if (guess[i] === answer[i]) result[i] = "correct";
        else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
      }
      for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;
        if (remaining[guess[i]] > 0) {
          result[i] = "present";
          remaining[guess[i]]--;
        }
      }
      return result;
    }

    renderWordle() {
      const box = document.getElementById("academy-wordle-board");
      if (!box) return;
      const data = this.ensureDailyGames().wordle;
      const answer = this.dailyWord();
      const rows = [];
      for (let row = 0; row < 6; row++) {
        const guess = data.guesses[row] || "";
        const marks = guess ? this.evaluateWordleGuess(guess, answer) : [];
        rows.push('<div class="academy-wordle-row">' + Array.from({ length: 5 }, (_, index) => {
          const letter = guess[index] || "";
          return '<span class="academy-wordle-cell ' + (marks[index] || "") + '">' + escapeHTML(letter.toUpperCase()) + '</span>';
        }).join("") + '</div>');
      }
      box.innerHTML = '<div class="academy-wordle-grid">' + rows.join("") + '</div>' +
        (data.done ? '<div class="academy-feedback">' + (data.won ? "¡Correcto! Has encontrado la palabra." : "La palabra de hoy era " + answer.toUpperCase() + ".") + '</div>' :
        '<form class="academy-wordle-form" onsubmit="event.preventDefault();app.academyHub.submitWordle()"><input id="academy-wordle-input" class="text-input" maxlength="5" minlength="5" autocomplete="off" autocapitalize="characters" aria-label="Palabra de cinco letras" placeholder="WRITE"><button class="btn btn-primary" type="submit">Probar</button></form><p class="academy-muted">Verde: letra y posición correctas. Amarillo: letra presente en otra posición.</p>') +
        '<p class="academy-muted">' + data.guesses.length + ' de 6 intentos utilizados.</p>';
    }

    submitWordle() {
      const input = document.getElementById("academy-wordle-input");
      const guess = String(input?.value || "").trim().toLowerCase();
      const data = this.ensureDailyGames().wordle;
      if (data.done) return;
      if (!/^[a-z]{5}$/.test(guess) || !WORDLE_GUESSES.has(guess)) {
        this.app.showToast("Introduce una palabra inglesa válida de cinco letras.", "info");
        return;
      }
      data.guesses.push(guess);
      if (guess === this.dailyWord()) {
        data.done = true;
        data.won = true;
        this.app.addXp(15);
      } else if (data.guesses.length >= 6) {
        data.done = true;
        data.won = false;
      }
      this.saveState();
      this.renderWordle();
    }

    connectPairsToday() {
      const seed = this.today().split("-").join("").split("").reduce((sum, digit) => sum + Number(digit), 0);
      const start = seed % (CONNECT_PAIRS.length - 3);
      const pairs = CONNECT_PAIRS.slice(start, start + 4);
      return { pairs: pairs, meanings: shuffle(pairs.map((pair) => pair)) };
    }

    renderConnectGame() {
      const box = document.getElementById("academy-connect-board");
      if (!box) return;
      const data = this.ensureDailyGames().connect;
      const set = this.connectPairsToday();
      const matched = new Set(data.matches || []);
      if (!this.currentConnectOrder || this.currentConnectDate !== this.today()) {
        this.currentConnectOrder = set.meanings;
        this.currentConnectDate = this.today();
      }
      const order = this.currentConnectOrder;
      box.innerHTML = data.done ? '<div class="academy-result"><h3>Reto completado</h3><p>Has conectado las cuatro parejas.</p></div>' :
        '<div class="academy-connect-columns"><div>' + set.pairs.map((pair) => '<button class="academy-connect-option ' + (matched.has(pair.word) ? "is-matched " : "") + (this.connectPick.left === pair.word ? "is-selected" : "") + '" onclick="app.academyHub.selectConnect(\\'left\\',\\'' + pair.word + '\\')" ' + (matched.has(pair.word) ? "disabled" : "") + '>' + escapeHTML(pair.word) + '</button>').join("") +
        '</div><div>' + order.map((pair) => '<button class="academy-connect-option ' + (matched.has(pair.word) ? "is-matched " : "") + (this.connectPick.right === pair.word ? "is-selected" : "") + '" onclick="app.academyHub.selectConnect(\\'right\\',\\'' + pair.word + '\\')" ' + (matched.has(pair.word) ? "disabled" : "") + '>' + escapeHTML(pair.meaning) + '</button>').join("") +
        '</div></div><p id="academy-connect-feedback" class="academy-feedback" aria-live="polite">Selecciona una palabra y luego su significado.</p><p class="academy-muted">' + matched.size + ' de 4 parejas conectadas.</p>';
    }

    selectConnect(side, word) {
      const data = this.ensureDailyGames().connect;
      if (data.done || (data.matches || []).includes(word)) return;
      this.connectPick[side] = word;
      if (this.connectPick.left && this.connectPick.right) {
        const correct = this.connectPick.left === this.connectPick.right;
        const feedback = document.getElementById("academy-connect-feedback");
        if (correct) {
          data.matches.push(word);
          if (data.matches.length === 4) {
            data.done = true;
            this.app.addXp(12);
          }
          if (feedback) feedback.textContent = "Pareja correcta.";
          this.saveState();
          this.connectPick = { left: null, right: null };
          this.renderConnectGame();
        } else {
          if (feedback) feedback.textContent = "No coinciden. Prueba otra combinación.";
          global.setTimeout(() => {
            this.connectPick = { left: null, right: null };
            this.renderConnectGame();
          }, 650);
        }
      } else {
        this.renderConnectGame();
      }
    }

    renderCambridge() {
      const box = document.getElementById("cambridge-b2-content");
      if (!box) return;
      const tabs = [
        ["guides", "Guías y consejos"],
        ["custom", "Preguntas personalizadas"],
        ["practice", "Simulacros"],
        ["quick", "Evaluación rápida"]
      ];
      box.innerHTML = '<div class="academy-subtabs">' + tabs.map((tab) =>
        '<button class="academy-tab ' + (this.cambridgeTab === tab[0] ? "active" : "") + '" onclick="app.academyHub.setCambridgeTab(\\'' + tab[0] + '\\')">' + tab[1] + '</button>'
      ).join("") + '</div><div id="cambridge-b2-panel"></div>';
      this.renderCambridgeTab();
    }

    setCambridgeTab(tab) {
      this.cambridgeTab = ["guides", "custom", "practice", "quick"].includes(tab) ? tab : "guides";
      this.renderCambridge();
    }

    renderCambridgeTab() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      if (this.cambridgeTab === "guides") {
        box.innerHTML = '<div class="academy-exam-overview"><article><strong>1 h 15 min</strong><span>Reading & Use of English</span><small>7 partes · 52 preguntas</small></article><article><strong>1 h 20 min</strong><span>Writing</span><small>2 tareas · 140-190 palabras cada una</small></article><article><strong>40 min aprox.</strong><span>Listening</span><small>4 partes · 30 preguntas</small></article><article><strong>14 min</strong><span>Speaking</span><small>4 partes · por pareja de candidatos</small></article></div><p class="academy-disclaimer">El formato puede variar en detalles logísticos según la modalidad y la convocatoria. Consulta siempre las instrucciones de tu centro examinador.</p><div class="academy-guide-grid">' +
          Object.keys(CAMBRIDGE_GUIDES).map((key) => {
            const guide = CAMBRIDGE_GUIDES[key];
            return '<article class="academy-guide-card"><span class="academy-eyebrow">CAMBRIDGE B2 FIRST</span><h3>' + guide.title + '</h3><strong>' + guide.meta + '</strong><p>' + guide.intro + '</p><div class="academy-guide-parts">' + guide.parts.map((part) => '<details><summary>' + escapeHTML(part[0]) + '</summary><p>' + escapeHTML(part[1]) + '</p></details>').join("") + '</div></article>';
          }).join("") + '</div><div class="academy-shortcuts"><button class="btn btn-secondary" onclick="app.navigate(\\'writing-lab\\')">Practicar Writing</button><button class="btn btn-secondary" onclick="app.navigate(\\'chatbot\\')">Practicar Speaking</button><button class="btn btn-secondary" onclick="app.navigate(\\'video-lab\\')">Entrenar Listening</button></div>';
        return;
      }
      if (this.cambridgeTab === "custom") {
        box.innerHTML = '<div class="academy-generator-card"><span class="academy-eyebrow">GENERADOR PERSONALIZADO</span><h3>Practica lo que más necesitas</h3><p>El generador puede priorizar temas con menor precisión y errores frecuentes de tu historial.</p><label>Tema o dificultad<input id="cambridge-custom-topic" class="text-input" maxlength="180" placeholder="Ej. key word transformations, collocations o prepositions"></label><div class="academy-form-grid"><label>Área<select id="cambridge-custom-skill" class="custom-select"><option value="use_of_english">Use of English</option><option value="grammar">Gramática</option><option value="vocabulary">Vocabulario</option><option value="reading">Reading</option></select></label><label>Número de preguntas<select id="cambridge-custom-count" class="custom-select"><option value="5">5 preguntas</option><option value="8">8 preguntas</option><option value="10">10 preguntas</option></select></label></div><button class="btn btn-primary" onclick="app.academyHub.generateCustomQuestions()">Crear preguntas adaptadas</button><p id="cambridge-custom-status" class="academy-muted" aria-live="polite"></p></div>';
        return;
      }
      if (this.cambridgeTab === "practice") {
        box.innerHTML = '<div class="academy-generator-card"><span class="academy-eyebrow">PRACTICE PAPERS</span><h3>Simulacro breve de Reading and Use of English</h3><p>Genera un conjunto original de diez preguntas con formato de práctica B2. No reproduce preguntas oficiales ni sustituye un examen de muestra completo.</p><div class="academy-exam-overview academy-exam-overview-compact"><article><strong>10</strong><span>Preguntas</span><small>Opción múltiple</small></article><article><strong>15 min</strong><span>Tiempo sugerido</span><small>Ritmo de práctica</small></article></div><button class="btn btn-primary" onclick="app.academyHub.startQuestionRun(\\'practice\\', 10, \\'Mixed Cambridge B2 First Reading and Use of English practice\\', \\'use_of_english\\')">Iniciar simulacro</button><div class="academy-shortcuts"><button class="btn btn-secondary" onclick="app.navigate(\\'writing-lab\\')">Práctica de Writing</button><button class="btn btn-secondary" onclick="app.navigate(\\'chatbot\\')">Práctica de Speaking</button><button class="btn btn-secondary" onclick="app.navigate(\\'video-lab\\')">Práctica de Listening</button></div></div>';
        return;
      }
      box.innerHTML = '<div class="academy-generator-card"><span class="academy-eyebrow">DIAGNÓSTICO FORMATIVO</span><h3>Evaluación rápida B2</h3><p>Responde ocho preguntas originales. Recibirás observaciones orientativas sobre tus áreas fuertes y las que conviene repasar.</p><button class="btn btn-primary" onclick="app.academyHub.startQuestionRun(\\'quick\\', 8, \\'B2 First diagnostic: grammar, vocabulary, collocations and reading inference\\', \\'use_of_english\\')">Comenzar evaluación</button><p class="academy-disclaimer">Las Predictive Notes son observaciones de estudio basadas en esta muestra breve. No predicen una nota oficial, una puntuación Cambridge English Scale ni el resultado real del examen.</p></div>';
    }

    weakestTopics() {
      const topics = this.app.adaptiveEngine?.metrics?.topics || {};
      return Object.entries(topics)
        .filter((entry) => entry[1] && Number(entry[1].attempts) > 0)
        .sort((a, b) => Number(a[1].accuracy || 0) - Number(b[1].accuracy || 0))
        .slice(0, 3)
        .map((entry) => entry[0]);
    }

    async generateCustomQuestions() {
      const topicInput = document.getElementById("cambridge-custom-topic");
      const skillInput = document.getElementById("cambridge-custom-skill");
      const countInput = document.getElementById("cambridge-custom-count");
      const status = document.getElementById("cambridge-custom-status");
      const weak = this.weakestTopics();
      const topic = (topicInput?.value || "").trim() || (weak.length ? "Focus on my recent weak areas: " + weak.join(", ") : "B2 First Use of English common challenges");
      const skill = skillInput?.value || "use_of_english";
      const count = Number(countInput?.value) || 5;
      if (status) status.textContent = "Generando preguntas...";
      await this.startQuestionRun("custom", count, "Create original Cambridge B2 First-style questions about " + topic + ". Learner's recent weak topics: " + weak.join(", "), skill, status);
    }

    async startQuestionRun(kind, count, topic, skill, statusElement) {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      if (this.runTimer) global.clearInterval(this.runTimer);
      box.innerHTML = '<div class="academy-loading"><div class="academy-spinner"></div><h3>Preparando preguntas</h3><p>Adaptando la práctica al nivel B2...</p></div>';
      let questions = [];
      let source = "IA";
      try {
        if (!global.Aura100AI || typeof global.Aura100AI.generateExercises !== "function") throw new Error("AI client unavailable");
        const result = await global.Aura100AI.generateExercises({
          topic: topic,
          skill: skill,
          level: "B2",
          count: Math.min(10, Math.max(3, count)),
          language: "es"
        });
        questions = Array.isArray(result.questions) ? result.questions : [];
        if (!questions.length) throw new Error("Empty question set");
      } catch (error) {
        console.warn("Cambridge practice generator fallback:", error);
        questions = shuffle(FALLBACK_QUESTIONS).slice(0, Math.min(count, FALLBACK_QUESTIONS.length));
        source = "Banco local de práctica";
      }
      this.currentRun = {
        kind: kind, topic: topic, skill: skill, questions: questions, index: 0,
        score: 0, wrong: [], source: source, startedAt: Date.now(),
        secondsLeft: kind === "practice" ? 15 * 60 : (kind === "quick" ? 7 * 60 : 9 * 60)
      };
      if (statusElement) statusElement.textContent = "";
      this.renderCurrentQuestion();
      this.runTimer = global.setInterval(() => {
        if (!this.currentRun) { global.clearInterval(this.runTimer); return; }
        this.currentRun.secondsLeft--;
        const timer = document.getElementById("academy-run-timer");
        if (timer) timer.textContent = this.formatTime(this.currentRun.secondsLeft);
        if (this.currentRun.secondsLeft <= 0) this.finishQuestionRun();
      }, 1000);
    }

    formatTime(seconds) {
      const safe = Math.max(0, seconds);
      return String(Math.floor(safe / 60)).padStart(2, "0") + ":" + String(safe % 60).padStart(2, "0");
    }

    renderCurrentQuestion() {
      const box = document.getElementById("cambridge-b2-panel");
      const run = this.currentRun;
      if (!box || !run) return;
      if (run.index >= run.questions.length) { this.finishQuestionRun(); return; }
      const q = run.questions[run.index];
      box.innerHTML = '<div class="academy-run-header"><div><span class="academy-eyebrow">' + escapeHTML(run.kind === "practice" ? "SIMULACRO BREVE" : run.kind === "quick" ? "EVALUACIÓN RÁPIDA" : "PRÁCTICA PERSONALIZADA") + '</span><h3>Pregunta ' + (run.index + 1) + ' de ' + run.questions.length + '</h3></div><strong id="academy-run-timer">' + this.formatTime(run.secondsLeft) + '</strong></div><div class="academy-progress-track"><span style="width:' + (run.index / run.questions.length * 100) + '%"></span></div><article class="academy-question-card"><p class="academy-eyebrow">' + escapeHTML(q.skill || run.skill) + '</p><h3>' + escapeHTML(q.question) + '</h3><div class="academy-options">' + (q.options || []).map((option, index) => '<button class="academy-option" onclick="app.academyHub.answerCurrentQuestion(' + index + ')">' + escapeHTML(option) + '</button>').join("") + '</div><p id="academy-question-feedback" class="academy-feedback" aria-live="polite"></p></article><button class="btn btn-ghost" onclick="app.academyHub.finishQuestionRun()">Finalizar ahora</button>';
    }

    answerCurrentQuestion(choiceIndex) {
      const run = this.currentRun;
      if (!run) return;
      const q = run.questions[run.index];
      if (!q || q._answered) return;
      const chosen = (q.options || [])[choiceIndex];
      if (chosen == null) return;
      q._answered = true;
      const correct = chosen === q.correctAnswer;
      if (correct) run.score++;
      else run.wrong.push({ skill: q.skill || run.skill, question: q.question, correctAnswer: q.correctAnswer });
      document.querySelectorAll("#cambridge-b2-panel .academy-option").forEach((button, index) => {
        button.disabled = true;
        if (q.options[index] === q.correctAnswer) button.classList.add("is-correct");
        else if (index === choiceIndex) button.classList.add("is-wrong");
      });
      const feedback = document.getElementById("academy-question-feedback");
      if (feedback) feedback.textContent = (correct ? "Correcto. " : "Revisa esta respuesta. ") + (q.explanation || ("Respuesta: " + q.correctAnswer));
      this.recordQuestion({ source: "Cambridge B2", skill: q.skill || run.skill, question: q.question, answer: chosen, correctAnswer: q.correctAnswer, isCorrect: correct });
      const metricSkill = ["grammar", "vocabulary", "reading", "listening", "writing", "speaking"].includes(q.skill) ? q.skill : "grammar";
      this.app.adaptiveEngine && this.app.adaptiveEngine.recordActivity({ skill: metricSkill, topic: "Cambridge B2 - " + (q.skill || run.skill), difficulty: "B2", isCorrect: correct, userAnswer: chosen, correctAnswer: q.correctAnswer });
      run.index++;
      global.setTimeout(() => {
        if (this.currentRun === run) this.renderCurrentQuestion();
      }, 1000);
    }

    finishQuestionRun() {
      const run = this.currentRun;
      if (!run) return;
      if (this.runTimer) global.clearInterval(this.runTimer);
      this.runTimer = null;
      this.currentRun = null;
      const total = run.questions.length;
      const pct = Math.round(run.score / total * 100);
      const misses = run.wrong;
      const weak = Array.from(new Set(misses.map((item) => item.skill || "Use of English")));
      const predictive = [];
      if (pct >= 80) predictive.push("Buen desempeño en esta muestra: mantén la práctica y comprueba que puedas repetirlo en otros formatos.");
      else if (pct >= 60) predictive.push("Rendimiento en desarrollo: consolida las estructuras y el vocabulario que fallaste antes de aumentar la dificultad.");
      else predictive.push("Esta muestra señala que conviene reforzar los fundamentos y practicar por partes, en lugar de realizar simulacros completos de inmediato.");
      if (weak.length) predictive.push("Áreas donde se concentraron los errores: " + weak.join(", ") + ".");
      if (misses.length) predictive.push("Revisa las explicaciones de las respuestas incorrectas y registra los patrones que se repiten.");
      else predictive.push("No se registraron errores en esta muestra. Comprueba la consistencia con una práctica diferente.");
      const record = {
        date: new Date().toISOString(), kind: run.kind, title: run.kind === "practice" ? "Simulacro breve B2" : run.kind === "quick" ? "Evaluación rápida B2" : "Preguntas personalizadas B2",
        score: run.score, total: total, percentage: pct, weakAreas: weak, predictiveNotes: predictive
      };
      this.state.examResults.unshift(record);
      this.state.examResults = this.state.examResults.slice(0, 30);
      this.saveState();
      if (run.score > 0) this.app.addXp(Math.min(35, run.score * 3));
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      box.innerHTML = '<div class="academy-result"><span class="academy-eyebrow">RESULTADO FORMATIVO</span><h3>' + escapeHTML(record.title) + '</h3><div class="academy-result-score">' + pct + '%</div><p>' + run.score + ' de ' + total + ' respuestas correctas</p><div class="academy-predictive-notes"><h4>Predictive Notes</h4><ul>' + predictive.map((note) => '<li>' + escapeHTML(note) + '</li>').join("") + '</ul></div><p class="academy-disclaimer">Este resultado describe únicamente el conjunto de práctica realizado. No equivale a una puntuación Cambridge English Scale, una predicción validada ni una decisión sobre la aprobación del examen.</p><div class="academy-shortcuts"><button class="btn btn-primary" onclick="app.academyHub.setCambridgeTab(\\'' + (run.kind === "practice" ? "practice" : run.kind === "custom" ? "custom" : "quick") + '\\')">Repetir práctica</button><button class="btn btn-secondary" onclick="app.navigate(\\'progress\\')">Ver progreso</button></div></div>';
    }

    recordExamLikeResult(title, score, total) {
      const percentage = total ? Math.round(score / total * 100) : 0;
      this.state.examResults.unshift({ date: new Date().toISOString(), kind: "vocabulary", title: title, score: score, total: total, percentage: percentage, weakAreas: [] });
      this.state.examResults = this.state.examResults.slice(0, 30);
      this.saveState();
    }

    recordQuestion(entry) {
      this.state.questionLog.unshift({
        date: new Date().toISOString(),
        source: entry.source || "Práctica",
        skill: entry.skill || "general",
        question: String(entry.question || "").slice(0, 240),
        answer: String(entry.answer || "").slice(0, 160),
        correctAnswer: String(entry.correctAnswer || "").slice(0, 160),
        isCorrect: Boolean(entry.isCorrect)
      });
      this.state.questionLog = this.state.questionLog.slice(0, 100);
      this.saveState();
    }

    renderExamChat() {
      const box = document.getElementById("exam-chat-content");
      if (!box) return;
      box.innerHTML = '<div class="academy-chat-card"><div class="academy-chat-messages" id="academy-exam-chat-messages">' +
        (this.examChatHistory.length ? this.examChatHistory.map((message) => '<div class="academy-chat-message ' + (message.role === "user" ? "is-user" : "is-assistant") + '"><span>' + (message.role === "user" ? "Tú" : "Tutor Aura100") + '</span><p>' + escapeHTML(message.content) + '</p></div>').join("") : '<div class="academy-chat-message is-assistant"><span>Tutor Aura100</span><p>Pregunta sobre las partes del B2 First, el tiempo disponible, los tipos de tareas o cómo organizar tu preparación.</p></div>') +
        '</div><form class="academy-chat-form" onsubmit="event.preventDefault();app.academyHub.sendExamChatMessage()"><textarea id="academy-exam-chat-input" class="text-input" rows="2" maxlength="2000" placeholder="Escribe tu duda sobre el examen..."></textarea><button class="btn btn-primary" type="submit">Enviar pregunta</button></form><p id="academy-exam-chat-status" class="academy-muted" aria-live="polite">El tutor ofrece orientación educativa; revisa las instrucciones de tu convocatoria con tu centro examinador.</p></div>';
      const messages = document.getElementById("academy-exam-chat-messages");
      if (messages) messages.scrollTop = messages.scrollHeight;
    }

    async sendExamChatMessage() {
      const input = document.getElementById("academy-exam-chat-input");
      const status = document.getElementById("academy-exam-chat-status");
      const message = String(input?.value || "").trim();
      if (!message) return;
      if (message.length > 2000) return;
      this.examChatHistory.push({ role: "user", content: message });
      if (input) input.value = "";
      this.renderExamChat();
      if (status) status.textContent = "El tutor está preparando una respuesta...";
      let reply = "";
      try {
        if (!global.Aura100AI || typeof global.Aura100AI.chat !== "function") throw new Error("AI unavailable");
        reply = await global.Aura100AI.chat({
          message: message,
          level: "B2",
          scenario: "cambridge_exam",
          history: this.examChatHistory.slice(0, -1).slice(-8).map((item) => ({ role: item.role, content: item.content }))
        });
      } catch (error) {
        reply = "No pude conectar con el servicio de IA. Como orientación general, identifica primero la parte del examen a la que se refiere tu duda y consulta las instrucciones oficiales de Cambridge o de tu centro examinador. Puedes volver a enviar la pregunta cuando el servicio esté disponible.";
      }
      this.examChatHistory.push({ role: "assistant", content: reply });
      this.examChatHistory = this.examChatHistory.slice(-20);
      this.state.examChatHistory = this.examChatHistory;
      this.saveState();
      this.renderExamChat();
    }

    renderProgressExtras() {
      const box = document.getElementById("progress-extras");
      if (!box) return;
      const exams = this.state.examResults.slice(0, 5);
      const questions = this.state.questionLog.slice(0, 12);
      const notes = this.state.notes.slice(0, 12);
      const summary = this.state.progressSummary || "Genera un análisis con IA a partir de tus resultados, preguntas registradas y dificultades recientes.";
      box.innerHTML = '<section class="academy-progress-card"><div class="academy-progress-heading"><div><span class="academy-eyebrow">ANÁLISIS PERSONAL</span><h3>Resumen de progreso con IA</h3></div><button class="btn btn-primary btn-sm" onclick="app.academyHub.generateProgressSummary()">Generar resumen IA</button></div><div id="academy-progress-summary" class="academy-summary-text">' + escapeHTML(summary) + '</div><div class="academy-progress-metrics"><article><strong>' + this.state.examResults.length + '</strong><span>Evaluaciones</span></article><article><strong>' + this.state.questionLog.length + '</strong><span>Preguntas registradas</span></article><article><strong>' + this.state.notes.length + '</strong><span>Notas personales</span></article></div></section><div class="academy-progress-columns"><section class="academy-progress-card"><h3>Registro de preguntas</h3>' +
        (questions.length ? '<div class="academy-log-list">' + questions.map((item) => '<article><div><strong>' + escapeHTML(item.source) + '</strong><small>' + new Date(item.date).toLocaleString("es-PE") + '</small></div><p>' + escapeHTML(item.question) + '</p><span class="' + (item.isCorrect ? "academy-status-good" : "academy-status-review") + '">' + (item.isCorrect ? "Correcta" : "Revisar") + '</span></article>').join("") + '</div>' : '<p class="academy-muted">Todavía no hay preguntas registradas.</p>') +
        '</section><section class="academy-progress-card"><h3>Mis notas</h3><form class="academy-note-form" onsubmit="event.preventDefault();app.academyHub.addProgressNote()"><textarea id="academy-note-input" class="text-input" rows="3" maxlength="500" placeholder="Anota una duda, una regla gramatical o un objetivo..."></textarea><button class="btn btn-secondary btn-sm" type="submit">Guardar nota</button></form>' +
        (notes.length ? '<div class="academy-note-list">' + notes.map((note, index) => '<article><p>' + escapeHTML(note.text) + '</p><small>' + new Date(note.date).toLocaleString("es-PE") + '</small><button type="button" class="academy-remove-note" onclick="app.academyHub.removeProgressNote(' + index + ')">Eliminar</button></article>').join("") + '</div>' : '<p class="academy-muted">Tus notas aparecerán aquí.</p>') +
        '</section></div><section class="academy-progress-card"><h3>Últimas evaluaciones</h3>' +
        (exams.length ? '<div class="academy-exam-history">' + exams.map((result) => '<article><div><strong>' + escapeHTML(result.title) + '</strong><small>' + new Date(result.date).toLocaleDateString("es-PE") + '</small></div><strong>' + result.percentage + '%</strong></article>').join("") + '</div>' : '<p class="academy-muted">Completa una evaluación para crear tu historial.</p>') + '</section>';
    }

    async generateProgressSummary() {
      const output = document.getElementById("academy-progress-summary");
      if (output) output.textContent = "Analizando tu historial de aprendizaje...";
      const skills = this.app.adaptiveEngine?.metrics?.skills || {};
      const skillSummary = Object.entries(skills).map(([name, value]) => ({
        skill: name, accuracy: value.accuracy || 0, attempts: value.attempts || 0
      }));
      const weakTopics = this.weakestTopics();
      const recentExams = this.state.examResults.slice(0, 5).map((result) => ({
        title: result.title, percentage: result.percentage, weakAreas: result.weakAreas || []
      }));
      const message = "Escribe un resumen educativo en español, claro y específico, de unas 150-220 palabras. Usa solo estos datos; no inventes tendencias ni resultados. Señala fortalezas respaldadas por intentos suficientes, áreas que necesitan más evidencia, errores recurrentes y tres próximos pasos realistas. No conviertas estas métricas en una nota Cambridge ni predigas aprobación. Datos de competencias: " + JSON.stringify(skillSummary) + ". Temas débiles registrados: " + JSON.stringify(weakTopics) + ". Evaluaciones recientes: " + JSON.stringify(recentExams) + ". Preguntas registradas: " + this.state.questionLog.length + ". Tarjetas de vocabulario: " + ((this.app.state.ankiDeck || []).length) + ". Lecciones completadas: " + ((this.app.state.completedLessons || []).length) + ".";
      let result = "";
      try {
        if (!global.Aura100AI || typeof global.Aura100AI.chat !== "function") throw new Error("AI unavailable");
        result = await global.Aura100AI.chat({ message: message, level: this.app.state.targetCefr || "B1", scenario: "study_coach", history: [] });
      } catch (_) {
        const sorted = skillSummary.filter((item) => item.attempts > 0).sort((a, b) => b.accuracy - a.accuracy);
        result = "Tu registro incluye " + this.state.questionLog.length + " preguntas, " + recentExams.length + " evaluaciones recientes y " + ((this.app.state.completedLessons || []).length) + " lecciones completadas. " +
          (sorted.length ? "La competencia con mayor precisión registrada es " + sorted[0].skill + " (" + sorted[0].accuracy + "%), mientras que " + sorted[sorted.length - 1].skill + " requiere más práctica (" + sorted[sorted.length - 1].accuracy + "%). " : "Todavía hay pocos intentos para comparar tus competencias. ") +
          (weakTopics.length ? "Temas que conviene revisar: " + weakTopics.join(", ") + ". " : "Registra más actividades para detectar dificultades concretas. ") +
          "Próximos pasos: practica una habilidad por sesión, revisa las explicaciones de tus errores y repite una evaluación breve después de estudiar. Este análisis es orientativo y no representa una nota oficial.";
      }
      this.state.progressSummary = result;
      this.saveState();
      if (output) output.textContent = result;
    }

    addProgressNote() {
      const input = document.getElementById("academy-note-input");
      const text = String(input?.value || "").trim().slice(0, 500);
      if (!text) return;
      this.state.notes.unshift({ date: new Date().toISOString(), text: text });
      this.state.notes = this.state.notes.slice(0, 100);
      this.saveState();
      this.renderProgressExtras();
    }

    removeProgressNote(index) {
      if (!Number.isInteger(index) || index < 0 || index >= this.state.notes.length) return;
      this.state.notes.splice(index, 1);
      this.saveState();
      this.renderProgressExtras();
    }
  }

  const app = global.app;
  if (!app) {
    console.error("Academy Hub could not initialise: Aura100 app was not found.");
    return;
  }

  app.academyHub = new AcademyHub(app);
  const originalNavigate = app.navigate.bind(app);
  app.navigate = function (viewId) {
    originalNavigate(viewId);
    if (viewId === "calendar") app.academyHub.renderCalendar();
    if (viewId === "daily-games") app.academyHub.renderDailyGames();
    if (viewId === "cambridge-b2") app.academyHub.renderCambridge();
    if (viewId === "exam-chat") app.academyHub.renderExamChat();
    if (viewId === "word-bank") app.academyHub.setVocabularyTab(app.academyHub.vocabularyTab);
    if (viewId === "progress") app.academyHub.renderProgressExtras();
  };
})(window);
