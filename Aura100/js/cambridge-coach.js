(function (global) {
  "use strict";

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function normalise(value) {
    return String(value || "").toLowerCase().trim().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
  }

  const SKILLS = {
    grammar: "Gramática", vocabulary: "Vocabulario", reading: "Reading",
    listening: "Listening", writing: "Writing", speaking: "Speaking"
  };

  const SPEAKING_PARTS = {
    "1": { title: "Part 1 - Interview", task: "Ask one natural personal-interest question at a time about studies, free time, routines and preferences. Ask a brief follow-up after each answer. Do not request private information." },
    "2": { title: "Part 2 - Long turn", task: "Give the learner this original photo-comparison prompt in text: Photo A shows students working together on a science project in a classroom. Photo B shows a student studying alone in a public library. Ask the learner to compare the situations and say what the students might find challenging. Give them a long turn, then ask one short follow-up." },
    "3": { title: "Part 3 - Collaborative task", task: "Set an original collaborative task: A school wants to help students develop useful skills outside lessons. Discuss these options: a debating club, a coding club, volunteering, a sports team, and a student newspaper. Ask the learner to consider options and reach a decision with you. Act as an interactive partner, not a lecturer." },
    "4": { title: "Part 4 - Discussion", task: "Ask broader follow-up questions about learning outside the classroom, teamwork, creativity and useful skills. Ask one question at a time and invite reasons or examples." }
  };

  const LISTENING_SAMPLE = {
    title: "A student project at the local museum",
    script: "Last spring, our school organised a project with the local museum. At first, we expected to spend most of our time reading documents, but the museum staff invited us to interview visitors instead. Each team had to prepare a short questionnaire and collect at least twenty responses. My group focused on how teenagers use the town's public spaces. The most surprising result was that students preferred places with free activities, even when those places were further from home. We presented our findings on a Friday afternoon. The museum has now offered to display a selection of our posters during the summer holidays. I learned that research is more interesting when you speak directly to people.",
    gaps: [
      { prompt: "The project was organised with the local ____.", answer: "museum" },
      { prompt: "Each team had to prepare a short ____.", answer: "questionnaire" },
      { prompt: "The group studied how teenagers use public ____.", answer: "spaces" },
      { prompt: "Students preferred places with free ____.", answer: "activities" },
      { prompt: "The posters may be displayed during the summer ____.", answer: "holidays" }
    ]
  };

  class CambridgeCoach {
    constructor(app, hub) {
      this.app = app;
      this.hub = hub;
      this.storageKey = "aura100_cambridge_coach_v1";
      this.state = this.loadState();
      this.speakingPart = "1";
      this.speakingHistory = [];
      this.speakingBusy = false;
      this.listeningPlays = 0;
    }

    loadState() {
      const fallback = { mock: { reading: null, writing: null, listening: null, speaking: null }, lastListening: null };
      try {
        const parsed = JSON.parse(localStorage.getItem(this.storageKey) || "null");
        if (!parsed || typeof parsed !== "object") return fallback;
        return {
          ...fallback,
          ...parsed,
          mock: { ...fallback.mock, ...(parsed.mock || {}) }
        };
      } catch (_) { return fallback; }
    }

    saveState() {
      try { localStorage.setItem(this.storageKey, JSON.stringify(this.state)); }
      catch (error) { console.warn("Cambridge coach storage unavailable.", error); }
    }

    markSection(section, result) {
      if (!Object.prototype.hasOwnProperty.call(this.state.mock, section)) return;
      this.state.mock[section] = { date: new Date().toISOString(), ...(result || {}) };
      this.saveState();
    }

    resetMock() {
      this.state.mock = { reading: null, writing: null, listening: null, speaking: null };
      this.saveState();
      this.renderMock();
    }

    render(tab) {
      if (tab === "coach-progress") return this.renderProgress();
      if (tab === "coach-adaptive") return this.renderAdaptive();
      if (tab === "coach-speaking") return this.renderSpeaking();
      if (tab === "coach-mock") return this.renderMock();
    }

    renderProgress() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      const metrics = this.app.adaptiveEngine && this.app.adaptiveEngine.metrics ? this.app.adaptiveEngine.metrics.skills : {};
      const entries = Object.keys(SKILLS).map((key) => {
        const item = metrics[key] || { attempts: 0, accuracy: 0 };
        return { key, name: SKILLS[key], attempts: Number(item.attempts || 0), accuracy: Number(item.accuracy || 0) };
      });
      const practiced = entries.filter(item => item.attempts > 0);
      const weakest = practiced.slice().sort((a,b) => a.accuracy - b.accuracy)[0];
      const leastPracticed = entries.slice().sort((a,b) => a.attempts - b.attempts)[0];
      const totalAttempts = entries.reduce((sum,item) => sum + item.attempts, 0);
      const completed = Object.values(this.state.mock).filter(Boolean).length;
      const cards = entries.map(item => {
        const width = item.attempts ? Math.max(0, Math.min(100, item.accuracy)) : 0;
        return '<article class="cc-skill-card"><div class="cc-skill-top"><strong>' + escapeHTML(item.name) + '</strong><span>' + (item.attempts ? item.accuracy + '%' : 'Sin datos') + '</span></div><div class="cc-meter"><span style="width:' + width + '%"></span></div><small>' + item.attempts + ' intentos registrados</small></article>';
      }).join("");
      const recommendation = weakest && weakest.attempts >= 3
        ? "Conviene priorizar " + weakest.name + ": registra " + weakest.accuracy + "% de precisión en " + weakest.attempts + " intentos."
        : "Todavía hay poca evidencia para identificar una debilidad estable. Practica " + leastPracticed.name + " y completa más actividades para obtener un diagnóstico fiable.";
      box.innerHTML =
        '<section class="cc-panel"><div class="cc-heading"><div><span class="academy-eyebrow">ETAPA 1 · DIAGNÓSTICO ADAPTATIVO</span><h3>Tu perfil Cambridge B2</h3><p>El diagnóstico utiliza tus actividades registradas en Aura100. No interpreta la falta de intentos como un nivel bajo.</p></div><div class="cc-total"><strong>' + totalAttempts + '</strong><span>intentos</span></div></div>' +
        '<div class="cc-skill-grid">' + cards + '</div>' +
        '<div class="cc-recommendation"><span class="academy-eyebrow">SIGUIENTE PRIORIDAD</span><p>' + escapeHTML(recommendation) + '</p><button class="btn btn-primary" onclick="app.academyHub.setCambridgeTab(\'coach-adaptive\')">Practicar área prioritaria</button></div>' +
        '<div class="cc-two-col"><article><h4>Historial Cambridge</h4><p>' + (this.hub.state.examResults.length ? this.hub.state.examResults.slice(0,3).map(r => escapeHTML(r.title) + ': ' + r.percentage + '%').join("<br>") : 'Aún no hay evaluaciones Cambridge registradas.') + '</p></article><article><h4>Recomendación de estudio</h4><p>' + escapeHTML(recommendation) + '</p><button class="btn btn-secondary" onclick="app.learningPlanManager && app.learningPlanManager.generatePersonalizedPlan(30, \'Preparación Cambridge B2 First con refuerzo de habilidades débiles\')">Crear plan semanal adaptativo</button></article></div>' +
        '<p class="academy-disclaimer">Los porcentajes describen el rendimiento de las actividades registradas. No equivalen a una puntuación Cambridge English Scale ni permiten predecir un resultado oficial.</p></section>';
    }

    renderAdaptive() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      const metrics = this.app.adaptiveEngine && this.app.adaptiveEngine.metrics ? this.app.adaptiveEngine.metrics.skills : {};
      const weak = Object.entries(metrics).filter(entry => Number(entry[1] && entry[1].attempts) > 0)
        .sort((a,b) => Number(a[1].accuracy || 0) - Number(b[1].accuracy || 0))[0];
      const selected = weak ? weak[0] : "use_of_english";
      box.innerHTML = '<section class="cc-panel"><span class="academy-eyebrow">ETAPA 1 · PRÁCTICA ADAPTATIVA</span><h3>Entrena según tus resultados</h3><p>La práctica genera preguntas originales y registra tus respuestas en el motor adaptativo de Aura100.</p>' +
        '<div class="cc-form-grid"><label>Habilidad<select id="cc-adaptive-skill" class="custom-select"><option value="use_of_english">Reading and Use of English</option><option value="reading">Reading</option><option value="grammar">Grammar</option><option value="vocabulary">Vocabulary</option></select></label><label>Enfoque<select id="cc-adaptive-focus" class="custom-select"><option value="weak">Mis áreas con menor precisión</option><option value="mixed">Práctica mixta B2</option><option value="transformations">Key word transformations</option><option value="collocations">Collocations and phrasal verbs</option><option value="open-cloze">Open cloze and grammar words</option></select></label><label>Número de preguntas<select id="cc-adaptive-count" class="custom-select"><option value="5">5 preguntas</option><option value="8">8 preguntas</option><option value="10">10 preguntas</option></select></label></div>' +
        '<button class="btn btn-primary" onclick="app.academyHub.cambridgeCoach.startAdaptivePractice()">Generar práctica personalizada</button><p class="academy-muted" id="cc-adaptive-status" aria-live="polite">Área prioritaria detectada: ' + escapeHTML(SKILLS[selected] || selected) + '.</p></section>';
      const select = document.getElementById("cc-adaptive-skill");
      if (select && selected !== "use_of_english" && ["reading","grammar","vocabulary"].includes(selected)) select.value = selected;
    }

    async startAdaptivePractice() {
      const skill = document.getElementById("cc-adaptive-skill")?.value || "use_of_english";
      const focus = document.getElementById("cc-adaptive-focus")?.value || "weak";
      const count = Number(document.getElementById("cc-adaptive-count")?.value || 5);
      const topics = this.hub.weakestTopics();
      const focusText = {
        weak: "Focus on the learner's weak areas: " + topics.join(", "),
        mixed: "Mixed B2 First grammar, vocabulary and reading inference",
        transformations: "Cambridge B2 First key word transformations. Create original sentence transformation practice.",
        collocations: "B2 collocations, phrasal verbs and fixed expressions",
        "open-cloze": "B2 open cloze: articles, prepositions, auxiliaries, pronouns and linking words"
      }[focus];
      await this.hub.startQuestionRun("custom", count, focusText, skill);
    }

    renderSpeaking() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      box.innerHTML = '<section class="cc-panel"><span class="academy-eyebrow">ETAPA 2 · SPEAKING CON IA</span><h3>Simulación de Speaking</h3><p>Practica las cuatro partes con un interlocutor de IA. En esta versión escribirás tus respuestas; por ello, no se evaluarán pronunciación, entonación ni fluidez oral real.</p>' +
        '<div class="cc-form-grid"><label>Parte del examen<select id="cc-speaking-part" class="custom-select"><option value="1">Part 1 - Interview</option><option value="2">Part 2 - Long turn</option><option value="3">Part 3 - Collaborative task</option><option value="4">Part 4 - Discussion</option></select></label><button class="btn btn-primary" onclick="app.academyHub.cambridgeCoach.startSpeaking()">Iniciar simulación</button></div>' +
        '<div id="cc-speaking-thread" class="cc-speaking-thread"><p class="academy-muted">Selecciona una parte y comienza la práctica.</p></div>' +
        '<form id="cc-speaking-form" class="cc-speaking-form" onsubmit="event.preventDefault();app.academyHub.cambridgeCoach.sendSpeaking()"><textarea id="cc-speaking-input" class="text-input" rows="3" maxlength="1800" placeholder="Write your answer in English..." disabled></textarea><button class="btn btn-primary" type="submit" disabled>Enviar respuesta</button><button class="btn btn-secondary" type="button" onclick="app.academyHub.cambridgeCoach.finishSpeaking()" disabled>Finalizar y recibir feedback</button></form>' +
        '<p id="cc-speaking-status" class="academy-muted" aria-live="polite"></p></section>';
    }

    renderSpeakingMessages() {
      const thread = document.getElementById("cc-speaking-thread");
      if (!thread) return;
      thread.innerHTML = this.speakingHistory.map(item =>
        '<article class="cc-speaking-message ' + (item.role === "user" ? "is-user" : "is-ai") + '"><strong>' + (item.role === "user" ? "Tú" : "Interlocutor") + '</strong><p>' + escapeHTML(item.content) + '</p></article>'
      ).join("");
      thread.scrollTop = thread.scrollHeight;
    }

    async startSpeaking() {
      const part = document.getElementById("cc-speaking-part")?.value || "1";
      const status = document.getElementById("cc-speaking-status");
      this.speakingPart = part;
      this.speakingHistory = [];
      this.speakingBusy = true;
      if (status) status.textContent = "Preparando la simulación...";
      const controls = document.querySelectorAll("#cc-speaking-form textarea, #cc-speaking-form button");
      controls.forEach(control => { control.disabled = true; });
      try {
        const result = await global.Aura100AI.chat({
          level: "B2", scenario: "cambridge_speaking", history: [],
          message: "Start Cambridge B2 First Speaking " + SPEAKING_PARTS[part].title + ". " + SPEAKING_PARTS[part].task + " Act as the interlocutor. Give only the first prompt now, in English. Do not give model answers."
        });
        this.speakingHistory.push({ role: "assistant", content: result });
        this.renderSpeakingMessages();
        controls.forEach(control => { control.disabled = false; });
        if (status) status.textContent = "Simulación activa. Responde en inglés; puedes finalizar cuando quieras.";
      } catch (error) {
        if (status) status.textContent = "No se pudo iniciar la IA. Comprueba la conexión y vuelve a intentarlo.";
      } finally { this.speakingBusy = false; }
    }

    async sendSpeaking() {
      if (this.speakingBusy) return;
      const input = document.getElementById("cc-speaking-input");
      const message = String(input?.value || "").trim();
      const status = document.getElementById("cc-speaking-status");
      if (!message) return;
      this.speakingHistory.push({ role: "user", content: message });
      if (input) input.value = "";
      this.renderSpeakingMessages();
      this.speakingBusy = true;
      if (status) status.textContent = "El interlocutor está respondiendo...";
      try {
        const reply = await global.Aura100AI.chat({
          level: "B2", scenario: "cambridge_speaking",
          message: message,
          history: this.speakingHistory.slice(-9, -1).map(item => ({ role: item.role, content: item.content }))
        });
        this.speakingHistory.push({ role: "assistant", content: reply });
        this.speakingHistory = this.speakingHistory.slice(-12);
        this.renderSpeakingMessages();
        if (status) status.textContent = "Puedes continuar o finalizar para recibir retroalimentación.";
      } catch (error) {
        if (status) status.textContent = "No se pudo enviar la respuesta. Inténtalo nuevamente.";
      } finally { this.speakingBusy = false; }
    }

    async finishSpeaking() {
      if (this.speakingBusy || !this.speakingHistory.length) return;
      const status = document.getElementById("cc-speaking-status");
      this.speakingBusy = true;
      if (status) status.textContent = "Analizando tu desempeño...";
      try {
        const feedback = await global.Aura100AI.chat({
          level: "B2", scenario: "cambridge_speaking",
          message: "End the simulation and provide feedback in Spanish. Evaluate only the written evidence in this transcript using B2 Speaking dimensions: Grammar and Vocabulary, Discourse Management, and Interactive Communication. Give two strengths, up to three priorities and one short practice goal. State clearly that pronunciation and actual spoken fluency cannot be assessed from typed answers. Do not give an official Cambridge score.",
          history: this.speakingHistory.slice(-10).map(item => ({ role: item.role, content: item.content }))
        });
        this.speakingHistory.push({ role: "assistant", content: "FEEDBACK FINAL\n" + feedback });
        this.renderSpeakingMessages();
        this.markSection("speaking", { feedback: "completed" });
        if (status) status.textContent = "Simulación completada y registrada en tu simulacro integrado.";
      } catch (error) {
        if (status) status.textContent = "No se pudo generar el feedback. Puedes volver a intentarlo.";
      } finally { this.speakingBusy = false; }
    }

    renderListening() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      this.listeningPlays = 0;
      box.innerHTML = '<section class="cc-panel"><span class="academy-eyebrow">ETAPA 3 · LISTENING</span><h3>' + escapeHTML(LISTENING_SAMPLE.title) + '</h3><p>Escucha el texto y completa las cinco palabras. Puedes reproducirlo un máximo de dos veces, como en una práctica guiada. El audio utiliza la voz disponible en tu navegador.</p><div class="cc-listening-controls"><button class="btn btn-primary" id="cc-play-listening" onclick="app.academyHub.cambridgeCoach.playListening()">Reproducir audio (0/2)</button><span id="cc-listening-status" class="academy-muted">No se ha reproducido.</span></div><div class="cc-gap-list">' +
        LISTENING_SAMPLE.gaps.map((gap,index) => '<label>' + (index+1) + '. ' + escapeHTML(gap.prompt) + '<input class="text-input" id="cc-listening-' + index + '" maxlength="40" autocomplete="off"></label>').join("") +
        '</div><button class="btn btn-primary" onclick="app.academyHub.cambridgeCoach.submitListening()">Comprobar respuestas</button><div id="cc-listening-result" aria-live="polite"></div><p class="academy-disclaimer">Actividad original de Aura100 para práctica. No es un audio oficial de Cambridge ni reproduce un examen publicado.</p></section>';
    }

    playListening() {
      const status = document.getElementById("cc-listening-status");
      const button = document.getElementById("cc-play-listening");
      if (this.listeningPlays >= 2) {
        if (status) status.textContent = "Has utilizado las dos reproducciones.";
        return;
      }
      if (!("speechSynthesis" in global) || typeof SpeechSynthesisUtterance === "undefined") {
        if (status) status.textContent = "Tu navegador no admite reproducción de voz. Puedes continuar con el ejercicio escrito.";
        return;
      }
      this.listeningPlays++;
      const utterance = new SpeechSynthesisUtterance(LISTENING_SAMPLE.script);
      utterance.lang = "en-GB";
      utterance.rate = 0.92;
      utterance.onend = () => { if (status) status.textContent = "Reproducción " + this.listeningPlays + " de 2 completada."; };
      global.speechSynthesis.cancel();
      global.speechSynthesis.speak(utterance);
      if (button) button.textContent = "Reproducir audio (" + this.listeningPlays + "/2)";
      if (status) status.textContent = "Reproduciendo...";
    }

    submitListening() {
      const answers = LISTENING_SAMPLE.gaps.map((gap,index) => normalise(document.getElementById("cc-listening-" + index)?.value));
      const results = answers.map((answer,index) => answer === normalise(LISTENING_SAMPLE.gaps[index].answer));
      const score = results.filter(Boolean).length;
      const output = document.getElementById("cc-listening-result");
      if (output) output.innerHTML = '<div class="cc-recommendation"><strong>Resultado: ' + score + '/5</strong><p>' + results.map((ok,index) => (ok ? 'Correcto' : 'Revisa: ' + LISTENING_SAMPLE.gaps[index].answer) + ' - ' + LISTENING_SAMPLE.gaps[index].prompt).map(escapeHTML).join('<br>') + '</p></div>';
      this.markSection("listening", { score, total: 5, percentage: Math.round(score / 5 * 100) });
    }

    renderMock() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      const labels = {
        reading: ["Reading and Use of English", "10 preguntas originales de práctica B2", "Iniciar sección"],
        writing: ["Writing", "Ensayo de 140-190 palabras con evaluación IA", "Abrir Writing"],
        listening: ["Listening", "Audio breve y cinco preguntas de comprensión", "Iniciar Listening"],
        speaking: ["Speaking", "Simulación interactiva de las cuatro partes", "Iniciar Speaking"]
      };
      const done = Object.entries(this.state.mock).filter(entry => Boolean(entry[1])).length;
      const cards = Object.entries(labels).map(([key,item]) => {
        const result = this.state.mock[key];
        const status = result ? "Completado" + (Number.isFinite(result.percentage) ? " · " + result.percentage + "%" : Number.isFinite(result.score) ? " · " + result.score + "/" + result.total : "") : "Pendiente";
        return '<article class="cc-mock-card"><div><span class="academy-eyebrow">' + key.toUpperCase() + '</span><h4>' + item[0] + '</h4><p>' + item[1] + '</p><small class="' + (result ? 'cc-done' : '') + '">' + status + '</small></div><button class="btn btn-secondary" onclick="app.academyHub.cambridgeCoach.openMockSection(\'' + key + '\')">' + item[2] + '</button></article>';
      }).join("");
      box.innerHTML = '<section class="cc-panel"><div class="cc-heading"><div><span class="academy-eyebrow">ETAPA 3 · SIMULACRO INTEGRADO</span><h3>Cambridge B2 First - práctica de las cuatro pruebas</h3><p>Completa cada componente en el orden que prefieras. El simulacro es una versión breve y formativa, no una reproducción del examen oficial completo.</p></div><div class="cc-total"><strong>' + done + '/4</strong><span>secciones</span></div></div><div class="cc-mock-grid">' + cards + '</div>' +
        (done === 4 ? '<div class="cc-recommendation"><span class="academy-eyebrow">SIMULACRO COMPLETADO</span><h4>Has completado las cuatro habilidades</h4><p>Reading: ' + (this.state.mock.reading.percentage || 0) + '% · Writing: ' + (this.state.mock.writing.overallScore || 0) + '% · Listening: ' + (this.state.mock.listening.percentage || 0) + '% · Speaking: feedback cualitativo registrado.</p><p>Usa los resultados para decidir qué practicar de nuevo. No se calcula una puntuación Cambridge English Scale.</p><button class="btn btn-secondary" onclick="app.academyHub.cambridgeCoach.resetMock()">Reiniciar simulacro</button></div>' : '<p class="academy-muted">Tu avance se guarda en este navegador. Sección completada: ' + done + ' de 4.</p>') +
        '<p class="academy-disclaimer">El componente Listening utiliza síntesis de voz del navegador y el Speaking se realiza por texto. Estas limitaciones impiden equipararlos con una prueba oficial supervisada.</p></section>';
    }

    openMockSection(section) {
      if (section === "reading") {
        this.hub.startQuestionRun("mock-reading", 10, "Original Cambridge B2 First mixed Reading and Use of English practice. Include inference, collocations, grammar and word formation.", "use_of_english");
      } else if (section === "writing") {
        this.hub.setCambridgeTab("coach-adaptive");
        this.renderWriting();
      } else if (section === "listening") {
        this.renderListening();
      } else if (section === "speaking") {
        this.renderSpeaking();
        const select = document.getElementById("cc-speaking-part");
        if (select) select.value = "1";
      }
    }

    renderWriting() {
      const box = document.getElementById("cambridge-b2-panel");
      if (!box) return;
      box.innerHTML = '<section class="cc-panel"><span class="academy-eyebrow">ETAPA 2 · WRITING CAMBRIDGE</span><h3>Part 1 - Essay</h3><p>Some people believe that schools should spend more time teaching practical skills, while others think traditional academic subjects should remain the main priority. Discuss both views and give your opinion.</p><div class="cc-writing-meta"><span>140-190 palabras</span><span>Tiempo recomendado: 40 minutos</span></div><label for="cc-writing-response">Tu ensayo en inglés</label><textarea id="cc-writing-response" class="text-input" rows="12" maxlength="4000" placeholder="Write your essay here..."></textarea><div class="cc-writing-actions"><span id="cc-writing-count" class="academy-muted">0 palabras</span><button class="btn btn-primary" onclick="app.academyHub.cambridgeCoach.submitWriting()">Evaluar con rúbrica Cambridge</button></div><div id="cc-writing-status" class="academy-muted" aria-live="polite"></div><p class="academy-disclaimer">La evaluación de Aura100 es orientativa. La rúbrica organiza el feedback según Content, Communicative Achievement, Organisation y Language; no sustituye a un examinador oficial.</p></section>';
      const input = document.getElementById("cc-writing-response");
      if (input) input.addEventListener("input", () => {
        const count = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
        const label = document.getElementById("cc-writing-count");
        if (label) label.textContent = count + " palabras";
      });
    }

    async submitWriting() {
      const input = document.getElementById("cc-writing-response");
      const status = document.getElementById("cc-writing-status");
      const text = String(input?.value || "").trim();
      const words = text ? text.split(/\s+/).length : 0;
      if (words < 100) {
        if (status) status.textContent = "Escribe un ensayo más desarrollado antes de solicitar la evaluación. El objetivo de esta tarea es 140-190 palabras.";
        return;
      }
      const lab = this.app.writingLab;
      if (!lab || typeof lab.evaluateText !== "function") {
        if (status) status.textContent = "El evaluador de Writing no está disponible.";
        return;
      }
      const task = {
        id: "cambridge_b2_first_essay",
        level: "B2",
        taskType: "essay",
        title: "Cambridge B2 First - Part 1 Essay",
        prompt: "[CAMBRIDGE_B2_FIRST_RUBRIC] " + "Some people believe that schools should spend more time teaching practical skills, while others think traditional academic subjects should remain the main priority. Discuss both views and give your opinion. Assess using the four Cambridge B2 First criteria. Target length: 140-190 words."
      };
      const originalGetTask = lab.getTask;
      const originalTaskId = lab.currentTaskId;
      lab.getTask = function () { return task; };
      lab.currentTaskId = task.id;
      if (status) status.textContent = "Evaluando tu ensayo...";
      try {
        await lab.evaluateText(text);
        this.markSection("writing", { wordCount: words, source: "writing-lab" });
        if (status) status.textContent = "Ensayo enviado al evaluador. La retroalimentación aparece en el panel de Writing Lab.";
      } finally {
        lab.getTask = originalGetTask;
        lab.currentTaskId = originalTaskId;
      }
    }
  }

  const app = global.app;
  if (!app || !app.academyHub) {
    console.error("Cambridge Coach could not initialise: Academy Hub was not found.");
    return;
  }

  const hub = app.academyHub;
  const coach = new CambridgeCoach(app, hub);
  hub.cambridgeCoach = coach;
  const originalRenderCambridge = hub.renderCambridge.bind(hub);
  const originalRenderTab = hub.renderCambridgeTab.bind(hub);
  const originalSetTab = hub.setCambridgeTab.bind(hub);
  const originalFinishRun = hub.finishQuestionRun.bind(hub);

  hub.renderCambridgeTab = function () {
    if (["coach-progress","coach-adaptive","coach-speaking","coach-mock"].includes(this.cambridgeTab)) {
      coach.render(this.cambridgeTab);
      return;
    }
    originalRenderTab();
  };

  hub.renderCambridge = function () {
    originalRenderCambridge();
    const tabs = document.querySelector("#cambridge-b2-content .academy-subtabs");
    if (!tabs) return;
    const extra = [
      ["coach-progress","Mi diagnóstico"],
      ["coach-adaptive","Práctica adaptativa"],
      ["coach-speaking","Speaking IA"],
      ["coach-mock","Simulacro integrado"]
    ];
    extra.forEach(([id,label]) => {
      if (tabs.querySelector('[data-coach-tab="' + id + '"]')) return;
      const button = document.createElement("button");
      button.className = "academy-tab" + (this.cambridgeTab === id ? " active" : "");
      button.type = "button";
      button.dataset.coachTab = id;
      button.textContent = label;
      button.addEventListener("click", () => this.setCambridgeTab(id));
      tabs.appendChild(button);
    });
    if (["coach-progress","coach-adaptive","coach-speaking","coach-mock"].includes(this.cambridgeTab)) {
      tabs.querySelectorAll(".academy-tab").forEach(button => button.classList.toggle("active", button.dataset.coachTab === this.cambridgeTab || button.getAttribute("onclick")?.includes("'" + this.cambridgeTab + "'")));
      coach.render(this.cambridgeTab);
    }
  };

  hub.setCambridgeTab = function (tab) {
    if (["coach-progress","coach-adaptive","coach-speaking","coach-mock"].includes(tab)) {
      this.cambridgeTab = tab;
      this.renderCambridge();
      return;
    }
    originalSetTab(tab);
  };

  hub.finishQuestionRun = function () {
    const run = this.currentRun;
    const score = run ? run.score : 0;
    const total = run && run.questions ? run.questions.length : 0;
    originalFinishRun();
    if (run && run.kind === "mock-reading" && total) {
      coach.markSection("reading", { score, total, percentage: Math.round(score / total * 100) });
    }
  };
})(window);
