# Contrato API — v0.1

Base local: http://localhost:3001/api

## Estado

- GET /health: implementado.
- POST /registration-sessions: implementado.
- POST /registrations: previsto en el Paso 3.

## Configuración de sesiones

`SESSION_SECRET` debe ser un secreto propio de al menos 32 caracteres.
No usar el placeholder de `.env.example`.

Este comando genera el secreto cuando falta o conserva el placeholder,
sin imprimirlo ni modificar las credenciales MySQL:

```bash
node --input-type=module <<'NODE'
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'dotenv';

const env = parse(readFileSync('.env', 'utf8'));

if (!env.SESSION_SECRET || env.SESSION_SECRET.startsWith('REPLACE_')) {
  env.SESSION_SECRET = randomBytes(32).toString('hex');
}

env.ALLOWED_ORIGINS ??= 'http://localhost:3000';

const content = Object.entries(env)
  .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
  .join('\n');

writeFileSync('.env', `${content}\n`);
NODE
```

Cambiar el secreto invalida las sesiones emitidas con el anterior.
Debe mantenerse estable entre arranques y despliegues.

## GET /health

Respuesta 200:

```json
{
  "status": "ok",
  "service": "fuera-de-linea-api"
}
```

Comprueba disponibilidad HTTP; no confirma la conexión MySQL.

## POST /registration-sessions

No requiere datos personales ni body.

Respuesta 201 con `Cache-Control: no-store`:

```json
{
  "data": {
    "sessionToken": "<token firmado>",
    "expiresAt": "<fecha ISO UTC>",
    "serverTime": "<fecha ISO UTC>"
  }
}
```

La sesión dura 300 segundos desde su emisión.
El frontend conservará token y vencimiento al recargar.

El token incluye identificador, versión y fechas. Se firma con HMAC-SHA256.
Está firmado, no cifrado; no contiene datos personales.

El servicio rechaza tokens alterados, malformados o vencidos.
Al alcanzar exactamente el vencimiento, la sesión deja de ser válida.

La firma permite detectar alteraciones; no identifica de forma inviolable
al visitante ni impide que solicite una nueva sesión.
La restricción de correo único protege el registro del evento.

## POST /registrations

Contrato previsto; se implementará en el Paso 3.

Body:

```json
{
  "name": "Nombre de la persona",
  "email": "persona@example.com",
  "message": "Me interesa asistir.",
  "sessionToken": "<token firmado>"
}
```

Respuesta prevista 201:

```json
{
  "data": {
    "message": "Tu registro fue confirmado."
  }
}
```

El servidor comprobará el plazo al recibir la solicitud.
Una respuesta tardía no revocará un envío aceptado dentro del plazo.

## Errores

Formato:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Descripción comprensible del error."
  }
}
```

| HTTP | Código                   | Estado                                             |
| ---- | ------------------------ | -------------------------------------------------- |
| 400  | INVALID_INPUT            | JSON malformado implementado; campos en Paso 3     |
| 400  | INVALID_SESSION          | Verificador implementado; respuesta HTTP en Paso 3 |
| 403  | ORIGIN_NOT_ALLOWED       | Implementado                                       |
| 409  | EMAIL_ALREADY_REGISTERED | Previsto en Paso 3                                 |
| 410  | SESSION_EXPIRED          | Verificador implementado; respuesta HTTP en Paso 3 |
| 429  | TOO_MANY_REQUESTS        | Previsto en Paso 4                                 |
| 503  | SERVICE_UNAVAILABLE      | Previsto en Paso 4                                 |
| 500  | INTERNAL_ERROR           | Respuesta genérica implementada                    |

No se devuelven secretos ni detalles internos.

## CORS

`ALLOWED_ORIGINS` contiene orígenes exactos separados por comas.
No acepta comodines ni URLs con rutas.

El origen local del frontend es http://localhost:3000.
Las solicitudes con un Origin no permitido reciben 403.
El preflight permitido responde 204.

Las solicitudes sin Origin, como curl, siguen funcionando.
CORS controla acceso desde navegadores; no sustituye autenticación.
