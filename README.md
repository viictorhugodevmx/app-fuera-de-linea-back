# Fuera de Línea — Backend

API para el registro de un evento ficticio de cultura urbana, música,
arte y creación digital.

## Estado

Persistencia MySQL y sesiones firmadas de cinco minutos implementadas.
El endpoint de registro se implementará en el Paso 3.

## Requisitos

- Node.js 22.19.0.
- npm.
- MySQL 8.0; entorno local validado con 8.0.46.

Versiones instaladas: [Entorno](docs/environment.md).

## Instalación

```bash
nvm use
npm ci
cp .env.example .env
```

1. Crear bases y usuarios y configurar contraseñas:
   [Base de datos](docs/database.md).
2. Preparar SESSION_SECRET y ALLOWED_ORIGINS:
   [Contrato API](docs/api.md).

Después:

```bash
npm run db:check
npm run db:migrate
npm run db:migrate:test
```

## Desarrollo

```bash
npm run dev
```

API local: http://localhost:3001.

## Validación

```bash
npm run check
```

Incluye formato, lint, tipos, tests y build.
Requiere MySQL y la base de pruebas configurados.

Comandos específicos y curl: [Pruebas](docs/testing.md).

## Producción local

```bash
npm run build
npm start
```

Conservar las variables de entorno, incluido el secreto de sesiones.

## Documentación

- [Proyecto](PROJECT.md)
- [Blueprint](BLUEPRINT.md)
- [Estado](STATUS.md)
- [Decisiones](DECISIONS.md)
- [Arquitectura](docs/architecture.md)
- [Base de datos](docs/database.md)
- [Contrato API](docs/api.md)
- [Pruebas](docs/testing.md)

## Colaboración con IA

Utilizo IA como apoyo para organizar tareas, preparar propuestas de código,
analizar errores y mejorar la documentación. Reviso las propuestas y ejecuto
las validaciones antes de cerrar cada etapa.

Más información: [Colaboración con IA](docs/ai-collaboration.md).

## Credenciales

`.env.example` documenta las variables sin credenciales reales.
`.env` permanece fuera de Git. No compartir contraseñas ni SESSION_SECRET.
