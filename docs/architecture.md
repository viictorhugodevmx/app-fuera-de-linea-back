# Arquitectura inicial

`src/app.ts` define Express sin abrir un puerto.
`src/server.ts` carga el entorno y arranca el servidor.
Los tests HTTP usan la aplicación directamente mediante Supertest.

La conexión MySQL, las capas de registro y las sesiones se incorporarán
en sus pasos correspondientes.
