# ⚡ Aura100 v4.0 — Adaptive English Learning Platform
### Dominio del Inglés desde A1 hasta C2 • Motor Adaptativo • Cuaderno de Errores • IA Evaluadora • Anki SRS • AuraCinema

**Aura100 v4.0** es una plataforma educativa integral, adaptativa y personalizada de última generación para la adquisición acelerada del idioma inglés basada en el Marco Común Europeo de Referencia (**CEFR A1, A2, B1, B2, C1, C2**).

Combina una arquitectura robusta orientada a la privacidad, un frontend modular con 4 sistemas de diseño intercambiables y un backend Node.js que orquesta 6 rutas de inteligencia artificial avanzadas con soporte para modelos OpenAI (`gpt-6.1-sol`), manteniendo una degradación elegante (*graceful fallback*) con rúbricas heurísticas locales cuando se opera sin conexión o sin clave de API.

---

## 🌟 Módulos y Capacidades Principales

### 1. 🧠 Motor de Aprendizaje Adaptativo & Cuaderno de Errores
- **Métricas cuantitativas reales:** Supera los indicadores booleanos con métricas de competencia precisas (0–100%) en 6 habilidades: *Gramática, Vocabulario, Lectura, Escucha, Escritura y Fonética*.
- **Cuaderno de Errores Activo:** Registro centralizado y deduplicado de fallos cometidos durante las lecciones con fecha, contexto y explicación.
- **Regla de Maestría (2-Strike Rule):** Un error solo se archiva como dominado tras ser superado exitosamente dos veces consecutivas.
- **Exportación a Anki SRS:** Con un solo clic, convierte cualquier error del cuaderno en una tarjeta de repetición espaciada con el algoritmo SuperMemo SM-2.
- **Recomendación Dinámica en Dashboard:** Banner predictivo que sugiere exactamente qué estudiar según el historial reciente de aciertos y debilidades.

### 2. 📝 Writing Lab & AI Evaluator
- **12 Tareas Graduadas:** Desde mensajes sencillos de presentación (A1) y correos informales (A2), pasando por reviews y cartas formales (B1-B2), hasta ensayos de debate y síntesis ejecutivas (C1-C2).
- **Evaluación Multi-Criterio:** Rúbrica desglosada en *Task Achievement, Coherence & Cohesion, Lexical Resource, y Grammatical Range & Accuracy*.
- **Comparador Visual de Corrección:** Visualización lado a lado entre el texto original y la versión reescrita por el tutor, acompañada de justificación pedagógica y lista de errores detectados.
- **Historial de Envíos:** Almacenamiento local persistente de todas las composiciones evaluadas.

### 3. 🎯 Test de Nivel Diagnóstico (Placement Test)
- **Ruta Adaptativa de 3 Fases:**
  - *Fase 1 (Diagnóstico inicial):* Determina la banda de entrada (A1-A2 vs B1-B2 vs C1-C2).
  - *Fase 2 (Profundización de banda):* Calibra la fluidez dentro del nivel.
  - *Fase 3 (Discriminación fina y consolidación):* Afina el resultado exacto.
- **Evaluación Multidimensional:** Desglose visual en 6 competencias con radar y barras de porcentaje.
- **Historial Diagnóstico:** Seguimiento del progreso temporal de nivel CEFR.
- **Aviso de Transparencia Académica:** Declaración explícita indicando que la prueba es diagnóstica y formativa (no un certificado oficial IELTS, Cambridge o TOEFL).

### 4. 🤖 AI Conversation Partner & Grammar/Vocab AI Tutors
- **8 Escenarios de Roleplay Inmersivo:**
  - *Coffee Shop (A1)* — Pedir bebidas y bocadillos.
  - *Hotel Check-in (A2)* — Registrarse y solicitar amenidades.
  - *Airport Assistance (B1)* — Resolver conexiones de vuelo y equipaje.
  - *Job Interview (B2)* — Responder preguntas sobre experiencia y metas profesionales.
  - *Tech & AI Debate (C1)* — Debatir sobre ética de IA y automatización.
  - *Business Strategy (C2)* — Negociación ejecutiva de contratos internacionales.
  - *Casual Hangout (A2-B1)* — Charlas informales sobre aficiones y planes.
  - *Doctor's Office (B1-B2)* — Describir síntomas médicos con precisión.
