/* Premium Store runtime corrections and integrations.
 * Loaded after script.js so the Aura100 app instance already exists.
 */
(function () {
  "use strict";
  const app = window.app;
  if (!app) return;

  app.filterShopItems = function () {
    const query = (document.getElementById("shop-search")?.value || "").trim().toLocaleLowerCase("es");
    const category = document.getElementById("shop-category-filter")?.value || "all";
    document.querySelectorAll("#view-shop .shop-item-card").forEach(card => {
      const section = card.closest(".premium-product-section");
      const grid = card.closest(".shop-grid");
      const heading = grid?.previousElementSibling;
      const label = (heading?.textContent || "").toLowerCase();
      card.dataset.shopCategory = section ? "premium" : label.includes("anki") ? "anki" : label.includes("premium") ? "premium" : "consumables";
      const text = ((card.querySelector("h4")?.textContent || "") + " " + (card.querySelector("p")?.textContent || "")).toLocaleLowerCase("es");
      card.hidden = !(text.includes(query) && (category === "all" || category === card.dataset.shopCategory));
    });
    document.querySelectorAll("#view-shop .shop-grid").forEach(grid => {
      const visible = Array.from(grid.querySelectorAll(".shop-item-card")).some(card => !card.hidden);
      const section = grid.closest(".premium-product-section");
      if (section) section.hidden = !visible;
      if (grid.previousElementSibling?.classList.contains("section-title")) grid.previousElementSibling.hidden = !visible;
      grid.hidden = !visible;
    });
  };

  const originalRenderShop = app.renderShop.bind(app);
  app.renderShop = function () {
    originalRenderShop();
    this.filterShopItems();
    this.renderPremiumStoreDashboard();
  };

  app.evaluatePremiumWriting = async function () {
    const input = document.getElementById("premium-writing-response");
    const feedback = document.getElementById("premium-writing-feedback");
    const button = document.getElementById("premium-writing-submit");
    const text = String(input?.value || "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    if (words < 120 || words > 220) {
      if (feedback) feedback.textContent = "La tarea requiere entre 120 y 220 palabras. Tu texto tiene " + words + ".";
      return;
    }
    if (this.premiumWritingBusy) return;
    if (!window.Aura100AI || typeof window.Aura100AI.evaluateWriting !== "function") {
      if (feedback) feedback.textContent = "El servicio de evaluación no está disponible. Comprueba la conexión e inténtalo más tarde.";
      return;
    }
    this.premiumWritingBusy = true;
    if (button) button.disabled = true;
    if (feedback) feedback.textContent = "Evaluando organización, vocabulario, gramática y cumplimiento de la tarea...";
    const workshop = this.premiumWritingWorkshops()[this.currentPremiumWritingWorkshop];
    const typeMap = { essay: "essay", report: "report", proposal: "other", review: "review", article: "article", "formal email": "email" };
    try {
      const evaluation = await window.Aura100AI.evaluateWriting({
        text,
        taskType: typeMap[workshop.type.toLowerCase()] || "other",
        level: "C1",
        taskPrompt: "[WRITING_PRO_WORKSHOP] " + workshop.prompt + " Target length: 120-220 words.",
        language: "es"
      });
      if (feedback) feedback.innerHTML = '<div class="premium-writing-feedback"><strong>Resultado formativo: ' + escapeHTML(String(evaluation.overallScore ?? "—")) + '%</strong><p>' + escapeHTML(String(evaluation.summary || "Evaluación completada.")) + '</p><ul>' + (evaluation.nextSteps || []).map(step => '<li>' + escapeHTML(String(step)) + '</li>').join("") + '</ul><small>Evaluación orientativa generada por IA; no es una calificación oficial.</small></div>';
      this.state.premiumWritingSubmissions = (this.state.premiumWritingSubmissions || 0) + 1;
      this.saveState();
    } catch (error) {
      if (feedback) feedback.textContent = "No se pudo evaluar el texto. Comprueba la conexión con la IA e inténtalo de nuevo.";
    } finally {
      this.premiumWritingBusy = false;
      const currentButton = document.getElementById("premium-writing-submit");
      if (currentButton) currentButton.disabled = false;
    }
  };
})();
