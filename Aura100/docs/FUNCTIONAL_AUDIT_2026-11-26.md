# Auditoría funcional preliminar — Aura100

Fecha: 26 de noviembre de 2026
Rama de revisión: `audit/aura100-functional-review`
Alcance: revisión estática de documentación, configuración y arquitectura visible en el repositorio. No equivale a una prueba de ejecución en navegador ni a una auditoría de seguridad completa.

## 1. Hallazgos confirmados

### P0 — Alinear la configuración documentada con el repositorio
- La guía de instalación de `README.md` indica copiar `.env.example`, pero ese archivo no está presente en `Aura100/`.
- El servidor de producción exige `APP_ACCESS_USER` y `APP_ACCESS_PASSWORD` con un mínimo de 16 caracteres. La guía principal de instalación no presenta ese requisito con suficiente prominencia.
- Acción: añadir una plantilla `.env.example` sin secretos y actualizar las guías de Railway/local. No incluir valores reales.

### P1 — Corregir las instrucciones de pruebas
- El `package.json` de `main` define `start`, `dev` y `check`, pero no define `test`.
- La documentación de estado menciona pruebas automatizadas y comprobaciones que no pueden reproducirse con los scripts actualmente declarados en `main`.
- El PR #3 propone incorporar pruebas y CI, pero sigue separado de `main`.
- Acción: alinear documentación, scripts y CI; no declarar una prueba como ejecutada hasta contar con el resultado de una ejecución real.

### P1 — Diferenciar interfaz, persistencia local y servicios conectados
- Existe un esquema SQL para una futura base de datos, pero la presencia del esquema no demuestra que Aura100 esté conectada a PostgreSQL o Supabase en producción.
- La documentación describe persistencia en `localStorage` para varias funciones. Esto no equivale a sincronización entre dispositivos ni a una cuenta individual en la nube.
- Acción: inventariar cada dato, su mecanismo actual de almacenamiento, sus límites y la estrategia de migración antes de implementar cuentas o sincronización.

### P1 — Delimitar con precisión las capacidades de pronunciación
- La propia documentación reconoce que la experiencia de pronunciación depende de Web Speech API y de coincidencia aproximada de transcripción, no de análisis acústico fonético.
- La disponibilidad y calidad de reconocimiento varían según navegador, dispositivo, idioma y permisos.
- Acción: mostrar compatibilidad y limitaciones por navegador, gestionar permisos y fallos, y evitar presentar la transcripción como una puntuación fonética precisa.

### P2 — Revisar el alcance de funciones comerciales
- La documentación de estado indica que el proveedor de pagos está desactivado.
- No debe presentarse la tienda, los paquetes premium o cualquier indicador de suscripción como un flujo de compra real hasta integrar y probar un proveedor de pagos y la validación del lado del servidor.
- Acción: mantener desactivadas las operaciones comerciales reales durante la beta privada.

## 2. Matriz de verificación propuesta

| Área | Evidencia actual | Verificación pendiente |
|---|---|---|
| Backend y API de IA | Servidor Express, seis rutas de IA y esquemas Zod | Pruebas de endpoints, errores, límites y respuestas incompletas |
| Conversation Partner | Módulo cliente y ruta `/api/ai/chat` | Conversación multi-turno, persistencia, escenarios y recuperación ante fallos |
| Writing Lab | Módulo cliente y ruta `/api/ai/writing` | Rúbrica, límites de entrada, calidad de feedback e historial |
| Grammar Tutor | Módulo cliente y rutas `explain` y `exercises` | Exactitud pedagógica, variedad y validación de respuestas |
| Vocabulary Builder | Módulo cliente y ruta `vocabulary` | Duplicados, guardado, IPA y exportación a Anki |
| Learning Plan | Módulo cliente y ruta `learning-plan` | Coherencia de minutos, objetivos, persistencia y regeneración |
| Placement Test | Módulo frontend dedicado | Cobertura de niveles, validez de puntuación e historial |
| Adaptive Learning / Mistakes | Motor frontend dedicado | Integridad de métricas, deduplicación y regla de dominio |
| Anki SRS | Integración descrita en la documentación | Cálculo SM-2, fechas, recuperación y exportación |
| Audio / Pronunciation | Adaptador frontend y Web Speech API | Compatibilidad real en Chrome, Edge, Firefox y Safari |
| Dashboard / Analytics | Vista y estado local descritos | Coherencia matemática de XP, rachas, precisión y métricas |
| Focus Mode | Temporizador frontend descrito | Pausa, reanudación, cambio de pestaña y ciclo de descanso |
| Auth | Contraseña compartida en producción | Flujo de sesión, cierre, protección de rutas y límites de beta privada |
| Base de datos | Esquema SQL documentado | No se ha demostrado conexión runtime ni políticas ejecutadas |
| Responsive / accesibilidad | PR #4 propone mejoras | Pruebas visuales, teclado, lectores de pantalla y tamaños reales |

## 3. Orden recomendado de trabajo

1. Completar CI y pruebas reproducibles antes de integrar cambios de seguridad.
2. Corregir documentación y configuración de despliegue para que coincidan con el código.
3. Crear pruebas de integración para las seis rutas de IA, incluidos errores y límites.
4. Verificar la persistencia de aprendizaje y Anki, evitando pérdida o duplicación de datos.
5. Validar Dashboard y motor adaptativo con datos de prueba controlados.
6. Probar audio, responsive y accesibilidad en navegadores reales.
7. Diseñar la migración a cuentas y base de datos solo después de estabilizar la beta privada.

## 4. Criterio de aceptación

Una función se considerará verificada únicamente cuando:
- exista una implementación conectada, no solo una vista o botón;
- se haya probado el flujo principal y al menos un caso de error;
- se haya comprobado qué datos guarda y dónde;
- la interfaz informe con claridad sus limitaciones;
- las pruebas y su resultado queden registrados.

## 5. Límites de esta revisión

No se ejecutó Aura100 en un navegador ni se realizaron pruebas contra Railway desde esta revisión. Tampoco se verificó una cuenta real de OpenAI, permisos de micrófono, sincronización remota o pagos. Los puntos anteriores son hallazgos estáticos y una hoja de ruta de validación, no una certificación de funcionamiento.
