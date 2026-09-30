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
