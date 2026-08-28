// ─── Auth Context with Firebase Integration ──────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);
const USER_KEY = '@hafsum_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and listen to Auth state
  useEffect(() => {
    // First load from local storage for instant responsiveness
    AsyncStorage.getItem(USER_KEY)
      .then(raw => {
        if (raw) setUser(JSON.parse(raw));
      })
      .catch(() => {});

    // Listen to Firebase auth changes
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            // Fetch extra profile data from Firestore 'users' collection
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            let profileData = {
              uid: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName || 'Hafsum Customer',
            };
            if (userDoc.exists()) {
              profileData = { ...profileData, ...userDoc.data() };
            }
            setUser(profileData);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(profileData));
          } catch (e) {
            console.log('Error fetching user document from Firestore:', e);
          }
        }
        setLoading(false);
      });
    } catch (err) {
      console.log('Firebase Auth listener error:', err);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signIn = async (userData) => {
    try {
      if (userData.email && userData.password) {
        const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
        const fbUser = userCredential.user;
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        let profile = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: userData.name || fbUser.displayName || 'Hafsum Customer',
          phone: userData.phone || '',
          ...userData,
        };
        if (userDoc.exists()) {
          profile = { ...profile, ...userDoc.data() };
        }
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
        return { success: true, user: profile };
      }
    } catch (error) {
      console.log('Firebase signIn error (falling back to local):', error?.message);
    }

    // Local / Guest sign in fallback
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    return { success: true, user: userData };
  };

  const signUp = async ({ name, email, password, phone, location }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const profile = {
        uid: fbUser.uid,
        name,
        email,
        phone: phone || '',
        location: location || null,
        createdAt: new Date().toISOString(),
      };

      // Save to Cloud Firestore
      await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
      setUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      console.log('Firebase signUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    await AsyncStorage.multiRemove([USER_KEY, '@hafsum_token']);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      } catch (e) {
        console.log('Error updating Firestore profile:', e);
      }
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
