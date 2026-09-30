# Estado del proyecto

## Avance

| Paso | Descripción                                 | Estado     |
| ---- | ------------------------------------------- | ---------- |
| 0    | Preparación de backend y frontend           | Completado |
| 1    | MySQL, configuración y persistencia base    | Completado |
| 2    | Sesiones firmadas y CORS                    | Completado |
| 3    | Registro validado y correo único            | Completado |
| 4    | Errores, límites y cierre controlado        | Completado |
| 5    | Reproducibilidad, contrato y documentación  | Completado |
| 11   | Publicación remota e integración productiva | Completado |
| 12   | Auditoría, documentación y cierre final     | Completado |

## Evidencia del Paso 11

- API publicada en Render.
- Health check remoto con HTTP 200.
- MySQL remoto publicado en Aiven con TLS.
- Migración y tabla `registrations` verificadas.
- Frontend de Netlify autorizado mediante CORS.
- Preflight remoto aprobado con HTTP 204.
- Registro productivo persistido en Aiven.
- Correo repetido rechazado.
- Integración Netlify, Render y Aiven validada.

## Evidencia del Paso 12

- Los requisitos R1–R13 fueron contrastados con la entrega.
- La aplicación y ambos repositorios tienen acceso público.
- La arquitectura, operación, pruebas y despliegue están documentados.
- Los límites de los servicios gratuitos están identificados.
- Las credenciales y certificados permanecen fuera de Git.
- La auditoría final está registrada en `docs/final-audit.md`.

## Estado actual

El backend está publicado y conectado de forma segura con MySQL remoto.

El proyecto cumple el alcance del blueprint y está listo para su entrega final.
