# 📋 Auditoría Técnica Previa — Aura100 v3.0 → v4.0

**Fecha:** 22 de Noviembre de 2026  
**Equipo:** Senior Software Architecture, Full-Stack JS, Educational UX/UI, CEFR Instructional Design, AI Integration & AppSec.

---

## 1. Inventario de Archivos Canónicos y Respaldos
- **Archivos Canónicos Activos:**
  - `index.html` (104,457 bytes, última mod. 19/11/2026)
  - `script.js` (578,621 bytes, última mod. 19/11/2026)
  - `style.css` (156,030 bytes, última mod. 19/11/2026)
  - `server.mjs`, `ai-client.js`, `src/ai-service.mjs`, `src/prompts.mjs`, `src/schemas.mjs`
- **Archivos de Respaldo Históricos (conservados sin editar):**
  - `index.html.bak` (73,615 bytes, 08/10/2026)
  - `script.js.bak` (148,199 bytes, 08/10/2026)
  - `style.css.bak` (71,817 bytes, 08/10/2026)
  - `index(1).html`: Verificado en disco; **no existe** en la carpeta ni en Descargas.
- **Copia de Seguridad Previa al Cambio v4.0:**
  - `backup_v3_pre_v4/index.html`
  - `backup_v3_pre_v4/script.js`
  - `backup_v3_pre_v4/style.css`

---

## 2. Vistas y Estructura DOM Existente
- `#view-dashboard`: Dashboard principal, métricas de XP, nivel, racha, palabras, Anki due, accuracy, Daily Goal, misiones diarias y cotización motivacional.
- `#view-lessons`: Ruta de aprendizaje A1–C2, selector de nivel CEFR, contenedor de ejercicios interactivos y footer de verificación.
- `#view-anki-srs`: Sistema de repetición espaciada Anki con volteo de tarjeta 3D, modo estudio, modo cram, y botones de calificación (Again, Hard, Good, Easy).
- `#view-video-lab`: LingoCinema con modo YouTube embed (youtube-nocookie) y modo Cyber Cinema (karaoke audio/canvas), subtítulos bilingües, sentence mining y shadowing.
- `#view-chatbot`: Simulador de conversación con 5 presets basados en palabras clave (Restaurante, Hotel, Direcciones, Entrevista, Amigos). Requiere conexión al endpoint `/api/ai/chat`.
- `#view-pronunciation`: Entrenador de transcripción mediante Web Speech API (SpeechRecognition). Solo mide coincidencia de texto, no fonética real.
- `#view-modules`: Pestañas para Grammar Lab, Reading Lab, Listening Lab, Writing Studio, Speaking Dialogues, Idioms, Irregular Verbs, Business English.
- `#view-quick-quiz`: Quiz rápido de 10 preguntas aleatorias de vocabulario y gramática.
- `#view-word-bank`: Banco maestro de palabras con filtro por nivel CEFR, búsqueda, audio de pronunciación y botón para agregar a Anki.
- `#view-shop`: Tienda con ruleta cuántica, bonus diario, consumibles (Streak Freeze, Double XP, Heart Refill, Extra Heart, Mystery Box, XP Boost) y packs premium.
- `#view-achievements`: Panel con ~50 logros desbloqueables.
- `#view-progress`: Estadísticas y analíticas generales.
- `#view-profile`: Gestión de usuario, avatar, CEFR objetivo y reinicio de progreso.

---

## 3. Claves de `localStorage` y Estado
- Clave canónica actual: `aura100_state_v3` (previamente `lingoquest_state_v3`).
- Estructura del estado actual:
  - `username`, `avatar`, `targetCefr`, `xp`, `coins`, `hearts`, `maxHearts`, `streak`, `bestStreak`, `lastActiveDate`, `dailyGoalXp`, `dailyCurrentXp`, `dailyGoalCompleted`, `completedLessons`, `knownWords`, `ankiDeck`, `ankiReviewsLifetime`, `unlockedAchievements`, `inventory`, `stats`.
- **Problema detectado en métricas:**
  - `stats.categoriesPracticed`: almacena flags booleanos (`vocabulary: true`, `grammar: false`, etc.) que en el progreso se mostraban engañosamente como barras de 100% o 0%.
  - Se sustituirá en v4.0 por métricas cuantitativas (`topicsPracticed`, `skillMastery`, `accuracyBySkill`, `attemptsByTopic`).

---

## 4. Diagnóstico de Módulos Específicos
1. **Chatbot:**
   - Previamente: diccionario estático `CHAT_SCENARIOS` con coincidencia de palabras clave.
   - Diagnóstico: funcional como fallback offline, pero debe integrarse con `window.Aura100AI.chat()` vía `/api/ai/chat` para conversación real por nivel y escenario, renderizando con `textContent` seguro.
2. **Writing Studio:**
   - Previamente: comparación básica de longitud de palabras y respuesta modelo pre-escrita.
   - Diagnóstico: debe integrarse con `/api/ai/writing` para evaluación estructurada de criterios (Task fulfilment, Cohesion, Lexical resource, Grammar, Register).
3. **Grammar Lab:**
   - 48 unidades bien documentadas desde A1 hasta C2.
   - Diagnóstico: Excelente base. Debe conectarse con `/api/ai/explain` para dudas libres y `/api/ai/exercises` para práctica infinita graduada.
4. **Anki SRS:**
   - Utiliza una aproximación al algoritmo SuperMemo SM-2 (`repetitions`, `interval`, `easeFactor`).
   - Diagnóstico: Funciona bien en memoria y localStorage. Se mantendrá el motor determinista exacto y se sincronizará con el nuevo **Mistake Notebook**.
5. **Pronunciation Coach:**
   - Web Speech API SpeechRecognition.
   - Diagnóstico: Solo hace coincidencia de transcripción de texto. Se actualizará la UI para describir con honestidad técnica que es una "coincidencia aproximada de transcripción" y no un análisis fonético acústico. Se incorporará la arquitectura de adaptador para futuros proveedores fonéticos.
6. **Video Lab (LingoCinema):**
   - Utiliza `youtube-nocookie.com/embed` y fallback Cyber Cinema.
   - Diagnóstico: Estable y compatible con entornos locales y web.

---

## 5. Estrategia de Migración y Nuevas Vistas en Aura100 v4.0
- Nueva versión del estado: `aura100_state_v4` con migración transparente y automática desde `v3` y `v2`.
- Nuevas vistas y módulos:
  1. `#view-placement`: Placement Test adaptativo (6 habilidades, nivel progresivo, feedback multidimensional).
  2. `#view-mistakes`: Mistake Notebook (registro de errores de lecciones, quizzes, grammar y writing, con filtros y repaso directo a Anki).
  3. `#view-adaptive`: Motor adaptativo de recomendaciones basado en rendimiento real.
  4. `#view-learning-plan`: Planificador de estudio diario/semanal conectado con `/api/ai/learning-plan`.
  5. `#view-analytics`: Dashboard rediseñado con métricas cuantitativas reales por habilidad y gráficos SVG dinámicos.
  6. `#view-focus`: Focus Mode libre de distracciones con temporizador integrado.
