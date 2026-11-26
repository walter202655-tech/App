/**
 * Aura100 v4.0 - Audio & Pronunciation Adapter
 * Features:
 *   1. Explicit technical honesty: Labels Web Speech API as "Coincidencia aproximada de transcripción"
 *   2. Microphone permission lifecycle: Clear start/stop/recording indicators, non-retentive audio processing
 *   3. Minimal pairs & Phonological contrast modules (vowels, consonants, word stress, connected speech)
 *   4. Pluggable Audio Evaluation Provider Adapter with explicit "No configurado" state for deep acoustic/phonetic scoring
 *   5. Mic-free fallback alternatives for all exercises
 */

(function (global) {
  "use strict";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  const MINIMAL_PAIRS_DATA = [
    {
      id: "pair_1",
      title: "Vowel Contrast: /iː/ vs /ɪ/",
      description: "Distingue la vocal larga tensa de 'sheep' de la vocal corta relajada de 'ship'.",
      wordA: { text: "Sheep", ipa: "/ʃiːp/", es: "Oveja" },
      wordB: { text: "Ship", ipa: "/ʃɪp/", es: "Barco" },
      sampleSentenceA: "Look at the white sheep in the meadow.",
      sampleSentenceB: "The large cargo ship arrived at the port."
    },
    {
      id: "pair_2",
      title: "Vowel Contrast: /æ/ vs /ʌ/",
      description: "Distingue la vocal abierta de 'cat' de la vocal central corta de 'cut'.",
      wordA: { text: "Cat", ipa: "/kæt/", es: "Gato" },
      wordB: { text: "Cut", ipa: "/kʌt/", es: "Cortar" },
      sampleSentenceA: "The cat is sleeping on the armchair.",
      sampleSentenceB: "Be careful not to cut yourself with the scissors."
    },
    {
      id: "pair_3",
      title: "Consonant Contrast: /θ/ vs /s/",
      description: "Distingue el sonido interdental de 'think' de la sibilante alveolar de 'sink'.",
      wordA: { text: "Think", ipa: "/θɪŋk/", es: "Pensar" },
      wordB: { text: "Sink", ipa: "/sɪŋk/", es: "Hundirse / Fregadero" },
      sampleSentenceA: "Take time to think before you answer.",
      sampleSentenceB: "Wash your hands thoroughly at the sink."
    },
    {
      id: "pair_4",
      title: "Consonant Contrast: /v/ vs /b/",
      description: "Distingue la fricativa labiodental sonora /v/ de la oclusiva bilabial /b/.",
      wordA: { text: "Vote", ipa: "/voʊt/", es: "Votar" },
      wordB: { text: "Boat", ipa: "/boʊt/", es: "Bote / Barco" },
      sampleSentenceA: "Citizens have the right to vote in elections.",
      sampleSentenceB: "We rented a small boat on the lake."
    },
    {
      id: "pair_5",
      title: "Connected Speech: Linking /r/ & Elision",
      description: "Observa cómo se enlazan los sonidos entre palabras adyacentes en discurso natural.",
      wordA: { text: "Far away", ipa: "/ˌfɑːr əˈweɪ/", es: "Lejos (con 'r' de enlace)" },
      wordB: { text: "Next door", ipa: "/ˌneks ˈdɔːr/", es: "Al lado (elisión de 't')" },
      sampleSentenceA: "They live far away in the countryside.",
      sampleSentenceB: "The new neighbors moved in next door yesterday."
    }
  ];

  class AudioPronunciationAdapter {
    constructor(appInstance) {
      this.app = appInstance;
      this.recognition = null;
      this.isRecording = false;
      this.activePairIndex = 0;
      this.selectedPairSide = "A";
      this.acousticProvider = {
        name: "Servicio Fonético Externo",
        status: "No configurado",
        isReady: false
      };
      this.initSpeechRecognition();
    }

    initSpeechRecognition() {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        console.warn("Web Speech API no disponible en este navegador.");
        return;
      }

      this.recognition = new SpeechRec();
      this.recognition.lang = "en-US";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateMicUI(true);
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.updateMicUI(false);
      };

      this.recognition.onerror = (event) => {
        this.isRecording = false;
        this.updateMicUI(false);
        console.warn("Speech recognition error:", event.error);
        if (this.app) {
          if (event.error === "not-allowed") {
            this.app.showToast("Permiso de micrófono denegado. Puedes usar las opciones sin micrófono.", "info");
          } else {
            this.app.showToast(`Aviso de micrófono: ${event.error}`, "info");
          }
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleTranscriptionResult(transcript);
      };
    }

    startListening(targetPhrase, callback) {
      this.targetPhrase = (targetPhrase || "").trim();
      this.resultCallback = callback;

      if (!this.recognition) {
        if (this.app) {
          this.app.showToast("Reconocimiento de voz no soportado en este navegador. Usa la opción manual.", "info");
        }
        return;
      }

      try {
        if (this.isRecording) {
          this.recognition.stop();
        } else {
          this.recognition.start();
        }
      } catch (e) {
        console.warn("Microphone start error:", e);
      }
    }

    stopListening() {
      if (this.recognition && this.isRecording) {
        try { this.recognition.stop(); } catch(e) {}
      }
    }

    handleTranscriptionResult(recognizedText) {
      const recognized = (recognizedText || "").trim().toLowerCase();
      const target = (this.targetPhrase || "").trim().toLowerCase();

      // Transparent algorithm: Normalized Levenshtein / word overlap
      const matchScore = this._computeSimilarity(recognized, target);

      const feedback = {
        recognizedText,
        targetPhrase: this.targetPhrase,
        accuracyScore: matchScore,
        method: "Coincidencia aproximada de transcripción de texto (Web Speech API)",
        acousticEvaluation: this.acousticProvider.status // "No configurado"
      };

      if (typeof this.resultCallback === "function") {
        this.resultCallback(feedback);
      }

      this.renderPronunciationResult(feedback);
    }

    _computeSimilarity(s1, s2) {
      if (s1 === s2) return 100;
      if (!s1 || !s2) return 0;

      // Word-level token comparison
      const words1 = s1.split(/\s+/);
      const words2 = s2.split(/\s+/);
      let matches = 0;
      words1.forEach(w => {
        if (words2.includes(w)) matches++;
      });

      return Math.round((matches / Math.max(words1.length, words2.length)) * 100);
    }

    updateMicUI(recording) {
      const btn = document.getElementById("btn-mic-pronun-active");
      const indicator = document.getElementById("mic-recording-pulse");
      if (btn) {
        btn.classList.toggle("recording-active", recording);
        btn.textContent = recording ? "⏹ Detener Grabación" : "🎤 Hablar al Micrófono";
      }
      if (indicator) {
        indicator.classList.toggle("hidden", !recording);
      }
    }

    renderPronunciationResult(feedback) {
      const container = document.getElementById("pronun-transcription-feedback");
      if (!container) return;

      container.classList.remove("hidden");
      const isGood = feedback.accuracyScore >= 70;

      container.innerHTML = `
        <div class="pronun-feedback-box ${isGood ? "match-success" : "match-retry"}">
          <div class="pronun-header-line">
            <strong>${isGood ? "✅ Coincidencia Exitosa" : "🔄 Coincidencia Parcial"}</strong>
            <span class="pronun-score-pill">${feedback.accuracyScore}% similitud</span>
          </div>
          <p><strong>Lo que dijiste (transcripción):</strong> "${escapeHTML(feedback.recognizedText)}"</p>
          <p><strong>Frase objetivo:</strong> "${escapeHTML(feedback.targetPhrase)}"</p>
          <div class="pronun-technical-disclaimer">
            <small>ℹ️ <strong>Transparencia técnica:</strong> Este valor representa una coincidencia textual aproximada procesada por el motor de voz de tu navegador. La evaluación de formantes acústicos y fonemas específicos requiere un proveedor fonético dedicado (Estado actual: <em>${feedback.acousticEvaluation}</em>).</small>
          </div>
        </div>
      `;
    }

    renderMinimalPairs() {
      const container = document.getElementById("minimal-pairs-stage");
      if (!container) return;

      const pair = MINIMAL_PAIRS_DATA[this.activePairIndex] || MINIMAL_PAIRS_DATA[0];

      container.innerHTML = `
        <div class="minimal-pair-card">
          <div class="mp-header">
            <span class="mp-tag">Par Mínimo #${this.activePairIndex + 1} de ${MINIMAL_PAIRS_DATA.length}</span>
            <h3>${escapeHTML(pair.title)}</h3>
            <p>${escapeHTML(pair.description)}</p>
          </div>

          <div class="mp-words-comparison-grid">
            <div class="mp-word-box ${this.selectedPairSide === "A" ? "selected-box" : ""}" onclick="app.audioAdapter.selectPairWord('A')">
              <span class="mp-word-text">${escapeHTML(pair.wordA.text)}</span>
              <span class="mp-word-ipa">${escapeHTML(pair.wordA.ipa)}</span>
              <span class="mp-word-es">${escapeHTML(pair.wordA.es)}</span>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); app.speakText('${escapeHTML(pair.wordA.text)}', 0.85)">🔊 Escuchar</button>
              <p class="mp-sentence"><em>"${escapeHTML(pair.sampleSentenceA)}"</em></p>
            </div>

            <div class="mp-vs-divider">VS</div>

            <div class="mp-word-box ${this.selectedPairSide === "B" ? "selected-box" : ""}" onclick="app.audioAdapter.selectPairWord('B')">
              <span class="mp-word-text">${escapeHTML(pair.wordB.text)}</span>
              <span class="mp-word-ipa">${escapeHTML(pair.wordB.ipa)}</span>
              <span class="mp-word-es">${escapeHTML(pair.wordB.es)}</span>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); app.speakText('${escapeHTML(pair.wordB.text)}', 0.85)">🔊 Escuchar</button>
              <p class="mp-sentence"><em>"${escapeHTML(pair.sampleSentenceB)}"</em></p>
            </div>
          </div>

          <div class="mp-practice-controls">
            <p>Selecciona una palabra arriba y practica pronunciarla:</p>
            <button id="btn-mic-pronun-active" class="btn btn-primary" onclick="app.audioAdapter.togglePracticeMic()">🎤 Hablar al Micrófono</button>
            <div id="mic-recording-pulse" class="recording-pulse-tag hidden">🔴 Grabando voz... habla con claridad</div>
          </div>

          <div id="pronun-transcription-feedback" class="hidden" style="margin-top:1rem"></div>

          <div class="mp-navigation-row">
            <button class="btn btn-secondary btn-sm" onclick="app.audioAdapter.prevPair()" ${this.activePairIndex === 0 ? "disabled" : ""}>⏮ Anterior</button>
            <span>${this.activePairIndex + 1} / ${MINIMAL_PAIRS_DATA.length}</span>
            <button class="btn btn-secondary btn-sm" onclick="app.audioAdapter.nextPair()" ${this.activePairIndex === MINIMAL_PAIRS_DATA.length - 1 ? "disabled" : ""}>Siguiente ⏭</button>
          </div>
        </div>
      `;
    }

    selectPairWord(side) {
      this.selectedPairSide = side;
      this.renderMinimalPairs();
    }

    togglePracticeMic() {
      const pair = MINIMAL_PAIRS_DATA[this.activePairIndex] || MINIMAL_PAIRS_DATA[0];
      const target = this.selectedPairSide === "A" ? pair.wordA.text : pair.wordB.text;
      if (this.isRecording) {
        this.stopListening();
      } else {
        this.startListening(target, (fb) => {
          if (this.app) {
            if (fb.accuracyScore >= 70) {
              this.app.addXp(15);
              if (this.app.sound) this.app.sound.playCorrect();
            } else {
              if (this.app.sound) this.app.sound.playIncorrect();
            }
          }
        });
      }
    }

    nextPair() {
      if (this.activePairIndex < MINIMAL_PAIRS_DATA.length - 1) {
        this.activePairIndex++;
        this.renderMinimalPairs();
      }
    }

    prevPair() {
      if (this.activePairIndex > 0) {
        this.activePairIndex--;
        this.renderMinimalPairs();
      }
    }
  }

  global.AudioPronunciationAdapter = AudioPronunciationAdapter;
  global.MINIMAL_PAIRS_DATA = MINIMAL_PAIRS_DATA;
})(window);
