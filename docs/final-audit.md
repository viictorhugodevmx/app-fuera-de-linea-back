# Auditoría final

## Resultado

La aplicación Fuera de Línea cumple el alcance definido en el blueprint
canónico.

## Requisitos verificados

| ID  | Requisito                                     | Evidencia                              |
| --- | --------------------------------------------- | -------------------------------------- |
| R1  | Inicio con animación de entrada               | Implementado y revisado en el frontend |
| R2  | Información del evento y llamadas al registro | Implementado                           |
| R3  | Galería multimedia con imágenes               | Implementado con recursos locales      |
| R4  | Interactividad y movimiento reducido          | Implementado y probado                 |
| R5  | Formulario con nombre, correo y mensaje       | Implementado y validado                |
| R6  | Ventana temporal de cinco minutos             | Implementada sin reinicio automático   |
| R7  | Backend Node y Express con validaciones       | Publicado y probado                    |
| R8  | Persistencia MySQL y correo único             | Verificada en Aiven                    |
| R9  | Modos demo y API configurables                | Implementados sin fallback silencioso  |
| R10 | Responsive, accesibilidad y acabado visual    | Revisado en escritorio y móvil         |
| R11 | Tests, curl, checks y commits                 | Aprobados durante el desarrollo        |
| R12 | Documentación, arquitectura y uso de IA       | Documentados en ambos repositorios     |
| R13 | URL pública y acceso a ambos repositorios     | Disponibles públicamente               |

## Entrega

- Aplicación: https://app-fuera-de-linea-front.netlify.app
- Frontend: https://github.com/viictorhugodevmx/app-fuera-de-linea-front
- Backend: https://github.com/viictorhugodevmx/app-fuera-de-linea-back
- API: https://app-fuera-de-linea-back.onrender.com
- Health check: https://app-fuera-de-linea-back.onrender.com/api/health

## Servicios

- Frontend publicado en Netlify.
- API publicada en Render.
- MySQL publicado en Aiven con TLS.
- Las credenciales y certificados no forman parte de los repositorios.

El plan gratuito de Render puede provocar una demora en la primera solicitud
después de un periodo sin tráfico.

## Conclusión

Los requisitos funcionales, técnicos y documentales quedaron cubiertos.
El proyecto está listo para entrega.
