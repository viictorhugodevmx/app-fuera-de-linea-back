# Fuera de Línea — Backend

API para un evento ficticio de cultura urbana, música,
arte y creación digital.

## Funcionalidad

- Sesiones firmadas de cinco minutos.
- Validación y normalización del formulario.
- Registro persistido en MySQL.
- Correo único, protegido ante envíos simultáneos.
- CORS y límite de solicitudes.
- Errores JSON y logs sin datos personales.
- Cierre ordenado de HTTP y MySQL.

## Requisitos

- Node.js 22.19.0.
- npm.
- MySQL 8.0; entorno validado con 8.0.46.

Versiones instaladas: [Entorno](docs/environment.md).

## Instalación local

```bash
nvm use
npm ci
cp .env.example .env
```

Configurar bases, usuarios y contraseñas:
[Base de datos](docs/database.md).

Configurar secreto y orígenes:
[Operación](docs/runtime.md).

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

Con el servidor abierto:

```bash
npm run smoke:registration
```

Obtiene una sesión, confirma un registro y comprueba el duplicado.
Deja un registro de prueba en la base de la API.

Pruebas específicas y evidencias: [Pruebas](docs/testing.md).

## Producción local

```bash
npm run build
npm start
```

Conservar las variables de entorno y el secreto de sesiones.

## Documentación

- [Proyecto](PROJECT.md)
- [Blueprint canónico](BLUEPRINT.md)
- [Estado](STATUS.md)
- [Decisiones](DECISIONS.md)
- [Arquitectura](docs/architecture.md)
- [Base de datos](docs/database.md)
- [Contrato API](docs/api.md)
- [Integración frontend](docs/frontend-integration.md)
- [Operación y límites](docs/runtime.md)
- [Pruebas](docs/testing.md)

## Colaboración con IA

Utilizo IA como apoyo para organizar tareas, preparar propuestas de código,
analizar errores y mejorar la documentación. Reviso las propuestas y ejecuto
las validaciones antes de cerrar cada etapa.

Más información: [Colaboración con IA](docs/ai-collaboration.md).

## Frontend y publicación

El frontend se desarrolla en app-fuera-de-linea-front.
Los enlaces GitHub y la URL pública se añadirán durante despliegue.

## Credenciales

`.env.example` contiene ejemplos sin secretos reales.
`.env` permanece fuera de Git.

## Despliegue

- Frontend: https://app-fuera-de-linea-front.netlify.app
- API: https://app-fuera-de-linea-back.onrender.com
- Health check: https://app-fuera-de-linea-back.onrender.com/api/health

La configuración y evidencia del entorno publicado se describen en
[docs/deployment.md](docs/deployment.md).
