# Aura100 - Integración inicial de IA

Este paquete añade un backend de desarrollo para conectar Aura100 con la API de OpenAI. Incluye endpoints para conversación, evaluación de escritura, explicaciones, generación de ejercicios, vocabulario y planes semanales.

## Requisitos

- Node.js 20 o superior.
- Una clave de API de OpenAI creada y administrada por el titular adulto de la cuenta o con su autorización.
- Acceso a internet para realizar solicitudes a la API.

La API se factura separadamente de una suscripción a ChatGPT. Revisa precios, límites y controles de uso antes de habilitarla.

## Integración con los archivos actuales

El proyecto actual tiene `index.html`, `script.js` y `style.css` en la raíz. Por eso este backend usa `PUBLIC_DIR=.` como configuración local predeterminada y bloquea el acceso HTTP a sus propios archivos de configuración.

1. Haz una copia de seguridad de tu carpeta Aura100.
2. Copia `server.mjs`, `package.json`, `.env.example`, `.gitignore` y la carpeta `src/` a la raíz de Aura100.
3. Abre una terminal en esa carpeta.
4. Ejecuta `npm install`.
5. Copia `.env.example` como `.env`.
6. Coloca la clave privada en `OPENAI_API_KEY` dentro de `.env`.
7. Ejecuta `npm run check`.
8. Ejecuta `npm run dev`.
9. Abre `http://localhost:3000`.
10. Comprueba `http://localhost:3000/api/health`; `aiConfigured` debe ser `true`.

En Windows PowerShell, para crear `.env` desde el ejemplo:

```powershell
Copy-Item .env.example .env
```

No abras `index.html` mediante doble clic: la app debe cargarse desde el servidor local para que las rutas `/api/ai/...` funcionen.

## Cliente frontend incluido

`ai-client.js` crea `window.Aura100AI`, un cliente pequeño para llamar las seis rutas, con timeout, manejo de errores HTTP y validación básica de respuestas. Inclúyelo en `index.html` antes de `script.js` y úsalo desde la clase de la aplicación. No contiene credenciales.

## Endpoints incluidos

Todos los endpoints de IA son `POST` y devuelven JSON.

- `/api/ai/chat`
- `/api/ai/writing`
- `/api/ai/explain`
- `/api/ai/exercises`
- `/api/ai/vocabulary`
- `/api/ai/learning-plan`

Ejemplo de conversación:

```javascript
const response = await fetch("/api/ai/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "I think learning English is useful because...",
    level: "B1",
    scenario: "free",
    history: []
  })
});

const data = await response.json();
if (!response.ok) throw new Error(data.error || "AI request failed");
console.log(data.reply);
```

Ejemplo de evaluación de escritura:

```javascript
const response = await fetch("/api/ai/writing", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Learning another language can create new opportunities...",
    taskType: "essay",
    level: "B2",
    taskPrompt: "Discuss the benefits of learning another language.",
    language: "es"
  })
});

const data = await response.json();
if (!response.ok) throw new Error(data.error || "Writing evaluation failed");
console.log(data.evaluation);
```

## Importante: estado del paquete

Este es un punto de partida de desarrollo, no un despliegue público listo para producción.

- No incorpora todavía cuentas de usuario ni autenticación.
- No incorpora una base de datos persistente.
- No implementa suscripciones reales ni pagos.
- No calcula un entitlement Premium real.
- Los límites de solicitudes se aplican por IP y son una protección inicial, no un sistema de cuotas por usuario.
- En `NODE_ENV=production`, el backend bloquea deliberadamente las rutas de IA hasta que se añadan autenticación y comprobaciones de permisos en el servidor.
- El navegador no debe recibir nunca `OPENAI_API_KEY`.
- Las respuestas de evaluación son estimaciones didácticas, no certificaciones oficiales CEFR ni resultados oficiales de exámenes.
- El reconocimiento de voz del navegador no equivale a un análisis fonético. Para puntuar fonemas, acento o entonación se necesita un servicio de análisis de audio adecuado.

Para pasar a producción, implementa autenticación, base de datos, cuotas por usuario, verificación de suscripción en el servidor, protección CSRF cuando corresponda, logs mínimos, monitorización, política de privacidad, consentimiento informado y controles de seguridad apropiados para menores. No recolectes datos personales innecesarios.

## Modelo

El valor predeterminado es `gpt-6.1-sol`, configurable desde `.env` mediante `OPENAI_MODEL`. Comprueba el catálogo y los precios actuales antes de modificarlo.

## Documentación oficial

- https://developers.openai.com/api/docs/quickstart
- https://developers.openai.com/api/docs/models
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/moderation
