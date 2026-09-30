# Contrato API — v0.1

Base local: http://localhost:3001/api

Configuración y límites: [Operación](runtime.md).

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

HTTP 201, con Cache-Control: no-store:

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

El token contiene identificador, versión y fechas, firmado con HMAC-SHA256.
No está cifrado ni contiene datos personales.
Vence exactamente al alcanzar expiresAt.

La firma detecta alteraciones; no identifica de forma inviolable al visitante
ni impide solicitar otra sesión.

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

- Nombre: 2–100 caracteres tras recortar espacios.
- Correo: formato básico válido, máximo 254 caracteres.
- Mensaje: obligatorio, 1–1000 caracteres tras recortar espacios.
- Sesión: firma válida y vigente al recibir la solicitud.

El correo se recorta y convierte a minúsculas.
No se comprueba su existencia ni se envía correo de confirmación.

HTTP 201, con Cache-Control: no-store:

```json
{
  "data": {
    "message": "Tu registro fue confirmado."
  }
}
```

La inserción es parametrizada.
MySQL impide duplicados incluso ante solicitudes simultáneas.
Un duplicado no modifica el primer registro.

El plazo se comprueba con la hora de recepción.
Una espera posterior de MySQL no revoca un envío recibido a tiempo.

## Errores implementados

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

| HTTP | Código                   | Motivo                                   |
| ---- | ------------------------ | ---------------------------------------- |
| 400  | INVALID_INPUT            | Datos o JSON inválidos                   |
| 400  | INVALID_SESSION          | Token ausente, malformado o alterado     |
| 403  | ORIGIN_NOT_ALLOWED       | Origin no permitido                      |
| 409  | EMAIL_ALREADY_REGISTERED | Correo repetido                          |
| 410  | SESSION_EXPIRED          | Plazo agotado                            |
| 413  | PAYLOAD_TOO_LARGE        | Body mayor de 16 KB                      |
| 429  | TOO_MANY_REQUESTS        | Cuota de solicitudes agotada             |
| 503  | SERVICE_UNAVAILABLE      | Fallo temporal de dependencia reconocido |
| 500  | INTERNAL_ERROR           | Error inesperado                         |

No se exponen secretos ni detalles internos.
