# Fuera de Línea — Backend

API para el registro de un evento ficticio de cultura urbana, música, arte
y creación digital.

## Estado

Preparación inicial. La API expone un endpoint de disponibilidad.
El registro y la persistencia MySQL se implementarán en los siguientes pasos.

## Requisitos

- Node.js 22.19.0.
- npm.
- MySQL para las próximas etapas de persistencia.

Las versiones instaladas se registran en [Entorno](docs/environment.md).

## Instalación y desarrollo

```bash
nvm use
npm ci
cp .env.example .env
npm run dev
```

Por defecto, la API escucha en http://localhost:3001.

## Validación

```bash
npm run check
```

Consulta las pruebas manuales y los controles en [Pruebas](docs/testing.md).

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
- [Pruebas](docs/testing.md)
- [Colaboración con IA](docs/ai-collaboration.md)

## Variables

El archivo `.env.example` contiene las variables iniciales.
Las credenciales y los archivos `.env` no se incluyen en Git.
