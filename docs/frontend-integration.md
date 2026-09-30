# Integración con el frontend

Contrato de endpoints: [API](api.md).
Configuración del servidor: [Operación](runtime.md).

## Configuración prevista del frontend

```dotenv
NEXT_PUBLIC_DATA_MODE=api
NEXT_PUBLIC_API_URL=http://localhost:3001
```

La URL no incluye `/api`: el adaptador añadirá la ruta del endpoint.

En modo `demo`, el frontend simulará las respuestas sin conectar al backend.
El modo se elige explícitamente; un fallo de API no activa demo automáticamente.

Estas variables son públicas. Nunca deben contener SESSION_SECRET
ni credenciales MySQL.

## Recorrido de registro

1. Abrir por primera vez la sección de registro.
2. Solicitar POST /api/registration-sessions.
3. Recibir sessionToken, expiresAt y serverTime.
4. Guardar la sesión para conservar el vencimiento al recargar.
5. Mostrar el formulario y la cuenta regresiva.
6. Enviar nombre, correo, mensaje y sessionToken a POST /api/registrations.
7. Mostrar confirmación únicamente cuando la API responda 201.

La espera inicial de conexión no debe consumir un contador iniciado
artificialmente en el navegador.

## Tiempo

El contador se basa en expiresAt, considerando la diferencia de reloj
con serverTime. La sesión guardada debe conservar los datos necesarios
para mantener ese cálculo al recargar.

No reiniciar automáticamente una sesión vencida.

Al vencer, retirar el formulario y mostrar el estado de cierre.

Si hay un envío en curso, esperar su respuesta:
un 201 sigue siendo válido aunque el contador haya terminado mientras
se esperaba la confirmación.

El backend decide la aceptación usando la hora de recepción de la solicitud.

## Estados visibles

| Resultado           | Comportamiento                                    |
| ------------------- | ------------------------------------------------- |
| Esperando sesión    | Mostrar conexión en curso                         |
| Sesión disponible   | Mostrar formulario y contador                     |
| Enviando registro   | Bloquear envíos repetidos mientras se espera      |
| 201                 | Mostrar confirmación                              |
| 400 INVALID_INPUT   | Mostrar errores de fields junto a los campos      |
| 400 INVALID_SESSION | Informar que la sesión no es válida               |
| 409                 | Informar que el correo ya está registrado         |
| 410                 | Retirar el formulario y mostrar plazo agotado     |
| 413                 | Mostrar error de tamaño de solicitud              |
| 429                 | Informar que debe esperar; considerar Retry-After |
| 503                 | Mostrar indisponibilidad temporal                 |
| Error de red o 500  | Mostrar que no se pudo confirmar el resultado     |

Una pérdida de conexión no demuestra que el servidor no haya guardado
el registro. No confirmar éxito ni reintentar automáticamente.

## Validación

Frontend y backend comparten los mismos límites:

- Nombre: 2–100 caracteres tras recortar espacios.
- Correo: formato básico válido, máximo 254 caracteres.
- Mensaje: obligatorio, 1–1000 caracteres tras recortar espacios.

El backend normaliza el correo a minúsculas y protege la unicidad con MySQL.
La validación del navegador mejora la experiencia, pero no reemplaza al servidor.

## Modo demo

Mantener el mismo contrato de datos y los mismos estados visibles.
Identificar discretamente que el registro es simulado.

La duplicidad y la sesión se conservan en ese navegador.
No prometer persistencia MySQL ni unicidad entre dispositivos.

## CORS

ALLOWED_ORIGINS del backend debe incluir el origen exacto del frontend.
En local: http://localhost:3000.

Durante despliegue se añadirán los orígenes publicados acordados.
