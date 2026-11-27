(function (global) {
  "use strict";
  const doc = global.document;
  const root = doc && doc.getElementById("main-content");
  const preference = global.matchMedia ? global.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const reducedMotion = Boolean(preference && preference.matches);
  const api = global.anime;
  const animate = api && api.animate;
  const stagger = api && api.stagger;
  if (!doc || !root || reducedMotion || typeof animate !== "function") return;

  const CARD_SELECTOR = [
    ".card", ".stat-card", ".academy-empty", ".academy-generator-card",
    ".academy-plan-form", ".academy-progress-card", ".academy-game-card",
    ".academy-guide-card", ".academy-question-card", ".academy-result",
    ".academy-day-card", ".academy-exam-overview article", ".academy-saved-card",
    ".cc-panel", ".cc-skill-card", ".cc-mock-card", ".cc-recommendation"
  ].join(",");
  const INTERACTIVE_SELECTOR = ".btn, .btn-icon, .academy-option, .academy-tab, .mission-action-btn";
  const seen = new WeakSet();

  function animateCards(scope) {
    if (!scope || !scope.querySelectorAll) return;
    const candidates = [];
    if (scope.matches && scope.matches(CARD_SELECTOR) && !seen.has(scope)) candidates.push(scope);
    scope.querySelectorAll(CARD_SELECTOR).forEach(function (element) {
      if (!seen.has(element)) candidates.push(element);
    });
    const batch = candidates.slice(0, 16);
    if (!batch.length) return;
    batch.forEach(function (element) {
      seen.add(element);
      element.classList.add("motion-enter");
    });
    animate(batch, {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 520,
      delay: stagger ? stagger(48, { from: "first" }) : 0,
      ease: "outCubic",
      onComplete: function () {
        batch.forEach(function (element) {
          element.classList.add("motion-entered");
          element.classList.remove("motion-enter");
        });
      }
    });
  }

  function animateProgress(scope) {
    if (!scope || !scope.querySelectorAll) return;
    scope.querySelectorAll(".progress-bar-fill, .academy-progress-track > span, .cc-meter > span").forEach(function (bar) {
      if (seen.has(bar)) return;
      seen.add(bar);
      animate(bar, {
        scaleX: [0, 1],
        transformOrigin: "left center",
        duration: 760,
        ease: "outExpo"
      });
    });
  }

  function animateActiveView() {
    const active = root.querySelector(".content-view.active");
    if (!active) return;
    animateCards(active);
    animateProgress(active);
  }

  doc.addEventListener("pointerdown", function (event) {
    const target = event.target.closest && event.target.closest(INTERACTIVE_SELECTOR);
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
    animate(target, { scale: 0.975, duration: 100, ease: "outQuad" });
  }, { passive: true });

  ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
    doc.addEventListener(eventName, function (event) {
      const target = event.target.closest && event.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;
      animate(target, { scale: 1, duration: 220, ease: "outBack" });
    }, { passive: true });
  });

  if (global.MutationObserver) {
    const observer = new MutationObserver(function (records) {
      let shouldRefreshView = false;
      records.forEach(function (record) {
        if (record.type === "attributes" && record.target.classList &&
            record.target.classList.contains("content-view") &&
            record.target.classList.contains("active")) shouldRefreshView = true;
        record.addedNodes && record.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            animateCards(node);
            animateProgress(node);
          }
        });
      });
      if (shouldRefreshView) animateActiveView();
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  animateActiveView();
  global.addEventListener("pageshow", animateActiveView, { once: true });
})(window);
