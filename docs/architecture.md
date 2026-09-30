# Arquitectura actual

- `src/app.ts`: Express, CORS, endpoints y respuestas de error.
- `src/server.ts`: carga de entorno y arranque HTTP.
- `src/config/database.ts`: configuración MySQL de aplicación y pruebas.
- `src/config/session.ts`: validación del secreto y duración de sesiones.
- `src/config/cors.ts`: validación de orígenes exactos.
- `src/services/registration-session.ts`: emisión y verificación HMAC-SHA256.
- `src/db/pool.ts`: pools MySQL con consultas múltiples desactivadas.
- `src/db/check.ts`: comprobación de ambas conexiones.
- `src/db/migrate.ts`: aplicación del esquema inicial.
- `db/migrations/`: esquema SQL versionado.
- `tests/unit/`: configuración y reglas de sesiones.
- `tests/http/`: comportamiento HTTP y CORS.
- `tests/integration/`: persistencia MySQL real.

Supertest utiliza Express sin abrir un puerto manualmente.
El servicio de sesiones recibe un reloj sustituible para pruebas deterministas.
Las consultas de datos usan parámetros.

La configuración se valida al iniciar la aplicación.
El servicio de registro se implementará en el Paso 3.
