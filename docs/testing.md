# Pruebas

## Preparación

```bash
nvm use
npm ci
```

Configurar `.env`, bases y usuarios siguiendo [Base de datos](database.md).

Antes de la primera ejecución:

```bash
npm run db:check
npm run db:migrate
npm run db:migrate:test
```

## Validación completa

```bash
npm run check
```

Incluye formato, lint, tipos, tests y build.
Los tests de integración requieren MySQL disponible y la base de pruebas
configurada. No se omiten silenciosamente si falta conexión.

## Ejecuciones específicas

```bash
npm run test:unit
npm run test:integration
npm run db:check
```

## Cobertura actual

- Disponibilidad HTTP del servicio.
- Configuración de pruebas y variables obligatorias.
- Validación del puerto.
- Protección del nombre de la base de pruebas.
- Inserción y recuperación de registros en MySQL.
- Rechazo de correo duplicado, incluyendo diferencias de mayúsculas.

## HTTP manual

Con `npm run dev` abierto en otra terminal:

```bash
curl -i http://localhost:3001/api/health
```

Resultado esperado: HTTP 200 con `status: "ok"`
y `service: "fuera-de-linea-api"`.

El endpoint health comprueba Express. La conexión MySQL se verifica
por separado mediante `npm run db:check`.

## Evidencia del Paso 1

Víctor ejecutó satisfactoriamente ambas migraciones y conexiones.
La validación completa aprobó 7 tests, lint, tipos, formato y build.
