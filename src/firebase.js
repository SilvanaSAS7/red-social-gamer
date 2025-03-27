import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuTWTgPN_51byL2VB35cHDuUAErRJOZmo",
  authDomain: "red-social-8f5ba.firebaseapp.com",
  projectId: "red-social-8f5ba",
  storageBucket: "red-social-8f5ba.firebasestorage.app",
  messagingSenderId: "760791956896",
  appId: "1:760791956896:web:a9cd532cf6a0bc4aea78c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };