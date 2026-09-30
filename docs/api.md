# Contrato API — v0.1

Base local: http://localhost:3001/api

Los endpoints health, sesiones y registros están implementados.

## Configuración

`SESSION_SECRET` debe contener un secreto propio de al menos 32 caracteres.
Mantenerlo estable: cambiarlo invalida las sesiones anteriores.

Después de preparar `.env`, este comando genera el secreto si falta
o todavía contiene el placeholder:

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

## GET /health

HTTP 200:

```json
{
  "status": "ok",
  "service": "fuera-de-linea-api"
}
```

Comprueba HTTP. MySQL se comprueba con `npm run db:check`.

## POST /registration-sessions

No requiere body ni datos personales.

HTTP 201, con `Cache-Control: no-store`:

```json
{
  "data": {
    "sessionToken": "<token firmado>",
    "expiresAt": "<fecha ISO UTC>",
    "serverTime": "<fecha ISO UTC>"
  }
}
```

Duración: 300 segundos. El frontend conservará token y vencimiento al recargar.

El token contiene identificador, versión y fechas. Se firma con HMAC-SHA256;
no está cifrado ni contiene datos personales.

Una sesión vence exactamente al alcanzar expiresAt.
La firma detecta alteraciones, pero no identifica de forma inviolable
al visitante ni impide solicitar nuevas sesiones.

## POST /registrations

Body:

```json
{
  "name": "Nombre de la persona",
  "email": "persona@example.com",
  "message": "Me interesa asistir.",
  "sessionToken": "<token firmado>"
}
```

Validaciones:

- Nombre: 2–100 caracteres tras recortar espacios.
- Correo: formato básico válido, máximo 254 caracteres.
- Mensaje: obligatorio, 1–1000 caracteres tras recortar espacios.
- Sesión: firma válida y plazo vigente al recibir la solicitud.

El correo se recorta y convierte a minúsculas.
No se comprueba que exista ni se envía un correo de confirmación.

HTTP 201, con `Cache-Control: no-store`:

```json
{
  "data": {
    "message": "Tu registro fue confirmado."
  }
}
```

El registro se guarda mediante consulta parametrizada.
MySQL impide duplicados, incluso con solicitudes simultáneas.
El primer registro se conserva; un duplicado no lo modifica.

El plazo se comprueba con la hora capturada al entrar en Express.
Una espera posterior de MySQL no revoca un envío recibido a tiempo.

## Errores

Formato:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Revisa los datos del formulario.",
    "fields": {
      "email": "Escribe un correo válido de hasta 254 caracteres."
    }
  }
}
```

`fields` aparece en errores de validación del formulario.

| HTTP | Código                   | Estado                          |
| ---- | ------------------------ | ------------------------------- |
| 400  | INVALID_INPUT            | Implementado                    |
| 400  | INVALID_SESSION          | Implementado                    |
| 403  | ORIGIN_NOT_ALLOWED       | Implementado                    |
| 409  | EMAIL_ALREADY_REGISTERED | Implementado                    |
| 410  | SESSION_EXPIRED          | Implementado                    |
| 429  | TOO_MANY_REQUESTS        | Previsto en Paso 4              |
| 503  | SERVICE_UNAVAILABLE      | Previsto en Paso 4              |
| 500  | INTERNAL_ERROR           | Respuesta genérica implementada |

No se devuelven secretos ni detalles internos.

## CORS

`ALLOWED_ORIGINS` contiene orígenes exactos separados por comas.
No acepta comodines ni URLs con rutas.

Origen local del frontend: http://localhost:3000.
Preflight permitido: 204. Origin no permitido: 403.

Solicitudes sin Origin, como curl, funcionan.
CORS controla acceso desde navegadores; no sustituye autenticación.