- **Seguridad DOM Estricta:** Renderizado seguro utilizando `textContent` y creación de nodos del DOM nativos, erradicando inyecciones `innerHTML` en mensajes de usuarios y modelos.
- **Tutor de Gramática AI:** Explicaciones contextuales inmediatas y generador de ejercicios bajo demanda para las 48 unidades curriculares.
- **Vocabulary Builder AI:** Generador de fichas léxicas completas (definición, IPA, ejemplos, collocations) con guardado directo en Word Bank y Anki.

### 5. 🎤 Adaptador de Audio & Fonética Honesta
- **Descripción Técnica Honesta:** El sistema etiqueta claramente la tecnología como *coincidencia aproximada de transcripción basada en el motor Web Speech del navegador* y no como análisis acústico/fonémico nativo de laboratorio.
- **Pares Mínimos (Minimal Pairs):** Laboratorio de diferenciación de fonemas contrastivos problemáticos para hispanohablantes (/ɪ/ vs /iː/, /æ/ vs /ʌ/, /b/ vs /v/, /s/ vs /z/, etc.).
- **Detección de Permisos y Micrófono:** Manejo transparente de errores de micrófono, denegación de permisos y estado acústico deshabilitado por falta de modelo de voz en hardware.

### 6. 🧘 Focus Mode (Pomodoro 25/5)
- HUD superior fijo no intrusivo con temporizador de cuenta regresiva (25 min de estudio intensivo / 5 min de descanso).
- Oculta distracciones de la interfaz (sidebar, barra de navegación, estadísticas) y reduce transiciones para optimizar la concentración profunda.

### 7. 🎬 AuraCinema Video Lab
- **Modo Dual:** YouTube oficial con política de seguridad CSP corregida (previene Error 153) y reproductor Cyber Cinema 100% offline con visualizador sobre canvas y SpeechSynthesis nativo.
- **Sentence Mining:** Haz clic en cualquier palabra para inspeccionar su etimología, traducción y enviarla a Anki con un toque.

