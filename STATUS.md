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

## Estado actual

El backend está publicado y conectado de forma segura con MySQL remoto.

Las credenciales y los certificados permanecen fuera del repositorio.
