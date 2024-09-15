```
# Blog Project

Este proyecto es una aplicación de blog construida con Node.js y Express. Utiliza Firebase para la autenticación y almacenamiento de datos. A continuación, se describen los detalles del proyecto, cómo configurarlo y ejecutarlo.

## Estructura del Proyecto

El proyecto está organizado en varios directorios clave:

- `src`: Contiene el código fuente principal del proyecto.
  - `database`: Contiene archivos relacionados con las operaciones de la base de datos.
  - `middlewares`: Contiene funciones middleware que se ejecutan antes o después de manejar una solicitud.
  - `routes`: Contiene archivos relacionados con las diferentes rutas de la aplicación (e.g., `comments.js`, `posts.js`, `users.js`).
  - `index.js`: Punto de entrada principal de la aplicación.

## Dependencias Principales

- `bcryptjs`: Librería para el hashing de contraseñas.
- `cors`: Middleware para manejar Cross-Origin Resource Sharing.
- `dotenv`: Carga variables de entorno desde un archivo `.env`.
- `express`: Framework de aplicación web minimalista y flexible para Node.js.
- `firebase`: SDK de Google Firebase para JavaScript.

## Configuración

1. Clona el repositorio:
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables de entorno:
   ```
   PORT
    JWT_SECRET
   TYPE
   PROJECT_ID
   PRIVATE_KEY_ID
   PRIVATE_KEY
   CLIENT_EMAIL
   CLIENT_ID
   AUTH_URI
   TOKEN_URI
   AUTH_PROVIDER_X509_CERT_URL
   CLIENT_X509_CERT_URL
   UNIVERSE_DOMAIN
   ```

## Ejecución

Para iniciar la aplicación en modo de desarrollo, ejecuta:
```sh
npm run dev
```

Para iniciar la aplicación en modo de producción, ejecuta:
```sh
npm start
```

## Scripts Importantes

- `test`: Script para ejecutar pruebas (actualmente solo muestra un mensaje de error).

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.
