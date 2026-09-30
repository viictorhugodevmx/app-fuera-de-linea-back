# Pruebas

## Preparación

Instalar dependencias con `npm ci`.
Usar Node.js 22.19.0 mediante `nvm use`.

## Controles

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` ejecuta todos los controles anteriores.

## HTTP manual

Con `npm run dev` abierto en otra terminal:

```bash
curl -i http://localhost:3001/api/health
```

Resultado esperado: HTTP 200 y JSON con `status: "ok"`
y `service: "fuera-de-linea-api"`.

Este endpoint todavía no verifica la conexión MySQL.

## Alcance actual

Prueba automatizada del endpoint de disponibilidad.
Las pruebas de registro y persistencia se añadirán durante su implementación.
