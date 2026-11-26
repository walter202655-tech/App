# Aura100 - guía de publicación privada

## Estado

Esta versión queda preparada para una **beta privada**, no para un lanzamiento público con cuentas individuales. La aplicación y sus rutas de IA quedan protegidas mediante autenticación HTTP Basic cuando `NODE_ENV=production`. El proveedor de hosting puede consultar `/api/health`, que no devuelve credenciales ni información sensible.

## Requisitos

- Node.js 20 o superior.
- Una cuenta de hosting compatible con Node.js.
- Una clave API de OpenAI válida, guardada únicamente como variable de entorno.
- Un usuario y una contraseña de acceso para la beta.

## Variables de entorno

Configura estas variables en el panel del proveedor. No subas un archivo `.env` al repositorio.

- `NODE_ENV=production`
- `OPENAI_API_KEY`: clave privada nueva.
- `OPENAI_MODEL=gpt-6.1-sol`
- `APP_ACCESS_USER`: usuario de acceso a la beta.
- `APP_ACCESS_PASSWORD`: contraseña aleatoria larga, de al menos 16 caracteres.
- `TRUST_PROXY=true` (actívalo solo cuando el servicio esté detrás de un proxy de confianza, como el proxy de Railway; el servidor confía en un salto)
- `AI_RATE_LIMIT_WINDOW_MS=600000` (opcional; valor predeterminado: 600000 ms)
- `AI_RATE_LIMIT_MAX=20` (opcional; valor predeterminado: 20 solicitudes por ventana)
- `PUBLIC_DIR=.` (opcional; valor predeterminado: raíz de `Aura100`)

`PORT` no debe fijarse manualmente en Railway: el proveedor lo asigna y el servidor lo lee automáticamente. `OPENAI_MODEL` es opcional; si se omite, el backend utiliza `gpt-6.1-sol` como valor predeterminado configurado en `src/ai-service.mjs`.

El servidor escucha en `0.0.0.0` y utiliza el puerto asignado por el proveedor mediante `PORT`.

## Desarrollo local

1. Entra en la carpeta `Aura100`.
2. Ejecuta `npm install`.
3. Copia `.env.example` como `.env` y agrega una clave API válida si necesitas probar las funciones de IA.
4. Ejecuta `npm run check` y `npm test`.
5. Inicia con `npm start` y abre `http://localhost:3000`.

En desarrollo (`NODE_ENV=development`) no se activa la autenticación HTTP Basic. No uses ese modo para desplegar una instancia accesible públicamente.

## Publicar en Railway

1. Guarda el proyecto en un repositorio privado de GitHub. Antes, revisa que `.env`, `node_modules`, archivos de respaldo y claves no estén incluidos.
2. En Railway, crea un proyecto nuevo y conecta el repositorio.
3. Railway detectará `railway.json` y utilizará `npm start` como comando de inicio. Confirma que el proyecto instala las dependencias desde `Aura100/package.json` (configura `Aura100` como Root Directory si el repositorio contiene otros proyectos).
4. Añade las variables de entorno de la sección anterior desde el panel de Railway.
5. Genera un dominio HTTPS desde la configuración del servicio.
6. Comprueba `/api/health`. Debe devolver `status: "ok"` y `aiConfigured: true`.
7. Abre el dominio. El navegador solicitará el usuario y la contraseña configurados. Si el servicio falla al iniciar con el mensaje sobre `APP_ACCESS_USER` o `APP_ACCESS_PASSWORD`, revisa que ambas variables estén guardadas en el entorno Production y vuelve a desplegar.
8. Prueba conversación, escritura, gramática, vocabulario y plan de estudio con solicitudes pequeñas.

## Comprobaciones y alcance

`npm run check` comprueba la sintaxis de los archivos incluidos en el script. `npm test` ejecuta los tests que Node.js encuentre mediante `node --test`; que el comando termine correctamente no demuestra por sí solo que todos los módulos o flujos de usuario estén cubiertos. Registra por separado las pruebas manuales en Railway.

## Limitaciones antes de hacerla pública

La autenticación compartida sirve para una beta cerrada. No sustituye un sistema de cuentas individuales. Antes de abrir Aura100 a cualquier persona, implementa:

- Registro e inicio de sesión individual.
- Límites de uso por cuenta, no solo por dirección IP.
- Cuotas y alertas de gasto de API.
- Política de privacidad, aviso de tratamiento de textos y eliminación de datos.
- Persistencia segura en base de datos si se necesita sincronizar el progreso entre dispositivos.
- Pruebas automatizadas de rutas, validación, accesibilidad y seguridad.

## Seguridad de credenciales

El archivo `.env` del ZIP original contenía una variable con apariencia de clave API. Si era una clave activa, revócala y crea una nueva antes de publicar. No reutilices esa clave. El paquete preparado omite `.env`; usa `.env.example` solo como plantilla.
