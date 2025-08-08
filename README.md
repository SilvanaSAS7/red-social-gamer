# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)





## Documentación de endpoints

Esta sección describe los endpoints clave disponibles en el backend. La comunicación entre el frontend y el backend (PHP con MySQL) se realiza principalmente mediante peticiones HTTP (fetch).

---

### Base URL
```
http://localhost/DRAVORA_API/
```

---

### 🔐 Autenticación

#### Registro de Usuario
- **Endpoint:** `POST /Register.php`
- **Descripción:** Registra un nuevo usuario en la plataforma.
- **Body (JSON):**
```json
{
  "username": "gamer123",
  "email": "correo@ejemplo.com",
  "password": "123456"
}
```
- **Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente"
}
```

---

#### Inicio de Sesión
- **Endpoint:** `POST /Login.php`
- **Descripción:** Autentica al usuario y permite el inicio de sesión.
- **Body (JSON):**
```json
{
  "username": "gamer123",
  "password": "123456"
}
```
- **Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "username": "gamer123"
  }
}
```

### Funcionalidades clave del proyecto

- **Registro de usuario**: Los usuarios pueden registrarse proporcionando su nombre de usuario, correo electrónico y contraseña.
- **Inicio de sesión**: Los usuarios registrados pueden iniciar sesión para acceder a las funciones principales de DRAVORA.
- **Visualización de torneos**: Los usuarios pueden ver una lista de torneos disponibles (como Fortnite, Free Fire, Destiny) y consultar detalles.
- **Acceso a tienda gamer**: Se ofrece una tienda en línea donde los usuarios pueden ver y comprar artículos relacionados con la red social y los videojuegos.
- **Transmisiones en vivo**: Se proporciona una sección donde los usuarios pueden ver quién está transmitiendo en vivo, con opción de acceder a los streams.
- **Gestión de usuarios (Admin)**: En versiones futuras se contempla que los administradores gestionen usuarios, contenido y actividades dentro de la red social.

---

### Estado actual

Actualmente, los endpoints de la API de DRAVORA permiten el registro e inicio de sesión básico. En futuras ampliaciones se van a incluir:

- Cierre de sesión (token JWT o sesiones PHP).
- Gestión de perfiles.
- Subida de imagen de perfil.
- Interacción entre usuarios (amistades, mensajes).
- Sistema de publicaciones y comentarios.


