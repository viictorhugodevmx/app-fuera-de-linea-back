# Arquitectura actual

- `src/app.ts`: aplicación Express sin abrir un puerto.
- `src/server.ts`: carga del entorno y arranque HTTP.
- `src/config/database.ts`: configuración independiente de aplicación y pruebas.
- `src/db/pool.ts`: creación de pools MySQL con consultas múltiples desactivadas.
- `src/db/check.ts`: comprobación de conexión, base y usuario.
- `src/db/migrate.ts`: aplicación de la migración inicial.
- `db/migrations/`: esquema SQL versionado.
- `tests/unit/`: validaciones de configuración.
- `tests/integration/`: pruebas contra MySQL real.

Supertest prueba HTTP sin requerir un servidor abierto manualmente.
Las consultas de datos usan parámetros.

El servicio de registro y las sesiones de cinco minutos se implementarán
en los pasos siguientes.
