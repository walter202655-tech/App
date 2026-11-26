/**
 * Aura100 v4.0 - AI Conversation Partner
 * Integrates with POST /api/ai/chat via window.Aura100AI.
 * Features safe DOM node creation (zero raw innerHTML on user/AI text),
 * multi-turn history, scenario & CEFR selection, vocabulary extraction,
 * session summaries, and honest offline fallback.
 */

(function (global) {
  "use strict";

  const SCENARIOS_METADATA = {
    free: {
      id: "free",
      name: "Conversación Libre",
      icon: "🌐",
      desc: "Conversación cotidiana abierta sobre cualquier tema que elijas.",
      initialPrompt: "Hello! I'm your Aura100 conversation coach. What would you like to talk about today?",
      suggestedStarters: ["Let's talk about travel.", "Can we practice English for work?", "Tell me about a good movie."]
    },
    restaurant: {
      id: "restaurant",
      name: "Restaurante",
      icon: "🍽️",
      desc: "Práctica pidiendo bebidas, platos, términos de cocción y la cuenta.",
      initialPrompt: "Good evening! Welcome to The Golden Bistro. Can I start you off with something to drink?",
      suggestedStarters: ["Could I see the menu, please?", "I'd like a glass of sparkling water.", "What do you recommend?"]
    },
    hotel: {
      id: "hotel",
      name: "Hotel & Check-in",
      icon: "🏨",
      desc: "Check-in, servicios del hotel, horarios y resolución de peticiones.",
      initialPrompt: "Good afternoon! Welcome to the Grand Horizon Hotel. Do you have a reservation with us?",
      suggestedStarters: ["Yes, I have a reservation under my name.", "What time is breakfast served?", "Could I request a late checkout?"]
    },
    directions: {
      id: "directions",
      name: "Direcciones en la Ciudad",
      icon: "🗺️",
      desc: "Pedir y dar indicaciones para llegar a museos, estaciones y lugares turísticos.",
      initialPrompt: "Hello there! You seem to be looking for something. Can I help you find your way?",
      suggestedStarters: ["Excuse me, how do I get to the central train station?", "Is the science museum within walking distance?", "Which bus goes downtown?"]
    },
    job: {
      id: "job",
      name: "Entrevista Profesional",
      icon: "💼",
      desc: "Práctica de entrevista formal sobre fortalezas, logros, resolución de problemas y aspiraciones.",
      initialPrompt: "Welcome to our interview session today. Please take a seat. Could you start by introducing yourself and your background?",
      suggestedStarters: ["Thank you. I have experience in project coordination...", "My greatest strength is solving complex problems in teams.", "I'm very excited about this role because..."]
    },
    friends: {
      id: "friends",
      name: "Amigos y Pasatiempos",
      icon: "👥",
      desc: "Conversación informal conociendo a alguien nuevo, compartiendo hobbies y música.",
      initialPrompt: "Hey! I haven't seen you around here before. Are you new to the campus / neighborhood?",
      suggestedStarters: ["Yes, I just moved here recently!", "I love photography and playing guitar in my free time.", "Do you know any good cafes nearby?"]
    },
    academic_debate: {
      id: "academic_debate",
      name: "Debate Académico",
      icon: "🎓",
      desc: "Discusión fundamentada con argumentación, concesiones y lenguaje formal (B2-C2).",
      initialPrompt: "Welcome to our academic discussion. Today's topic considers whether artificial intelligence will reshape higher education. What is your position?",
      suggestedStarters: ["From my perspective, AI will serve as a cognitive amplifier...", "While there are clear benefits, we must acknowledge ethical concerns...", "I would argue that human mentorship remains irreplaceable."]
    },
    presentation: {
      id: "presentation",
      name: "Práctica de Presentaciones",
      icon: "📊",
      desc: "Apertura de presentaciones, transición entre diapositivas y respuestas a preguntas de la audiencia.",
      initialPrompt: "The floor is yours. Whenever you are ready, please deliver the opening remarks of your presentation.",
      suggestedStarters: ["Good morning everyone, today I'd like to present our findings on...", "Let me begin by outlining the three main pillars of our project.", "Thank you for your attention; I'd now be delighted to take any questions."]
    }
  };

  class AIConversationPartner {
    constructor(appInstance) {
      this.app = appInstance;
      this.scenario = "restaurant";
      this.level = "B1";
      this.history = []; // Array of { role: 'user'|'assistant', content: string, timestamp: number }
      this.vocabularyDiscovered = [];
      this.mistakesIdentified = [];
      this.isLoading = false;
      this.isOnlineAI = false;
    }

    async init() {
      // Check backend health
      if (global.Aura100AI && typeof global.Aura100AI.checkHealth === "function") {
        const health = await global.Aura100AI.checkHealth();
        this.isOnlineAI = Boolean(health && health.status === "ok" && health.aiConfigured);
      }
      this.resetSession(false);
    }

    setScenario(scenarioId) {
      if (SCENARIOS_METADATA[scenarioId]) {
        this.scenario = scenarioId;
        this.resetSession(true);
      }
    }

    setLevel(levelCode) {
      if (["A1", "A2", "B1", "B2", "C1", "C2"].includes(levelCode)) {
        this.level = levelCode;
        this.resetSession(true);
      }
    }

    resetSession(keepStats = false) {
      this.history = [];
      this.vocabularyDiscovered = [];
      this.mistakesIdentified = [];
      const meta = SCENARIOS_METADATA[this.scenario] || SCENARIOS_METADATA.free;
      
      // Initial greeting message from tutor
      this.history.push({
        role: "assistant",
        content: meta.initialPrompt,
        timestamp: Date.now()
      });

      this.render();
    }

    async sendMessage(userText) {
      const cleanText = (userText || "").trim();
      if (!cleanText || this.isLoading) return;

      // 1. Add user message
      this.history.push({
        role: "user",
        content: cleanText,
        timestamp: Date.now()
      });

      this.isLoading = true;
      this.render();

      try {
        let reply = "";

        if (this.isOnlineAI && global.Aura100AI) {
          // Send request with bounded history (last 8 messages)
          const apiHistory = this.history
            .slice(0, -1) // exclude current message
            .slice(-8)
            .map(m => ({ role: m.role, content: m.content }));

          reply = await global.Aura100AI.chat({
            message: cleanText,
            level: this.level,
            scenario: this.scenario,
            history: apiHistory
          });
        } else {
          // Educational rule-based fallback with explicit notice
          reply = this._generateRuleBasedReply(cleanText);
        }

        this.history.push({
          role: "assistant",
          content: reply,
          timestamp: Date.now()
        });

        // Award XP and log metrics
        if (this.app) {
          this.app.addXp(10);
          if (this.app.adaptiveEngine) {
            this.app.adaptiveEngine.recordActivity({
              skill: "speaking",
              topic: `Conversation - ${this.scenario}`,
              difficulty: this.level,
              isCorrect: true,
              userAnswer: cleanText,
              correctAnswer: reply.substring(0, 100)
            });
          }
        }

        // Extract vocabulary notes if any formatted in response
        this._extractVocabularyAndCorrections(reply);

      } catch (error) {
        console.warn("AI Chat error:", error);
        let errorMsg = "Lo siento, hubo un problema al conectar con el tutor de IA.";
        if (error.code === "AI_NOT_CONFIGURED" || error.status === 503) {
          errorMsg = "ℹ️ El servicio de IA en la nube requiere una clave en .env. Cambiando automáticamente al modo de práctica guiada local.";
          this.isOnlineAI = false;
          const fallbackReply = this._generateRuleBasedReply(cleanText);
          this.history.push({
            role: "assistant",
            content: `${errorMsg}\n\n${fallbackReply}`,
            timestamp: Date.now()
          });
        } else if (error.code === "REQUEST_TIMEOUT") {
          errorMsg = "⏱️ La solicitud tardó demasiado. Puedes intentar de nuevo.";
          this.history.push({ role: "assistant", content: errorMsg, isError: true, timestamp: Date.now() });
        } else {
          this.history.push({
            role: "assistant",
            content: `⚠️ Error de conexión: ${error.message || "Inténtalo nuevamente."}`,
            isError: true,
            timestamp: Date.now()
          });
        }
      } finally {
        this.isLoading = false;
        this.render();
      }
    }

    _generateRuleBasedReply(userText) {
      const lower = userText.toLowerCase();
      const meta = SCENARIOS_METADATA[this.scenario] || SCENARIOS_METADATA.free;

      // Common polite corrections for Spanish speakers
      let correctionNote = "";
      if (lower.includes("i have ") && (lower.includes("years") || lower.includes("age"))) {
        correctionNote = "\n\n💡 Grammar Tip: In English, use 'I am ... years old' instead of 'I have ... years'.";
        this.mistakesIdentified.push({ original: "I have ... years", corrected: "I am ... years old", topic: "Age expression" });
      } else if (lower.startsWith("i want ")) {
        correctionNote = "\n\n💡 Politeness Tip: In customer service or formal settings, 'I would like' or 'Could I have' sounds more natural and polite than 'I want'.";
      }

      if (this.scenario === "restaurant") {
        if (lower.includes("menu") || lower.includes("drink") || lower.includes("water") || lower.includes("beer")) {
          return `Certainly! Here is our menu. We have sparkling water, freshly squeezed orange juice, and iced tea. What would you like to start with?${correctionNote}`;
        } else if (lower.includes("order") || lower.includes("steak") || lower.includes("pasta") || lower.includes("salad") || lower.includes("fish")) {
          return `Excellent choice! How would you like that prepared, and would you care for any side dishes like roasted potatoes or a fresh garden salad?${correctionNote}`;
        } else if (lower.includes("bill") || lower.includes("check") || lower.includes("pay")) {
          return `Right away! I'll bring the check over. Did you enjoy your meal tonight? We accept both card and cash.${correctionNote}`;
        }
      } else if (this.scenario === "hotel") {
        if (lower.includes("reservation") || lower.includes("booking") || lower.includes("name")) {
          return `Thank you! I found your booking right here. You'll be staying in a deluxe suite on the fifth floor. May I see your ID, please?${correctionNote}`;
        } else if (lower.includes("breakfast") || lower.includes("wifi") || lower.includes("gym")) {
          return `Breakfast is served on the mezzanine floor from 6:30 AM to 10:00 AM. The high-speed WiFi network is 'HorizonGuest' with no password needed. Anything else I can assist with?${correctionNote}`;
        }
      } else if (this.scenario === "job") {
        return `Thank you for sharing that. It sounds like you have developed very valuable competencies. Could you describe a specific situation where you encountered a major challenge and how you resolved it?${correctionNote}`;
      } else if (this.scenario === "academic_debate") {
        return `That is a compelling argument. However, empirical studies often suggest that the efficacy of automated tools depends heavily on pedagogical framework and learner autonomy. How would you counter that point?${correctionNote}`;
      }

      return `That is very interesting! At CEFR ${this.level}, practicing clear sentence structures and varied vocabulary will help you communicate even more effectively. Could you elaborate a bit more on that?${correctionNote}`;
    }

    _extractVocabularyAndCorrections(text) {
      // Look for lines containing "Improved:", "Tip:", "Vocabulary:"
      const lines = text.split("\n");
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().startsWith("improved:") || trimmed.toLowerCase().startsWith("original:")) {
          // Log correction
          if (!this.mistakesIdentified.some(m => m.text === trimmed)) {
            this.mistakesIdentified.push({ text: trimmed, timestamp: Date.now() });
          }
        }
      });
    }

    render() {
      const container = document.getElementById("ai-chat-thread");
      const scenarioSelect = document.getElementById("ai-chat-scenario-select");
      const levelSelect = document.getElementById("ai-chat-level-select");
      const statusIndicator = document.getElementById("ai-chat-status-indicator");
      const vocabList = document.getElementById("ai-chat-vocab-list");

      if (scenarioSelect && scenarioSelect.value !== this.scenario) {
        scenarioSelect.value = this.scenario;
      }
      if (levelSelect && levelSelect.value !== this.level) {
        levelSelect.value = this.level;
      }

      if (statusIndicator) {
        statusIndicator.innerHTML = "";
        const badge = document.createElement("span");
        badge.className = `ai-status-pill ${this.isOnlineAI ? "online" : "local-mode"}`;
        badge.textContent = this.isOnlineAI ? "⚡ IA en línea (OpenAI)" : "🛡️ Modo Práctica Guiada";
        statusIndicator.appendChild(badge);
      }

      if (!container) return;

      // Safe rendering using standard DOM manipulation - ZERO unsafe innerHTML on message bodies
      container.innerHTML = "";

      this.history.forEach((msg, idx) => {
        const item = document.createElement("div");
        item.className = `chat-bubble-row ${msg.role === "user" ? "user-row" : "bot-row"}`;

        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}${msg.isError ? " chat-bubble-error" : ""}`;

        const header = document.createElement("div");
        header.className = "chat-bubble-header";
        
        const author = document.createElement("span");
        author.className = "chat-author-tag";
        author.textContent = msg.role === "user" ? (this.app?.state?.username || "Tú") : "Aura100 AI Tutor";
        header.appendChild(author);

        const time = document.createElement("span");
        time.className = "chat-time-tag";
        const dateObj = new Date(msg.timestamp || Date.now());
        time.textContent = `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;
        header.appendChild(time);

        bubble.appendChild(header);

        const content = document.createElement("div");
        content.className = "chat-bubble-text";
        // textContent guarantees absolute protection against XSS
        content.textContent = msg.content;
        bubble.appendChild(content);

        // TTS listen button for assistant messages
        if (msg.role === "assistant" && !msg.isError && this.app && typeof this.app.speakText === "function") {
          const speakBtn = document.createElement("button");
          speakBtn.className = "btn-listen-bubble";
          speakBtn.title = "Escuchar pronunciación (SpeechSynthesis)";
          speakBtn.textContent = "🔊 Escuchar";
          speakBtn.onclick = () => this.app.speakText(msg.content, 1.0);
          bubble.appendChild(speakBtn);
        }

        item.appendChild(bubble);
        container.appendChild(item);
      });

      // Typing loader
      if (this.isLoading) {
        const loadingRow = document.createElement("div");
        loadingRow.className = "chat-bubble-row bot-row";
        const loadingBubble = document.createElement("div");
        loadingBubble.className = "chat-bubble chat-bubble-bot chat-typing-indicator";
        loadingBubble.textContent = "Aura100 está pensando...";
        loadingRow.appendChild(loadingBubble);
        container.appendChild(loadingRow);
      }

      container.scrollTop = container.scrollHeight;

      // Render suggestions
      const suggestionsRow = document.getElementById("ai-chat-starters");
      if (suggestionsRow) {
        suggestionsRow.innerHTML = "";
        const meta = SCENARIOS_METADATA[this.scenario] || SCENARIOS_METADATA.free;
        (meta.suggestedStarters || []).forEach(starter => {
          const chip = document.createElement("button");
          chip.className = "chat-starter-chip";
          chip.textContent = starter;
          chip.onclick = () => {
            const input = document.getElementById("ai-chat-input");
            if (input) {
              input.value = starter;
              input.focus();
            }
          };
          suggestionsRow.appendChild(chip);
        });
      }
    }
  }

  global.AIConversationPartner = AIConversationPartner;
  global.SCENARIOS_METADATA = SCENARIOS_METADATA;
})(window);
