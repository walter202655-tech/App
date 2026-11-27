(function () {
  "use strict";

  const entries = [
    { label: "Ir al inicio", detail: "Dashboard y recomendación diaria", view: "dashboard", keys: "inicio home" },
    { label: "Abrir calendario", detail: "Plan semanal de estudio", view: "calendar", keys: "plan horario calendario" },
    { label: "Continuar cursos", detail: "Ruta de aprendizaje A1-C2", view: "lessons", keys: "lecciones cursos niveles" },
    { label: "Practicar Cambridge B2", detail: "Guías, preguntas y simulacros", view: "cambridge-b2", keys: "first examen b2 reading listening speaking writing" },
    { label: "Jugar reto diario", detail: "Wordle y conecta palabras", view: "daily-games", keys: "juego wordle vocabulario" },
    { label: "Construir vocabulario", detail: "Palabras guardadas y práctica", view: "word-bank", keys: "palabras vocabulario anki" },
    { label: "Estudiar gramática", detail: "Reglas y ejercicios", view: "modules", keys: "grammar reglas" },
    { label: "Consultar al tutor", detail: "Resolver dudas sobre inglés y Cambridge", view: "exam-chat", keys: "chat preguntas ayuda tutor" },
    { label: "Revisar mi progreso", detail: "Métricas, notas e historial", view: "progress", keys: "estadísticas avance resultados" },
    { label: "Ver novedades", detail: "Cambios y mejoras de Aura100", view: "changelog", keys: "versiones actualizaciones cambios" }
  ];

  let selected = 0;
  let filtered = entries;

  function closePalette() {
    const overlay = document.getElementById("aura-command-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("aura-command-open");
  }

  function openPalette() {
    const overlay = document.getElementById("aura-command-overlay");
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add("aura-command-open");
    const input = document.getElementById("aura-command-input");
    input.value = "";
    filterEntries("");
    requestAnimationFrame(() => input.focus());
  }

  function choose(index) {
    const item = filtered[index];
    if (!item || !window.app || typeof window.app.navigate !== "function") return;
    closePalette();
    window.app.navigate(item.view);
  }

  function filterEntries(query) {
    const q = query.trim().toLocaleLowerCase("es");
    filtered = entries.filter(item => (item.label + " " + item.detail + " " + item.keys).toLocaleLowerCase("es").includes(q));
    selected = Math.min(selected, Math.max(0, filtered.length - 1));
    const list = document.getElementById("aura-command-results");
    if (!list) return;
    list.innerHTML = filtered.length ? filtered.map((item, index) =>
      '<button type="button" class="aura-command-result' + (index === selected ? ' is-selected' : '') + '" role="option" aria-selected="' + (index === selected) + '" data-index="' + index + '">' +
      '<span class="aura-command-result-icon" aria-hidden="true">' + (item.view === "cambridge-b2" ? "B2" : item.view === "changelog" ? "↗" : "→") + '</span>' +
      '<span><strong>' + item.label + '</strong><small>' + item.detail + '</small></span><kbd>↵</kbd></button>'
    ).join("") : '<p class="aura-command-empty">No se encontraron secciones. Prueba con otra palabra.</p>';
  }

  function init() {
    if (document.getElementById("aura-command-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "aura-command-overlay";
    overlay.className = "aura-command-overlay";
    overlay.hidden = true;
    overlay.innerHTML = '<div class="aura-command-backdrop" data-close="true"></div><section class="aura-command-dialog" role="dialog" aria-modal="true" aria-labelledby="aura-command-title"><div class="aura-command-top"><span id="aura-command-title">Navegación rápida</span><kbd>ESC</kbd></div><label class="aura-command-search"><span aria-hidden="true">⌕</span><input id="aura-command-input" type="search" autocomplete="off" placeholder="¿Qué quieres abrir?" aria-label="Buscar una sección"></label><div id="aura-command-results" class="aura-command-results" role="listbox"></div><footer><span>Usa ↑ ↓ para moverte</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd> para abrir</span></footer></section>';
    document.body.appendChild(overlay);
    overlay.addEventListener("click", event => {
      if (event.target.dataset.close === "true") closePalette();
      const button = event.target.closest("[data-index]");
      if (button) choose(Number(button.dataset.index));
    });
    document.getElementById("aura-command-input").addEventListener("input", event => {
      selected = 0;
      filterEntries(event.target.value);
    });
    document.addEventListener("keydown", event => {
      const target = event.target;
      const typing = target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
        return;
      }
      if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        openPalette();
        return;
      }
      if (overlay.hidden) return;
      if (event.key === "Escape") closePalette();
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        selected = (selected + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % Math.max(1, filtered.length);
        filterEntries(document.getElementById("aura-command-input").value);
        const active = overlay.querySelector(".aura-command-result.is-selected");
        if (active) active.scrollIntoView({ block: "nearest" });
      }
      if (event.key === "Enter") {
        event.preventDefault();
        choose(selected);
      }
    });
    filterEntries("");
    const header = document.querySelector(".header-left");
    if (header && !document.getElementById("aura-command-trigger")) {
      const trigger = document.createElement("button");
      trigger.id = "aura-command-trigger";
      trigger.type = "button";
      trigger.className = "aura-command-trigger";
      trigger.innerHTML = '<span aria-hidden="true">⌕</span><span>Buscar sección...</span><kbd>Ctrl K</kbd>';
      trigger.setAttribute("aria-label", "Abrir navegación rápida");
      trigger.addEventListener("click", openPalette);
      header.appendChild(trigger);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
