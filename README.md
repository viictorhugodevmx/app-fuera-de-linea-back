# Fuera de Línea — Backend

API para un evento ficticio de cultura urbana, música, arte
y creación digital.

## Funcionalidad actual

- Sesiones firmadas con una ventana de registro de cinco minutos.
- Validación de nombre, correo y mensaje.
- Registro persistido en MySQL.
- Un registro por correo, protegido también ante envíos simultáneos.
- Respuestas de error y CORS configurables.

## Requisitos

- Node.js 22.19.0.
- npm.
- MySQL 8.0; entorno local validado con 8.0.46.

Versiones: [Entorno](docs/environment.md).

## Instalación

```bash
nvm use
npm ci
cp .env.example .env
```

Preparar bases, usuarios y contraseñas según
[Base de datos](docs/database.md).
Configurar el secreto de sesiones y los orígenes según
[Contrato API](docs/api.md).

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

Con el servidor abierto, comprobar registro y duplicado mediante curl:

```bash
npm run smoke:registration
```

Instrucciones y efectos sobre los datos: [Pruebas](docs/testing.md).

## Producción local

```bash
npm run build
npm start
```

Conservar las variables de entorno y el secreto de sesiones.

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
`.env` permanece fuera de Git.

## Pendiente

Límites de solicitudes, tratamiento de indisponibilidad de MySQL
y cierre ordenado del proceso se completarán en el Paso 4.
