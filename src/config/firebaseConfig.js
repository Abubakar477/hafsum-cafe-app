import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDyjhl9IZ2c8J00ygJwBE0vKl_ZoSvajjw',
  authDomain: 'hafsum-mobile-app.firebaseapp.com',
  projectId: 'hafsum-mobile-app',
  storageBucket: 'hafsum-mobile-app.firebasestorage.app',
  messagingSenderId: '73936906664',
  appId: '1:73936906664:web:6ee2f3538636c994bad59d',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };