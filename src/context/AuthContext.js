// ─── Auth Context ─────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../config/firebaseConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ───────────────────────────────────────────────────────────────────────────
  // Firebase Authentication Listener
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Firebase Auth user information
        const uid = firebaseUser.uid;

        // Get additional user information from Firestore
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          // Existing Firestore user
          setUser({
            uid,
            ...userSnapshot.data(),
            email: firebaseUser.email || userSnapshot.data().email || null,
            isAnonymous: firebaseUser.isAnonymous,
          });
        } else {
          // Firebase user exists but Firestore document doesn't exist yet
          const newUser = {
            uid,
            email: firebaseUser.email || null,
            name: firebaseUser.isAnonymous ? 'Guest User' : '',
            phone: '',
            location: null,
            isGuest: firebaseUser.isAnonymous,
            isAnonymous: firebaseUser.isAnonymous,
            createdAt: new Date().toISOString(),
          };

          await setDoc(userRef, newUser);

          setUser(newUser);
        }
      } catch (error) {
        console.log('Auth state error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // SIGN UP
  // ───────────────────────────────────────────────────────────────────────────

  const signUp = async (userData) => {
    try {
      const {
        email,
        password,
        name = '',
        phone = '',
        location = null,
      } = userData;

      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      // Create Firebase Authentication account
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const firebaseUser = credential.user;

      // User document in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);

      const firestoreUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email.trim(),
        name,
        phone,
        location,
        isGuest: false,
        isAnonymous: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, firestoreUser);

      setUser(firestoreUser);

      return {
        success: true,
        user: firestoreUser,
      };
    } catch (error) {
      console.log('Firebase signup error:', error);

      throw error;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SIGN IN
  // ───────────────────────────────────────────────────────────────────────────

  const signIn = async (userData) => {
    try {
      const {
        email,
        password,
      } = userData;

      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      // Login with Firebase Authentication
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const firebaseUser = credential.user;

      // Get user profile from Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userRef);

      let firestoreUser;

      if (userSnapshot.exists()) {
        firestoreUser = userSnapshot.data();
      } else {
        // Safety fallback if Authentication user exists
        // but Firestore profile doesn't.
        firestoreUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || email.trim(),
          name: userData.name || '',
          phone: userData.phone || '',
          location: userData.location || null,
          isGuest: false,
          isAnonymous: false,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, firestoreUser);
      }

      const finalUser = {
        ...firestoreUser,
        uid: firebaseUser.uid,
        email: firebaseUser.email || firestoreUser.email,
        isGuest: false,
        isAnonymous: false,
      };

      setUser(finalUser);

      return {
        success: true,
        user: finalUser,
      };
    } catch (error) {
      console.log('Firebase login error:', error);

      throw error;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // GUEST LOGIN
  // ───────────────────────────────────────────────────────────────────────────

  const signInAsGuest = async () => {
    try {
      // Create anonymous Firebase user
      const credential = await signInAnonymously(auth);

      const firebaseUser = credential.user;

      const userRef = doc(db, 'users', firebaseUser.uid);

      // Check if guest document already exists
      const userSnapshot = await getDoc(userRef);

      let guestUser;

      if (userSnapshot.exists()) {
        guestUser = {
          ...userSnapshot.data(),
          uid: firebaseUser.uid,
          isGuest: true,
          isAnonymous: true,
        };

        await updateDoc(userRef, {
          isGuest: true,
          isAnonymous: true,
          lastLoginAt: new Date().toISOString(),
        });
      } else {
        guestUser = {
          uid: firebaseUser.uid,
          email: null,
          name: 'Guest User',
          phone: '',
          location: null,
          isGuest: true,
          isAnonymous: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        await setDoc(userRef, guestUser);
      }

      setUser(guestUser);

      return {
        success: true,
        user: guestUser,
      };
    } catch (error) {
      console.log('Firebase guest login error:', error);

      throw error;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SIGN OUT
  // ───────────────────────────────────────────────────────────────────────────

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);

      setUser(null);
    } catch (error) {
      console.log('Firebase signout error:', error);

      throw error;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // UPDATE PROFILE
  // ───────────────────────────────────────────────────────────────────────────

  const updateProfile = async (updates) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user found.');
      }

      const uid = auth.currentUser.uid;

      const userRef = doc(db, 'users', uid);

      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Update Firestore
      await updateDoc(userRef, updatedData);

      // Update local React state
      setUser((currentUser) => ({
        ...currentUser,
        ...updatedData,
      }));

      return {
        success: true,
      };
    } catch (error) {
      console.log('Firebase profile update error:', error);

      throw error;
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // PROVIDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // Authentication
        signUp,
        signIn,
        signInAsGuest,
        signOut,

        // Profile
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);