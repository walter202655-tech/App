# Changelog - Aura100

## [4.2.0] - 2026-11-27

### Added
- Inventory dashboard, recent purchase history, product search and category filters.
- Ownership and availability indicators for store items.

### Improved
- Purchase validation, duplicate-unlock prevention and limits for upgrades.
- Transactions are recorded only after successful purchases.


## [4.1.0] - 2026-11-26

### Added
- Quick navigation palette with section search, keyboard navigation and shortcuts (Ctrl/Cmd + K or /).
- In-app changelog view and version history.
- Visible keyboard focus states for interactive controls.

### Improved
- Responsive header behavior on tablet and mobile screens.
- Reduced visual noise in compact layouts.
- Respect for the operating system's reduced-motion preference.

---

Todos los cambios notables realizados en el proyecto se documentan en este archivo.


## [Unreleased] — 2026-11-26

### Added - Academy Hub and Cambridge B2 preparation
- Added an AI-assisted weekly study calendar that uses the existing adaptive learning plan, schedules activities by day, and stores completed tasks locally.
- Added two date-based daily mini-games: an English Wordle-style challenge and a vocabulary matching game.
- Added a dedicated Cambridge B2 First preparation area with guidance for Reading and Use of English, Writing, Listening and Speaking.
- Added AI-generated personalised practice questions, short original Reading and Use of English practice sets, and a quick formative evaluation with transparent "Predictive Notes".
- Added a Cambridge exam Q&A chat scenario and a study-coach AI scenario for progress summaries.
- Expanded vocabulary into saved-word and vocabulary-assessment views, using the existing Anki deck as the learner's saved collection.
- Expanded the progress view with a question log, personal notes, recent assessment history and an AI-generated study summary.
- Added responsive styling and regression checks for the new Academy Hub views.
- Added explicit limits to practice feedback: short local assessments are not official Cambridge results or validated score predictions.

### Notes
- AI-generated questions and study summaries require the configured server-side AI service. Practice screens include local fallback questions when AI is unavailable.
- Calendar tasks, game results, questions, notes and chat history are stored in the browser's local storage for this beta. They are not synchronised between devices.
- The Cambridge practice sets are original learning exercises and do not reproduce official Cambridge papers.


## [v4.0.0] — 2026-11-22

### 🚀 Transformación de Arquitectura & Rebranding
- **Rebranding Completo:** Actualización integral de marca desde *LingoQuest v3.0* a **Aura100 v4.0 (English Academy)** en todas las vistas, modales, componentes y archivos exportables.
- **Arquitectura Híbrida Frontend/Backend:** Separación limpia de responsabilidades entre el cliente modular (`js/`) y el backend seguro en Node.js (`server.mjs`, `src/`).
- **Seguridad y Control de Acceso:** 
  - Restricción en `server.mjs` de acceso estático a `/src/`, archivos `.env`, `.bak`, `.py`, `.md` y carpetas de respaldo.
  - Implementación de Content-Security-Policy (CSP) robusta en `index.html` autorizando dominios de YouTube (`youtube.com`, `s.ytimg.com`, `google.com`), eliminando el **Error 153** en el reproductor de video.
  - Sanitización estricta de XSS: erradicación de inyecciones `innerHTML` con datos sin sanitizar del usuario o de respuestas de modelos de IA en el chat y evaluaciones.

### 🧠 Motor Adaptativo & Cuaderno de Errores (Adaptive Learning Engine)
- **Sustitución de Banderas Booleanas:** Eliminación del antiguo objeto booleano `categoriesPracticed` en favor de métricas cuantitativas reales (0–100%) calculadas dinámicamente sobre intentos y tasas de acierto.
- **Cuaderno de Errores Persistente (`aura100_mistakes_v4`):**
  - Registro automático de fallos en ejercicios de lección, tests y sesiones de práctica.
  - Almacenamiento con metadatos: fecha, habilidad, nivel CEFR, prompt, respuesta del usuario y respuesta correcta con explicación.
  - **Regla de Maestría (2-Strike Rule):** Requiere superar dos veces consecutivas un error antes de archivarlo como dominado.
  - Botón de exportación directa al mazo de repetición espaciada Anki SRS.
- **Banner de Recomendaciones Predictivas:** Sugiere activamente en el Dashboard la siguiente acción de mayor impacto (revisar cuaderno de errores, lección pendiente o repaso espaciado).

