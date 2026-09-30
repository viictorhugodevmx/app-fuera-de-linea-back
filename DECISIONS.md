# Decisiones

- Node.js 22.19.0 en ambos proyectos.
- Dos repositorios Git independientes dentro de una carpeta padre.
- npm y lockfiles versionados.
- Versiones estables de Express y Next verificadas al preparar el entorno.
- Backend separado del frontend.
- MySQL conserva la persistencia real.
- Un registro por correo normalizado para el evento.
- Sesiones de registro de cinco minutos.
- Frontend con modos API y demo explícitos.
- GitHub remoto se configura durante despliegue.
- Commit después de validar cada paso.
- Aplicación y tests tienen bases y usuarios independientes.
- Se conserva la política MEDIUM de contraseñas de MySQL.
- Credenciales generadas aleatoriamente y conservadas fuera de Git.
- Esquema inicial versionado en SQL, sin introducir un ORM.
- Unicidad del correo protegida por MySQL.
- Los tests eliminan únicamente sus registros temporales.
- Sesiones firmadas con HMAC-SHA256 mediante crypto de Node.
- Secreto estable, fuera de Git y sin datos personales en el token.
- Reloj sustituible para comprobar vencimientos sin esperas reales.
- CORS con orígenes exactos; no sustituye autenticación.

## Robustez — Paso 4

- Cuota de 30 solicitudes por minuto por IP, compartida entre sesión y registro.
- Contador en memoria por proceso, adecuado al alcance de la demo.
- Health y preflight no consumen cuota.
- Parser JSON limitado a 16 KB.
- Fallos temporales reconocidos devuelven 503; errores inesperados, 500.
- Logs con estado y código, sin formulario, tokens ni mensajes del driver.
- Sin reintentos automáticos de inserción.
- Cierre mediante SIGINT/SIGTERM con un límite de diez segundos.
- Configuración del proxy por verificar durante despliegue.
