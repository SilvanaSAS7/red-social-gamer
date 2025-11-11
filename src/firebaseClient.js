import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración desde variables de entorno. Crea un .env con estas claves si aún no existen.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar sólo una vez en entornos de hot-reload
let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  // En entornos de test o si la configuración falta, no romper la app: exportamos undefined y el código que lo use debe manejarlo.
  // eslint-disable-next-line no-console
  console.warn('Firebase init warning:', e.message || e);
}

export { db };
