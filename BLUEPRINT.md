# Fuera de Línea — Blueprint v0.1

Metodología APP v0.1 · Modo Proyecto.

Este archivo es la copia canónica del blueprint dentro del proyecto.
Los cambios de alcance se registran en DECISIONS.md.
El frontend mantiene su mapa de pasos y enlazará este documento.

## Objetivo

Landing interactiva de un evento ficticio de cultura urbana, música,
arte y creación digital.

Entregar una experiencia atractiva, registro funcional y documentación
reproducible para evaluación de Casa Bengala.

## Organización

Carpeta padre: app-fuera-de-linea.

Repositorios locales independientes:

- app-fuera-de-linea-back
- app-fuera-de-linea-front

Los repos remotos conservarán esos nombres.
El historial local se subirá durante despliegue.

## Entorno y entrega

- Node.js 22.19.0.
- Backend: Express, TypeScript y MySQL.
- Frontend: Next.js, App Router, TypeScript y CSS.
- npm y lockfiles versionados.
- Frontend: GitHub conectado con Netlify.
- API: Render Free como opción prevista.
- MySQL remoto: Aiven Free como opción prevista.

La disponibilidad, TLS, orígenes y configuración de proxy se verificarán
al publicar.

Meta: 30 de septiembre de 2026, aproximadamente 18:10, America/Mexico_City.
Fecha límite: 2 de octubre de 2026.

Si la provisión gratuita bloquea la entrega, publicar frontend en modo demo
identificado y entregar backend local probado con instrucciones completas.

## Alcance

- Inicio con animación de entrada.
- Información del evento y llamadas al registro.
- Galería de imágenes.
- Interactividad animada y movimiento reducido.
- Formulario con nombre, correo y mensaje.
- Ventana de registro de cinco minutos.
- Persistencia MySQL y correo único.
- Frontend configurable en modo API o demo.
- Responsive, estados accesibles, tests y documentación.
- URL pública del frontend y acceso a ambos repositorios.

Fuera de alcance: login, administración, pagos, venta de entradas,
envío de correos, CMS, varios eventos y cupos limitados.

## Reglas funcionales

Un registro por correo normalizado para el evento.
La restricción UNIQUE de MySQL protege también solicitudes simultáneas.

La ventana comienza al emitir la sesión de registro.
El frontend conserva sesión y vencimiento al recargar.
No reinicia automáticamente una sesión vencida.

Al vencer se retira el formulario.
Si un envío está en curso, se espera su respuesta:
el backend puede confirmar una solicitud recibida antes del vencimiento.

El modo demo conserva los estados visibles, pero su persistencia y
duplicidad se limitan al navegador. Un fallo de API no activa demo
silenciosamente.

Contrato técnico: [API](docs/api.md).
Estados frontend: [Integración](docs/frontend-integration.md).

## Roadmap

13 pasos principales, numerados de 0 a 12.

Backend: cinco específicos, 1–5.
Frontend: cinco específicos, 6–10.
Compartidos: 0, 11 y 12.

Cada repo participa en ocho pasos, sin contar dos veces los compartidos.

| Paso | Área  | Objetivo y aceptación                                                       | Dependencia |
| ---- | ----- | --------------------------------------------------------------------------- | ----------- |
| 0    | Ambos | Entorno, Git, arranque, pruebas iniciales y acceso MySQL comprobados        | Blueprint   |
| 1    | Back  | Bases, usuarios, esquema, conexión y persistencia probados                  | 0           |
| 2    | Back  | Contrato, sesiones firmadas y CORS verificados                              | 1           |
| 3    | Back  | Registro real; validación, unicidad y plazo comprobados                     | 2           |
| 4    | Back  | Cuota, errores, recepción a tiempo y cierre ordenado comprobados            | 3           |
| 5    | Back  | Instalación reproducible, contrato, documentación y producción local listos | 4           |
| 6    | Front | Identidad, layout responsive y navegación accesible                         | 0 y 5       |
| 7    | Front | Inicio animado, información y CTA al registro                               | 6           |
| 8    | Front | Galería, recursos optimizados e interactividad accesible                    | 7           |
| 9    | Front | Registro, temporizador y adaptadores API/demo probados                      | 8 y 5       |
| 10   | Front | Recorrido completo local en ambos modos y revisión visual                   | 9           |
| 11   | Ambos | GitHub y URL publicada; modo y limitaciones comprobados                     | 10          |
| 12   | Ambos | Auditoría de requisitos, documentación final y cierre por Víctor            | 11          |

## Trazabilidad

| Requisito                                         | Pasos               |
| ------------------------------------------------- | ------------------- |
| Inicio animado                                    | 6, 7                |
| Información del evento                            | 7                   |
| Galería multimedia                                | 8                   |
| Interactividad y movimiento reducido              | 7, 8, 10            |
| Formulario                                        | 3, 9                |
| Temporizador y cierre                             | 2, 4, 9, 10         |
| Backend y validaciones                            | 1–5                 |
| MySQL y correo único                              | 1, 3, 5, 10         |
| Modos API/demo                                    | 9–11                |
| Responsive y accesibilidad                        | 6–10, 12            |
| Tests, curl, checks y commits                     | 0–12, según cambios |
| Documentación, arquitectura y colaboración con IA | 0–12                |
| URL y repositorios                                | 11, 12              |

## Trabajo por pasos

Víctor ejecuta y valida. El asistente prepara instrucciones y revisa evidencia.

Un paso principal a la vez, con subpasos manejables.
Archivos completos con cat, comandos con carpeta indicada y pruebas
reproducibles.

Las correcciones permanecen vinculadas al paso afectado.
No renumerar pasos cerrados ni modificar el alcance silenciosamente.

Cada paso validado actualiza documentación y termina con commit
en el repositorio afectado.

Cierre:

APP Fuera de Línea — PASO N — LISTO ✅

Después del cierre sin bloqueos, entregar el siguiente paso.

## Validación y cierre final

- Proteger reglas, estados e integraciones mediante tests durante desarrollo.
- Validar ajustes visuales manualmente cuando corresponda.
- Mantener formato, lint, tipos, tests y build.
- Contrastar todos los requisitos con lo entregado.
- Identificar datos ficticios, servicios reales y modo demo.
- Verificar instalación desde instrucciones y enlaces.
- Documentar límites, incidencias y pendientes.
- Revisar ausencia de credenciales en Git.
- Registrar fricciones de la metodología sin cambiar silenciosamente APP v0.1.

Estado actual y evidencias: [STATUS.md](STATUS.md).
