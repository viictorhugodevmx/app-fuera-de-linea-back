# Fuera de Línea — Backend

API para el registro de un evento ficticio de cultura urbana, música,
arte y creación digital.

## Estado

Preparación y persistencia MySQL verificadas.
El endpoint de registro y las sesiones se implementarán en los próximos pasos.

## Requisitos

- Node.js 22.19.0.
- npm.
- MySQL 8.0; entorno local validado con 8.0.46.

Las dependencias instaladas se registran en [Entorno](docs/environment.md).

## Instalación

```bash
nvm use
npm ci
cp .env.example .env
```

Configurar bases, usuarios y contraseñas siguiendo
[Base de datos](docs/database.md).

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

API disponible por defecto en http://localhost:3001.

## Validación

```bash
npm run check
```

Incluye formato, lint, tipos, tests unitarios, integración MySQL y build.
Requiere la base de pruebas configurada y MySQL disponible.

Consulta [Pruebas](docs/testing.md) para ejecuciones específicas y curl.

## Producción local

```bash
npm run build
npm start
```

## Documentación

- [Proyecto](PROJECT.md)
- [Blueprint](BLUEPRINT.md)
- [Estado](STATUS.md)
- [Decisiones](DECISIONS.md)
- [Arquitectura](docs/architecture.md)
- [Base de datos](docs/database.md)
- [Pruebas](docs/testing.md)

## Colaboración con IA

Utilizo IA como apoyo para organizar tareas, preparar propuestas de código,
analizar errores y mejorar la documentación. Reviso las propuestas y ejecuto
las validaciones antes de cerrar cada etapa.

Más información en [Colaboración con IA](docs/ai-collaboration.md).

## Variables y credenciales

`.env.example` documenta las variables necesarias sin credenciales reales.
El archivo `.env` permanece fuera de Git.
