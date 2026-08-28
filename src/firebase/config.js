// src/firebase/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyDyjhl9IZ2c8J00ygJwBE0vKl_ZoSvajjw",
  authDomain: "hafsum-mobile-app.firebaseapp.com",
  databaseURL: "https://hafsum-mobile-app-default-rtdb.firebaseio.com",
  projectId: "hafsum-mobile-app",
  storageBucket: "hafsum-mobile-app.firebasestorage.app",
  messagingSenderId: "73936906664",
  appId: "1:73936906664:web:6ee2f3538636c994bad59d",
  measurementId: "G-CN8ZV3DX5Q"
};

// Initialize Firebase App (avoid duplicates on fast refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence for React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  // If already initialized
  auth = getAuth(app);
}

// Initialize Cloud Firestore & Realtime DB
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export { app, auth };
export default app;
