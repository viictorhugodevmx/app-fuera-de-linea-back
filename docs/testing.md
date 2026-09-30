# Pruebas

## Preparación

```bash
nvm use
npm ci
```

Configurar `.env` según [Base de datos](database.md)
y [Operación](runtime.md).

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

## Ejecuciones específicas

```bash
npm run test:unit
npm run test:http
npm run test:integration
```

Unit y http incluyen health.
La suite completa ejecuta cada archivo una sola vez.

## Cobertura

- Configuración, normalización y validaciones.
- Firma y vencimiento de sesiones.
- Persistencia MySQL y duplicados simultáneos.
- Datos o sesiones inválidos sin inserción.
- Solicitud recibida a tiempo y procesada después del plazo.
- Fallo de inserción sin confirmación ni reintento.
- CORS, cuota compartida, health exento y preflight sin consumo.
- Errores 413, 429, 503 y 500.
- Respuestas y logs sin detalles internos.

Las pruebas de tiempo usan reloj controlado.
Los tests de integración limpian únicamente sus registros temporales.
Las pruebas de errores simulan fallos sin detener el MySQL local.

## Curl manual

Con el servidor abierto:

```bash
npm run smoke:registration
```

Obtiene una sesión, registra un correo único y repite el envío.
Espera 201 y 409 con EMAIL_ALREADY_REGISTERED.

Deja un registro de prueba en la base de la API.
Elimina sus archivos temporales al terminar.

Otra API:

```bash
API_URL=https://api.example.com npm run smoke:registration
```

## Evidencia del Paso 4

Víctor aprobó 51 tests, formato, lint, tipos y build.
Comprobó 201/409 con producción local y cierre de HTTP/MySQL mediante Ctrl+C.