### 8. 🎨 4 Sistemas de Diseño Figma (100% WCAG Accesible)
- **Cyberpunk HUD:** Estética futurista con partículas espaciales dinámicas y neón.
- **01 · Field Notes:** Papel pergamino botánico, tipografía serif Lora y alto contraste (#1a3028).
- **02 · Night Signal:** Pizarra oceánica profunda con acentos lima radar y tipografía Space Grotesk.
- **03 · Soft Studio:** Minimalismo lila pastel, tarjetas suaves y tipografía Manrope.
- Todos los textos de ejercicios y botones cuentan con contraste verificado para lectura sin fatiga visual.

---

## 🛠️ Requisitos e Instalación

### Requisitos Previos
- **Node.js** v18 o superior (recomendado v20+ o v24 LTS).
- **NPM** v9 o superior.
- Navegador web moderno (Chrome, Edge, Firefox, Safari).

### Instalación Rápida

1. Clona o entra en la carpeta del proyecto:
   ```bash
   cd C:\Users\mateo\.gemini\antigravity\scratch\LingoQuest
   ```

2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Abre `.env` y agrega opcionalmente tu `OPENAI_API_KEY`:
   ```ini
   PORT=3000
   OPENAI_API_KEY=tu_clave_de_openai_aqui
   OPENAI_MODEL=gpt-6.1-sol
   ```
   > ⚠️ **Nota de Seguridad:** Las claves de API se procesan exclusivamente en `server.mjs` del lado del servidor. Ninguna clave privada se expone en el cliente web ni se incluye en el control de versiones.

4. Verifica la integridad del código:
   ```bash
   npm run check
   ```

5. Inicia el servidor de Aura100:
   ```bash
   npm start
   ```

6. Abre tu navegador en:
   ```text
   http://localhost:3000
   ```

> 💡 **Modo Offline / Sin Servidor:** También puedes hacer doble clic directamente sobre `index.html`. La plataforma cuenta con motores heurísticos locales para todas las funciones, por lo que ninguna funcionalidad se bloquea o queda inutilizable sin internet o sin clave de OpenAI.

---

## 📡 Rutas de la API Backend

| Método | Endpoint | Descripción | Esquema / Retorno |
|:---|:---|:---|:---|
| `GET` | `/api/health` | Estado del servidor y disponibilidad de IA | `{ status: "ok", app: "Aura100", aiConfigured: bool }` |
| `POST` | `/api/ai/chat` | Turno de conversación con el compañero IA | `{ role: "assistant", content: string, feedback?: object }` |
| `POST` | `/api/ai/writing` | Evaluación de textos según rúbrica CEFR | `{ overallScore, cefrLevel, criteria, correctedVersion, mistakes, generalFeedback }` |
| `POST` | `/api/ai/explain` | Tutor gramatical que explica reglas y usos | `{ explanation, examples, commonMistakes, memoryTip }` |
| `POST` | `/api/ai/exercises` | Generador de ejercicios para una unidad | `{ exercises: Array<{ type, instruction, question, options, correctAnswer, explanation }> }` |
| `POST` | `/api/ai/vocabulary` | Generador de tarjetas léxicas enriquecidas | `{ word, ipa, translation, definitionEn, examples, collocations }` |
| `POST` | `/api/ai/learning-plan` | Plan de estudio personalizado adaptativo | `{ weeklyGoals, dailyPlan, recommendations }` |

---

## 📁 Estructura del Proyecto

```text
LingoQuest/
├── index.html                   # Interfaz principal, HUD de Foco, modales y navegación
├── script.js                    # Motor central de la aplicación (Aura100App)
├── style.css                    # Estilos unificados, variables temáticas y modo contraste
├── server.mjs                   # Servidor Express seguro (Helmet, CORS, rate limiting)
├── package.json                 # Dependencias y scripts de verificación
├── .env.example                 # Plantilla de configuración de entorno sin secretos
├── ai-client.js                 # Cliente frontend para interactuar con la API de IA
├── js/                          # Módulos frontend especializados de Aura100 v4.0
│   ├── adaptive-engine.js       # Motor adaptativo de competencias y Cuaderno de Errores
│   ├── placement-test.js        # Test de nivel adaptativo de 3 fases A1–C2
│   ├── writing-evaluator.js     # Writing Lab con 12 tareas y evaluador CEFR
│   ├── ai-conversation.js       # AI Conversation Partner con 8 escenarios y DOM seguro
│   ├── grammar-ai.js            # Tutor de gramática y generador de ejercicios
│   ├── vocabulary-ai.js         # Generador de vocabulario estructurado y guardado Anki
│   ├── audio-adapter.js         # Adaptador fonético, pares mínimos y diagnóstico de audio
│   └── learning-plan-ai.js      # Planificador de estudio semanal adaptativo
├── src/                         # Servicios del backend (protegidos contra acceso estático)
│   ├── ai-service.mjs           # Orquestador de llamadas a OpenAI / LLM
│   ├── prompts.mjs              # Prompts de sistema pedagógicos con estándares CEFR
│   └── schemas.mjs              # Esquemas de salida JSON estructurada con Zod
└── docs/                        # Documentación técnica de arquitectura y base de datos
    ├── AUDIT_REPORT.md          # Auditoría inicial exhaustiva de la versión previa
    ├── DATABASE_SCHEMA.sql      # Esquema relacional PostgreSQL / Supabase con RLS
    ├── CHANGELOG.md             # Registro de cambios cronológico de v4.0
    └── IMPLEMENTATION_STATUS.md # Matriz de estado de implementación de requisitos
```

---

## 🔒 Privacidad y Seguridad

- **Sin Claves en el Cliente:** Todo el tráfico hacia los proveedores de IA ocurre a través del servidor Node.js intermediario.
- **Protección de Archivos Sensibles:** `server.mjs` bloquea peticiones estáticas hacia `/src/`, `.env`, `.bak`, archivos `.py`, `.md` y carpetas de respaldo.
- **Mitigación XSS:** Sanitización estricta en el chat y las evaluaciones; no se inyectan respuestas del modelo ni del usuario mediante `innerHTML` directo.
- **Prevención de Error 153 en Video:** La cabecera Content Security Policy (CSP) en `index.html` autoriza explícitamente los dominios oficiales de YouTube (`youtube.com`, `s.ytimg.com`, `google.com`) junto con el formato estandarizado `origin` en los iframes.

---

## 📄 Licencia

Este proyecto es propiedad del equipo de desarrollo de Aura100. Diseñado bajo estándares CEFR A1-C2 para uso educativo.


## Publicación

Consulta `docs/DEPLOYMENT_PRIVATE_BETA.md` para preparar una beta privada en Railway. Esta configuración utiliza una contraseña compartida y no debe considerarse un sistema de cuentas públicas.