### 🎯 Test de Nivel Diagnóstico (Placement Test)
- **Prueba Adaptativa de 3 Fases:**
  - Fase 1: Diagnóstico de banda amplia (A1-A2, B1-B2, C1-C2).
  - Fase 2: Profundización de banda para evaluar competencia receptiva y léxica.
  - Fase 3: Discriminación fina y consolidación de competencia productiva y estilística.
- **Desglose de Competencias Multidimensional:** Gráfica de radar y barras porcentuales para *Gramática, Vocabulario, Lectura, Escucha, Escritura y Fonética*.
- **Historial Diagnóstico:** Almacenamiento de evaluaciones previas para medir la evolución en el tiempo.
- **Descargo de Responsabilidad Pedagógico:** Aviso visible que aclara que el test es formativo e indicativo, no un certificado oficial IELTS, Cambridge o TOEFL.

### 📝 Writing Lab & Evaluador AI
- **12 Tareas Graduadas CEFR:** Cubriendo niveles desde A1 hasta C2 (mensajes breves, correos informales, cartas formales, reseñas críticas, ensayos de opinión y memorandos ejecutivos).
- **Integración con `/api/ai/writing`:** Evaluación contra el backend `gpt-6.1-sol` con desglose en 4 criterios oficiales CEFR:
  - *Task Achievement / Fulfillment*
  - *Coherence and Cohesion*
  - *Lexical Resource*
  - *Grammatical Range and Accuracy*
- **Comparador Lado a Lado:** Vista comparativa entre el texto original del estudiante y la versión mejorada por el tutor.
- **Fallback Heurístico Local:** Rúbrica de corrección gramatical y estilística sin conexión cuando el servidor de IA no está configurado.

### 🤖 AI Conversation Partner & Tutores Especializados
- **8 Escenarios de Roleplay Inmersivo:** Café, Hotel, Aeropuerto, Entrevista de trabajo, Debate tecnológico, Estrategia de negocios, Charla casual y Consulta médica.
- **Tutor de Gramática AI (`/api/ai/explain`, `/api/ai/exercises`):** Explicaciones pedagógicas adaptadas al nivel y generación dinámica de ejercicios para las 48 unidades curriculares.
- **Constructor de Vocabulario AI (`/api/ai/vocabulary`):** Generación de tarjetas léxicas completas (definición, transcripción IPA, ejemplos, colocaciones) con guardado sin duplicados en el Word Bank y en el mazo Anki.

### 🎤 Adaptador de Audio & Fonética Honesta
- **Aviso de Precisión Acústica:** Clarificación honesta indicando que el reconocimiento de voz web realiza *coincidencia aproximada de texto/transcripción* y no un análisis espectrográfico de formantes acústicos.
- **Laboratorio de Pares Mínimos:** Práctica específica con contrastes fonológicos desafiantes para hispanohablantes (/iː/ vs /ɪ/, /b/ vs /v/, /æ/ vs /ʌ/, /s/ vs /z/).
- **Manejo de Errores de Dispositivo:** Notificación clara y no intrusiva cuando no hay soporte de reconocimiento de voz o se niega el permiso del micrófono.

### 🧘 Focus Mode (Pomodoro)
- Modo de concentración con temporizador Pomodoro de 25 minutos de estudio y 5 minutos de descanso.
- Ocultación automática de distracciones visuales (menús, barras de estado, animaciones) para permitir estudio inmersivo.

### 🎨 Corrección de Contraste y Accesibilidad en Temas Claros
- Solución completa para textos claros sobre fondos claros en los temas *01 · Field Notes* y *03 · Soft Studio*.
- Preguntas de ejercicios (`.exercise-question-text`), opciones de respuesta (`.mc-option`), subtítulos y títulos ahora presentan contraste 100% legible (#1a3028 y #26163b).

### 🗄️ Base de Datos y Persistencia
- Creación de `docs/DATABASE_SCHEMA.sql` con arquitectura relacional PostgreSQL / Supabase, Row Level Security (RLS) y soporte multi-inquilino seguro para migración futura a la nube.

## 4.0.1 - Preparación de beta privada

- Se actualizó el modelo predeterminado a `gpt-6.1-sol`, configurable mediante `OPENAI_MODEL`.
- Se reforzaron las instrucciones pedagógicas para conversación, escritura, gramática, ejercicios, vocabulario y planificación.
- Se añadieron comprobaciones de consistencia para ejercicios generados y planes semanales.
- Se añadieron límites de tiempo y manejo explícito de respuestas incompletas o rechazos del modelo.
- Se incorporó protección de acceso con contraseña compartida para despliegues privados en producción.
- Se añadió configuración inicial de Railway y una guía de publicación.
- Se excluyó el archivo `.env` del paquete distribuible.
