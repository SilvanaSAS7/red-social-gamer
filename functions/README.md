Cloud Functions bridge para Livepeer WebRTC

Descripción
---
Funciones de Firebase que actúan como puente entre Firestore (signaling) y la API REST de Livepeer.

Funciones incluidas
- onCreateWebrtcSession: se dispara cuando se crea un documento en `webrtcSessions/{id}` que contiene `offer`. Crea una sesión WebRTC en Livepeer (POST /stream/{streamId}/webrtc-sessions), escribe el `answer` y `livepeerSessionId` en el documento, y hace un polling corto (~30s) para traer candidatos remotos y escribirlos en `webrtcSessions/{id}/viewerCandidates`.
- onPublisherCandidate: se dispara cuando el publisher añade un candidate en `webrtcSessions/{id}/publisherCandidates/{cid}` y lo reenvía a Livepeer (POST /stream/{streamId}/webrtc-sessions/{sessionId}/candidates).

Requisitos
---
- Tener Firebase CLI instalado y autenticado.
- Un proyecto Firebase configurado con Firestore habilitado.
- Una clave de Livepeer con permisos (API key).

Instalación y despliegue
---
1) Desde la carpeta `functions` instala dependencias:

```powershell
cd functions
npm install
```

2) Configura la clave de Livepeer como variable de entorno para las funciones:

```powershell
# usando funciones config
firebase functions:config:set livepeer.key="YOUR_LIVEPEER_API_KEY"

# o exportando la variable de entorno en el entorno de deploy
setx LIVEPEER_API_KEY "YOUR_LIVEPEER_API_KEY"
```

3) Despliega las funciones:

```powershell
cd ..
firebase deploy --only functions
```

Notas
---
- La función hace un polling corto (30s) para recoger candidatos remotos; si necesitas mayor latencia/fiabilidad, considera ejecutar un servicio en Cloud Run que mantenga un ciclo de polling por más tiempo o que maneje eventos de WebSocket si el proveedor lo soporta.
- Asegúrate de revisar las reglas de Firestore y permisos; las funciones usan el Admin SDK y escriben en la colección `webrtcSessions`.
