# Configuración y operación

## Variables

Las variables MySQL se explican en [Base de datos](database.md).
Los ejemplos están en `.env.example`; los valores reales quedan en `.env`.

`SESSION_SECRET` debe ser propio y tener al menos 32 caracteres.
Mantenerlo estable: cambiarlo invalida las sesiones emitidas.

Este comando genera el secreto si falta o conserva el placeholder,
sin imprimirlo ni cambiar las credenciales MySQL:

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

## CORS

`ALLOWED_ORIGINS` contiene orígenes exactos separados por comas.
No acepta comodines ni URLs con rutas.

Origen local: http://localhost:3000.
Preflight permitido: 204. Origin rechazado: 403.
Solicitudes sin Origin, como curl, siguen funcionando.

CORS no sustituye autenticación.

## Límite de solicitudes

Sesiones y registros comparten una cuota de 30 solicitudes por minuto
por IP. Al excederla, la API devuelve 429 y Retry-After.

Health y los preflights no consumen esta cuota.

El contador está en memoria por proceso y se reinicia al reiniciar el servidor.
Es una protección sencilla para esta demo, no una cuota distribuida.

Al desplegar detrás de un proxy se verificará la configuración de
trust proxy antes de evaluar la identificación por IP.

## Errores y logs

Fallos temporales reconocidos de conexión o disponibilidad de MySQL
se traducen a 503. Otros errores inesperados devuelven 500.

Los logs registran estado y código técnico.
No imprimen formulario, token, contraseñas ni mensajes internos del driver.

La inserción no se reintenta automáticamente.

## Tamaño de solicitudes

El parser JSON admite hasta 16 KB.
Una solicitud mayor recibe 413 con código PAYLOAD_TOO_LARGE.

## Tiempo de registro

Express captura la hora de recepción antes de procesar el formulario.
La sesión se comprueba con esa hora.

Una solicitud recibida dentro del plazo puede confirmarse aunque su
procesamiento termine después del vencimiento.

## Arranque y cierre

```bash
npm run build
npm start
```

SIGINT y SIGTERM inician el cierre: dejar terminar solicitudes activas,
cerrar HTTP y cerrar el pool MySQL.

El proceso dispone de diez segundos antes de forzar un cierre con error.

Víctor comprobó el cierre mediante Ctrl+C después de un registro real.
