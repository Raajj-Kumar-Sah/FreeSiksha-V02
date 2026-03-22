import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "freesiksha-1895c.firebaseapp.com",
  projectId: "freesiksha-1895c",
  storageBucket: "freesiksha-1895c.firebasestorage.app",
  messagingSenderId: "229420467422",
  appId: "1:229420467422:web:12ef3730017eba86c82e4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}