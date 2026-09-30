# Pruebas

## Preparación

```bash
nvm use
npm ci
```

Configurar `.env` según [Base de datos](database.md)
y [Contrato API](api.md).

```bash
npm run db:check
npm run db:migrate
npm run db:migrate:test
```

## Validación completa

```bash
npm run check
```

Incluye formato, lint, tipos, todos los tests y build.
Requiere MySQL y la base de pruebas configurados.
Las pruebas de integración no se omiten silenciosamente.

## Ejecuciones específicas

```bash
npm run test:unit
npm run test:http
npm run test:integration
```

Los comandos unit y http incluyen la prueba inicial de health.
La suite completa ejecuta cada archivo una sola vez.

## Cobertura

- Configuración MySQL, secretos y orígenes.
- Firma, formato y vencimiento de sesiones.
- Respuestas HTTP, CORS y JSON inválido.
- Validación y normalización del formulario.
- Registro HTTP con persistencia real.
- Duplicados secuenciales y simultáneos.
- Rechazo sin inserción para datos o sesiones inválidos.
- Aceptación antes del vencimiento y rechazo en el límite exacto.

Los tests usan un reloj controlado y una base separada.
Eliminan únicamente sus registros temporales.

## Comprobación manual con curl

Con `npm run dev` abierto en otra terminal:

```bash
npm run smoke:registration
```

El script obtiene una sesión, registra un correo único y repite el envío.
Resultados esperados: 201 y 409 con EMAIL_ALREADY_REGISTERED.

Deja un registro de prueba en la base de la API.
Elimina sus archivos temporales al terminar.

Para apuntar a otra API:

```bash
API_URL=https://api.example.com npm run smoke:registration
```

## Evidencia del Paso 3

Víctor aprobó 42 tests, formato, lint, tipos y build.
La comprobación manual confirmó registro 201 y duplicado 409.
