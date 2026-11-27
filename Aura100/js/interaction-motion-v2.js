(function (global) {
  "use strict";
  const doc = global.document;
  if (!doc || doc.documentElement.dataset.auraInteractionV2) return;
  doc.documentElement.dataset.auraInteractionV2 = "true";
  const reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anime = global.anime;
  const animate = anime && anime.animate;
  const ease = "outExpo";
  const $ = (selector, scope) => (scope || doc).querySelector(selector);

  function pulse(el) {
    if (!el || reduced || typeof animate !== "function") return;
    animate(el, { scale: [0.975, 1], duration: 420, ease: "outBack" });
  }

  function ripple(el, event) {
    if (reduced || !el || !el.getBoundingClientRect) return;
    const rect = el.getBoundingClientRect();
    const dot = doc.createElement("span");
    dot.className = "aura-ripple";
    const size = Math.max(rect.width, rect.height) * 1.4;
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    dot.style.left = ((event && event.clientX || rect.left + rect.width / 2) - rect.left - size / 2) + "px";
    dot.style.top = ((event && event.clientY || rect.top + rect.height / 2) - rect.top - size / 2) + "px";
    el.appendChild(dot);
    global.setTimeout(() => dot.remove(), 720);
  }

  function animateProgress(scope) {
    if (!scope || reduced || typeof animate !== "function") return;
    scope.querySelectorAll(".progress-bar-fill,.academy-progress-track > span,.cc-meter > span,[role=progressbar] > span").forEach(bar => {
      if (bar.dataset.auraProgressAnimated) return;
      bar.dataset.auraProgressAnimated = "true";
      const target = bar.style.width || "0%";
      bar.style.width = "0%";
      requestAnimationFrame(() => animate(bar, { width: target, duration: 1150, ease }));
    });
  }

  function countUp(el) {
    if (reduced || !el || el.dataset.auraCounted || !/^\d[\d,.\s]*$/.test(el.textContent.trim())) return;
    const raw = el.textContent.trim();
    const end = Number(raw.replace(/[^\d]/g, ""));
    if (!Number.isFinite(end) || end < 1 || end > 1000000) return;
    el.dataset.auraCounted = "true";
    const suffix = raw.replace(/[\d,.\s]/g, "");
    const state = { value: 0 };
    if (typeof animate === "function") {
      animate(state, { value: end, duration: 900, ease, onUpdate: () => { el.textContent = Math.round(state.value).toLocaleString("es-ES") + suffix; } });
    }
  }

  function reveal(scope) {
    if (!scope || !scope.querySelectorAll) return;
    const candidates = [];
    if (scope.matches && scope.matches(".card,.stat-card,.academy-game-card,.cc-panel,.cc-skill-card,.academy-result")) candidates.push(scope);
    scope.querySelectorAll(".card,.stat-card,.academy-game-card,.cc-panel,.cc-skill-card,.academy-result").forEach(el => candidates.push(el));
    candidates.slice(0, 24).forEach(el => {
      if (el.dataset.auraReveal) return;
      el.dataset.auraReveal = "true";
      if (!reduced && typeof animate === "function") {
        el.classList.add("aura-reveal-pending");
        animate(el, { opacity: [0, 1], y: [18, 0], duration: 620, delay: 35, ease, onComplete: () => el.classList.remove("aura-reveal-pending") });
      }
    });
    animateProgress(scope);
    scope.querySelectorAll(".stat-card-val,.stat-val,.cc-total strong").forEach(countUp);
  }

  function confetti() {
    if (reduced) return;
    const canvas = doc.createElement("canvas");
    canvas.className = "aura-celebration-canvas";
    canvas.setAttribute("aria-hidden", "true");
    doc.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    const ratio = Math.min(global.devicePixelRatio || 1, 2);
    canvas.width = global.innerWidth * ratio;
    canvas.height = global.innerHeight * ratio;
    ctx.scale(ratio, ratio);
    const pieces = Array.from({ length: 100 }, () => ({
      x: global.innerWidth * (0.25 + Math.random() * 0.5), y: -20 - Math.random() * 180,
      vx: (Math.random() - 0.5) * 7, vy: 2 + Math.random() * 5,
      size: 3 + Math.random() * 5, angle: Math.random() * 6, spin: (Math.random() - 0.5) * 0.2,
      hue: Math.floor(Math.random() * 360), life: 100 + Math.random() * 70
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, global.innerWidth, global.innerHeight);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.angle += p.spin; p.life--;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = "hsl(" + p.hue + " 85% 65%)";
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.7);
        ctx.restore();
      });
      if (++frame < 105 && pieces.some(p => p.life > 0 && p.y < global.innerHeight + 30)) global.requestAnimationFrame(draw);
      else canvas.remove();
    }
    global.requestAnimationFrame(draw);
  }

  let celebrationLock = false;
  function watchCompletion() {
    const modal = $("#modal-lesson-complete");
    if (!modal || !global.MutationObserver) return;
    new MutationObserver(() => {
      const visible = !modal.classList.contains("hidden") && getComputedStyle(modal).display !== "none";
      if (visible && !celebrationLock) { celebrationLock = true; confetti(); }
      if (!visible) celebrationLock = false;
    }).observe(modal, { attributes: true, attributeFilter: ["class", "style"] });
  }

  doc.addEventListener("pointerdown", event => {
    const target = event.target.closest("button,.btn,.nav-item,.academy-option,.academy-tab,[role=button]");
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
    ripple(target, event);
  }, { passive: true });

  doc.addEventListener("click", event => {
    const target = event.target.closest("button,.btn,.nav-item,.academy-option,.academy-tab,[role=button]");
    if (!target || target.disabled) return;
    pulse(target);
    if (target.matches(".academy-option,[data-answer],.cc-answer-option")) {
      target.classList.add("aura-answer-touched");
      const group = target.closest(".academy-question-card,.academy-game-card,.cc-panel,[role=group]");
      if (group) group.querySelectorAll(".aura-answer-touched").forEach(item => { if (item !== target) item.classList.remove("aura-answer-touched"); });
    }
  });

  doc.addEventListener("input", event => {
    const field = event.target;
    if (!field.matches("input,textarea")) return;
    const wrap = field.closest(".form-group,.academy-form-field,.anki-form-group,.cc-form-grid label") || field.parentElement;
    if (wrap) wrap.classList.toggle("aura-field-filled", Boolean(field.value.trim()));
  });

  doc.addEventListener("focusin", event => {
    const field = event.target;
    if (field.matches("input,textarea,select")) field.closest(".form-group,.academy-form-field,.anki-form-group,.cc-form-grid label")?.classList.add("aura-field-focus");
  });
  doc.addEventListener("focusout", event => {
    const field = event.target;
    if (field.matches("input,textarea,select")) field.closest(".form-group,.academy-form-field,.anki-form-group,.cc-form-grid label")?.classList.remove("aura-field-focus");
  });

  if (global.MutationObserver) {
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => { if (node.nodeType === 1) reveal(node); });
        if (record.type === "attributes" && record.target.matches && record.target.matches(".content-view")) {
          if (record.target.classList.contains("active")) {
            if (!reduced && typeof animate === "function") animate(record.target, { opacity: [0, 1], y: [14, 0], duration: 460, ease: "outCubic" });
            reveal(record.target);
          }
        }
      });
    });
    const main = $("#main-content") || $("#app");
    if (main) observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  doc.addEventListener("DOMContentLoaded", () => { reveal($("#main-content") || $("#app")); watchCompletion(); });
  if (doc.readyState !== "loading") { reveal($("#main-content") || $("#app")); watchCompletion(); }
})(window);
