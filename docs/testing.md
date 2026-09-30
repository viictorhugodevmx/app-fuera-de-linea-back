# Pruebas

## Preparación

```bash
nvm use
npm ci
```

Configurar `.env`, bases y usuarios según [Base de datos](database.md).
Preparar el secreto y los orígenes según [Contrato API](api.md).

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
MySQL y la base de pruebas deben estar disponibles.
Las pruebas de integración no se omiten silenciosamente.

## Ejecuciones específicas

```bash
npm run test:unit
npm run test:http
npm run test:integration
```

`test:unit` también incluye la prueba inicial de health.
`test:http` incluye health y los endpoints de sesiones.

## Cobertura actual

- Configuración MySQL y separación de pruebas.
- Persistencia y correo único.
- Configuración de secretos y orígenes.
- Emisión de sesiones y duración de cinco minutos.
- Límite exacto de vencimiento.
- Tokens alterados, malformados o firmados con otro secreto.
- Respuestas HTTP, ausencia de caché, CORS y JSON inválido.

El reloj de los tests de sesiones es controlado.
No es necesario esperar cinco minutos reales.

## Comprobaciones manuales

Con `npm run dev` abierto en otra terminal:

```bash
curl -i http://localhost:3001/api/health

curl -i -X POST http://localhost:3001/api/registration-sessions

curl -i -X OPTIONS \
  http://localhost:3001/api/registration-sessions \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type'

curl -i http://localhost:3001/api/health \
  -H 'Origin: https://otro-sitio.example'
```

Resultados esperados, en orden: 200, 201, 204 y 403.

## Evidencia del Paso 2

Víctor comprobó manualmente emisión 201, preflight 204 y rechazo 403.
La validación completa aprobó 28 tests, formato, lint, tipos y build.
