# Arquitectura actual

- `src/app.ts`: fábrica Express, CORS, rutas y manejo de errores.
- `src/server.ts`: arranque HTTP.
- `src/config/`: configuración MySQL, secretos y orígenes.
- `src/validators/registration.ts`: validación y normalización del formulario.
- `src/services/registration-session.ts`: emisión y verificación HMAC-SHA256.
- `src/services/registration.ts`: comprobación de sesión y registro.
- `src/db/`: pools, comprobación de conexión y migración.
- `db/migrations/`: esquema SQL versionado.
- `tests/unit/`: configuración y reglas.
- `tests/http/`: respuestas HTTP y CORS.
- `tests/integration/`: recorrido HTTP con MySQL real.
- `scripts/smoke-registration.sh`: comprobación manual mediante curl.

`createApp` permite seleccionar la base y sustituir el reloj en tests.
La instancia normal usa la base de aplicación.
La fábrica expone el cierre de su pool para liberar conexiones.

Express captura la hora de recepción antes de procesar el formulario.
El servicio comprueba la sesión con esa hora y ejecuta una inserción
parametrizada.

La restricción UNIQUE de MySQL protege la unicidad del correo.
Sus errores de duplicado se traducen a HTTP 409.
