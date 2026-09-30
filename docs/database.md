# Base de datos

## Entorno local validado

MySQL 8.0.46 en Ubuntu.
Acceso administrativo mediante `sudo mysql`, con autenticación `auth_socket`.

La aplicación utiliza usuarios propios:

| Uso        | Base                | Usuario  |
| ---------- | ------------------- | -------- |
| Aplicación | fuera_de_linea      | fdl_app  |
| Pruebas    | fuera_de_linea_test | fdl_test |

Cada usuario tiene permisos únicamente sobre su base.
Las contraseñas se conservan en `.env`, fuera de Git.

## Preparación en otra máquina

Con MySQL instalado y acceso administrativo disponible, ejecutar el siguiente
SQL desde una sesión administrativa. Reemplazar las dos contraseñas de ejemplo
por contraseñas propias que cumplan la política del servidor.

```sql
CREATE DATABASE fuera_de_linea
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE DATABASE fuera_de_linea_test
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'fdl_app'@'localhost'
  IDENTIFIED BY 'Aa1!REPLACE_APP_PASSWORD';

CREATE USER 'fdl_test'@'localhost'
  IDENTIFIED BY 'Aa1!REPLACE_TEST_PASSWORD';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON fuera_de_linea.* TO 'fdl_app'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON fuera_de_linea_test.* TO 'fdl_test'@'localhost';
```

Estos comandos son para una instalación nueva. Si las bases o usuarios ya
existen, revisar su configuración antes de modificarlos.

Copiar `.env.example` a `.env` y colocar las contraseñas elegidas en
`DB_PASSWORD` y `TEST_DB_PASSWORD`.

## Conexión y migración

Desde la raíz del backend:

```bash
npm run db:check
npm run db:migrate
npm run db:migrate:test
```

`db:check` comprueba ambas conexiones sin mostrar contraseñas.

La migración inicial crea `registrations`, con nombre, correo, mensaje
y fecha de creación. El correo tiene una restricción UNIQUE.

La comparación de correos ignora mayúsculas y distingue acentos.
La normalización de entrada se implementará en el servicio de registro.

La migración puede repetirse sin borrar datos. No actualiza una tabla
existente: los cambios posteriores necesitarán nuevas migraciones.

## Pruebas

Los tests de integración utilizan exclusivamente las variables `TEST_DB_*`.
La configuración rechaza un nombre de base sin sufijo `_test`.

Cada ejecución genera correos únicos y elimina únicamente los registros
creados por sus tests. No vacía la tabla completa.
