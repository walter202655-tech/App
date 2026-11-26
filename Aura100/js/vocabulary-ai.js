/**
 * Aura100 v4.0 - Vocabulary Builder & AI Lexical Assistant
 * Connects with /api/ai/vocabulary via window.Aura100AI.
 * Expands Word Bank with Collocations, Register, Synonyms, Antonyms,
 * Academic / Business tagging, and one-click deduplicated sync to Anki SRS.
 */

(function (global) {
  "use strict";

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  class VocabularyAIManager {
    constructor(appInstance) {
      this.app = appInstance;
      this.currentEntry = null;
      this.isSearching = false;
    }

    async lookupWord(wordText, contextText = "") {
      const term = (wordText || "").trim();
      if (!term) return;

      const resultBox = document.getElementById("vocab-ai-result-box");
      const loader = document.getElementById("vocab-ai-loader");

      if (loader) loader.classList.remove("hidden");
      if (resultBox) resultBox.innerHTML = "";

      try {
        let entry = null;
        const targetLevel = this.app?.state?.targetCefr || "B2";

        if (global.Aura100AI && typeof global.Aura100AI.buildVocabularyEntry === "function") {
          try {
            entry = await global.Aura100AI.buildVocabularyEntry({
              word: term,
              context: contextText || "Daily English usage and study",
              level: targetLevel,
              language: "es"
            });
          } catch (e) {
            console.warn("AI vocab lookup failed, using local dictionary:", e);
            entry = this._getLocalVocabEntry(term, targetLevel);
          }
        } else {
          entry = this._getLocalVocabEntry(term, targetLevel);
        }

        this.currentEntry = entry;
        this.renderEntry(entry);

      } catch (err) {
        console.error("Vocabulary lookup error:", err);
        if (resultBox) {
          resultBox.innerHTML = `
            <div class="eval-error-box">
              <h4>⚠️ Error al consultar el vocabulario</h4>
              <p>${escapeHTML(err.message || "Comprueba la conexión con el servidor.")}</p>
            </div>
          `;
        }
      } finally {
        if (loader) loader.classList.add("hidden");
      }
    }

    _getLocalVocabEntry(word, level) {
      // Offline fallback lookup
      return {
        word: word,
        partOfSpeech: "noun / verb / adjective",
        ipa: "",
        meaning: `Significado pedagógico en español para '${word}'. Consulta un diccionario certificado para detalles dialectales.`,
        register: "Neutral / General English",
        examples: [
          `Contextual example 1 incorporating '${word}' naturally.`,
          `Secondary example showing register variations of '${word}'.`,
          `Academic or communicative application of '${word}'.`
        ],
        collocations: [`strong ${word}`, `${word} of importance`, `key ${word}`],
        synonyms: ["equivalent term", "analogous word"],
        antonyms: ["opposite concept"],
        usageNote: "Para una pronunciación fonética fiable y entonación nativa, se recomienda contrastar con Oxford Learner's Dictionary o Cambridge Dictionary."
      };
    }

    renderEntry(entry) {
      const box = document.getElementById("vocab-ai-result-box");
      if (!box || !entry) return;

      box.innerHTML = "";

      const card = document.createElement("div");
      card.className = "vocab-entry-card";

      const header = document.createElement("div");
      header.className = "vocab-entry-header";

      const titleWrap = document.createElement("div");
      const wordTitle = document.createElement("h2");
      wordTitle.className = "vocab-word-title";
      wordTitle.textContent = entry.word;

      const metaLine = document.createElement("div");
      metaLine.className = "vocab-meta-line";
      metaLine.innerHTML = `
        <span class="vocab-pos-badge">${escapeHTML(entry.partOfSpeech)}</span>
        ${entry.ipa ? `<span class="vocab-ipa-badge">${escapeHTML(entry.ipa)}</span>` : ""}
        <span class="vocab-register-badge">${escapeHTML(entry.register || "General")}</span>
        <span class="ai-generated-badge">✨ Enriquecido por IA</span>
      `;

      titleWrap.appendChild(wordTitle);
      titleWrap.appendChild(metaLine);
      header.appendChild(titleWrap);

      // Pronunciation audio button
      const audioBtn = document.createElement("button");
      audioBtn.className = "btn btn-secondary btn-sm";
      audioBtn.innerHTML = `🔊 Escuchar`;
      audioBtn.onclick = () => {
        if (this.app && typeof this.app.speakText === "function") {
          this.app.speakText(entry.word, 1.0);
        }
      };
      header.appendChild(audioBtn);
      card.appendChild(header);

      // Meaning
      const meaningP = document.createElement("p");
      meaningP.className = "vocab-meaning-text";
      meaningP.innerHTML = `<strong>Significado:</strong> ${escapeHTML(entry.meaning)}`;
      card.appendChild(meaningP);

      // Collocations & Synonyms
      const tagsGrid = document.createElement("div");
      tagsGrid.className = "vocab-chips-grid";

      if (Array.isArray(entry.collocations) && entry.collocations.length > 0) {
        const colWrap = document.createElement("div");
        colWrap.className = "vocab-chip-group";
        colWrap.innerHTML = `<strong>Collocations:</strong> ` + 
          entry.collocations.map(c => `<span class="vocab-chip">${escapeHTML(c)}</span>`).join(" ");
        tagsGrid.appendChild(colWrap);
      }

      if (Array.isArray(entry.synonyms) && entry.synonyms.length > 0) {
        const synWrap = document.createElement("div");
        synWrap.className = "vocab-chip-group";
        synWrap.innerHTML = `<strong>Sinónimos:</strong> ` + 
          entry.synonyms.map(s => `<span class="vocab-chip syn-chip">${escapeHTML(s)}</span>`).join(" ");
        tagsGrid.appendChild(synWrap);
      }

      if (Array.isArray(entry.antonyms) && entry.antonyms.length > 0) {
        const antWrap = document.createElement("div");
        antWrap.className = "vocab-chip-group";
        antWrap.innerHTML = `<strong>Antónimos:</strong> ` + 
          entry.antonyms.map(a => `<span class="vocab-chip ant-chip">${escapeHTML(a)}</span>`).join(" ");
        tagsGrid.appendChild(antWrap);
      }

      card.appendChild(tagsGrid);

      // Examples
      if (Array.isArray(entry.examples) && entry.examples.length > 0) {
        const exTitle = document.createElement("h4");
        exTitle.textContent = "📖 Ejemplos en Contexto:";
        card.appendChild(exTitle);

        const ul = document.createElement("ul");
        ul.className = "vocab-examples-list";
        entry.examples.forEach(ex => {
          const li = document.createElement("li");
          li.textContent = ex;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      // Usage note
      if (entry.usageNote) {
        const noteBox = document.createElement("div");
        noteBox.className = "vocab-usage-note";
        noteBox.innerHTML = `<strong>💡 Nota de Registro / Uso:</strong> ${escapeHTML(entry.usageNote)}`;
        card.appendChild(noteBox);
      }

      // Action buttons: Save to Word Bank & Add to Anki
      const actionsRow = document.createElement("div");
      actionsRow.className = "vocab-actions-row";

      const btnSaveWb = document.createElement("button");
      btnSaveWb.className = "btn btn-primary btn-sm";
      btnSaveWb.innerHTML = `➕ Guardar en Word Bank`;
      btnSaveWb.onclick = () => this.saveToWordBank(entry);

      const btnAddAnki = document.createElement("button");
      btnAddAnki.className = "btn btn-secondary btn-sm";
      btnAddAnki.innerHTML = `🧠 Añadir a Anki SRS`;
      btnAddAnki.onclick = () => this.addToAnkiDeck(entry);

      actionsRow.appendChild(btnSaveWb);
      actionsRow.appendChild(btnAddAnki);
      card.appendChild(actionsRow);

      box.appendChild(card);
    }

    saveToWordBank(entry) {
      if (!this.app || !this.app.state) return;

      const wordId = `wb_ai_${entry.word.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      if (!this.app.state.knownWords.includes(wordId)) {
        this.app.state.knownWords.push(wordId);
      }

      this.app.saveState();
      this.app.showToast(`📚 "${entry.word}" guardada en tu Word Bank.`, "cyan");
      if (this.app.sound) this.app.sound.playCoin();
    }

    addToAnkiDeck(entry) {
      if (!this.app || !this.app.state || !Array.isArray(this.app.state.ankiDeck)) return;

      const exists = this.app.state.ankiDeck.some(
        c => c.front.toLowerCase() === entry.word.toLowerCase()
      );

      if (exists) {
        this.app.showToast(`"${entry.word}" ya está en tu mazo Anki.`, "info");
        return;
      }

      const primaryExample = Array.isArray(entry.examples) && entry.examples.length > 0 ? entry.examples[0] : "";

      const card = {
        id: `anki_ai_${Date.now()}_${entry.word.toLowerCase()}`,
        front: entry.word,
        back: entry.meaning,
        level: this.app.state.targetCefr || "B2",
        phonetic: entry.ipa || "",
        example: primaryExample,
        exampleEs: "Ver ejemplos y collocations en tu Word Bank.",
        explanation: `${escapeHTML(entry.partOfSpeech)} • ${escapeHTML(entry.register || "General")}`,
        tag: "AI Vocab ✨",
        repetitions: 0,
        interval: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString().split("T")[0],
        state: "new"
      };

      this.app.state.ankiDeck.unshift(card);
      this.app.saveState();
      this.app.showToast(`🧠 "${entry.word}" agregada al mazo Anki con éxito.`, "purple");
      if (this.app.sound) this.app.sound.playCoin();
    }
  }

  global.VocabularyAIManager = VocabularyAIManager;
})(window);
