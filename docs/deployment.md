# Despliegue

## Servicios publicados

- Frontend: https://app-fuera-de-linea-front.netlify.app
- API: https://app-fuera-de-linea-back.onrender.com
- Salud: https://app-fuera-de-linea-back.onrender.com/api/health
- Base de datos: MySQL administrado por Aiven.

## Render

El backend se publica como Web Service conectado a la rama `main`.

Configuración:

- Runtime: Node.
- Node.js: 22.19.0.
- Build command: `npm ci && npm run build`.
- Start command: `npm start`.
- Health check: `/api/health`.

La instancia gratuita puede suspenderse por inactividad. La primera petición
después de una suspensión puede tardar aproximadamente un minuto.

## Variables del backend

Render administra las siguientes variables:

- `NODE_VERSION`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_SSL_MODE`
- `DB_SSL_CA_BASE64`
- `SESSION_SECRET`
- `ALLOWED_ORIGINS`

`ALLOWED_ORIGINS` contiene el origen exacto de Netlify, sin diagonal final.

Las credenciales, el secreto de sesión y el certificado codificado nunca se
versionan.

## MySQL remoto

La conexión con Aiven utiliza TLS obligatorio y valida el certificado de la
autoridad certificadora mediante `DB_SSL_CA_BASE64`.

La migración `001_create_registrations.sql` se ejecutó antes de publicar la
API y creó la tabla `registrations`.

## Evidencia

- Health check remoto con HTTP 200.
- Preflight de CORS con HTTP 204.
- Origen de Netlify autorizado explícitamente.
- Sesión temporal creada desde el frontend publicado.
- Registro confirmado y persistido en Aiven.
- Correo repetido rechazado.
- Una sola fila conservada para el correo utilizado.
