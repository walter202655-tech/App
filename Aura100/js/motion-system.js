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
    ".hero-welcome-card", ".view-header", ".section-title", ".card", ".stat-card",
    ".adaptive-rec-card", ".academy-empty", ".academy-generator-card",
    ".academy-plan-form", ".academy-progress-card", ".academy-game-card",
    ".academy-guide-card", ".academy-question-card", ".academy-result",
    ".academy-day-card", ".academy-exam-overview article", ".academy-saved-card",
    ".cc-panel", ".cc-skill-card", ".cc-mock-card", ".cc-recommendation"
  ].join(",");
  const INTERACTIVE_SELECTOR = ".btn, .btn-icon, .nav-item, .academy-option, .academy-tab, .mission-action-btn";
  const seen = new WeakSet();
  let lastActiveView = null;

  function animateCards(scope) {
    if (!scope || !scope.querySelectorAll) return;
    const candidates = [];
    if (scope.matches && scope.matches(CARD_SELECTOR) && !seen.has(scope)) candidates.push(scope);
    scope.querySelectorAll(CARD_SELECTOR).forEach(function (element) {
      if (!seen.has(element)) candidates.push(element);
    });
    const batch = candidates.slice(0, 18);
    if (!batch.length) return;
    batch.forEach(function (element) {
      seen.add(element);
      element.classList.add("motion-enter");
    });
    animate(batch, {
      opacity: [0, 1],
      y: [26, 0],
      scale: [.975, 1],
      duration: 680,
      delay: stagger ? stagger(68, { from: "first" }) : 0,
      ease: "outExpo",
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
      animate(bar, { scaleX: [0, 1], transformOrigin: "left center", duration: 1050, ease: "outExpo" });
    });
  }

  function animateActiveView(force) {
    const active = root.querySelector(".content-view.active");
    if (!active || (!force && active === lastActiveView)) return;
    lastActiveView = active;
    animate(active, { opacity: [0, 1], y: [18, 0], duration: 560, ease: "outCubic" });
    const orb = active.querySelector(".hero-welcome-card .hero-orb");
    if (orb) animate(orb, { scale: [.72, 1], rotate: [-12, 0], duration: 950, ease: "outElastic(1, .72)" });
    animateCards(active);
    animateProgress(active);
  }

  doc.addEventListener("pointerdown", function (event) {
    const target = event.target.closest && event.target.closest(INTERACTIVE_SELECTOR);
    if (!target || target.disabled || target.getAttribute("aria-disabled") === "true") return;
    animate(target, { scale: .965, duration: 110, ease: "outQuad" });
  }, { passive: true });

  ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
    doc.addEventListener(eventName, function (event) {
      const target = event.target.closest && event.target.closest(INTERACTIVE_SELECTOR);
      if (!target) return;
      animate(target, { scale: 1, duration: 260, ease: "outBack" });
    }, { passive: true });
  });

  if (global.MutationObserver) {
    const observer = new MutationObserver(function (records) {
      let viewChanged = false;
      records.forEach(function (record) {
        if (record.type === "attributes" && record.target.classList &&
            record.target.classList.contains("content-view") &&
            record.target.classList.contains("active")) viewChanged = true;
        record.addedNodes && record.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            animateCards(node);
            animateProgress(node);
          }
        });
      });
      if (viewChanged) animateActiveView(true);
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  animateActiveView(true);
  global.addEventListener("pageshow", function () { animateActiveView(true); }, { once: true });
})(window);
