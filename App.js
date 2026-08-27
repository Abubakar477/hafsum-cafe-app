import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrdersProvider } from './src/context/OrdersContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ToastProvider } from './src/components/ToastNotification';
import MainNavigator from './src/navigation/MainNavigator';
import SplashScreen from './src/screens/SplashScreen';
import LocationScreen from './src/screens/LocationScreen';
import LoginScreen from './src/screens/LoginScreen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

/**
 * Hafsum Coffee App - Main Entry Point
 * Flow: Splash → Location Picker → Login → Main App
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FavoritesProvider>
            <OrdersProvider>
              <CartProvider>
                <ToastProvider>
                  <AppContent />
                </ToastProvider>
              </CartProvider>
            </OrdersProvider>
          </FavoritesProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [appStage, setAppStage] = useState('splash'); // 'splash' | 'location' | 'login' | 'app'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLoginTab, setInitialLoginTab] = useState('login');

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  const [splashFinished, setSplashFinished] = useState(false);

  // Handle auto-navigation on sign out
  useEffect(() => {
    if (!loading && !user && appStage === 'app') {
      setInitialLoginTab('signup');
      setAppStage('login');
    }
  }, [user, loading, appStage]);

  // Handle auto-login on startup when splash has finished, fonts are loaded, and auth is not loading
  useEffect(() => {
    if (splashFinished && fontsLoaded && !loading) {
      if (user) {
        setSelectedLocation(user.location);
        setAppStage('app');
      } else {
        setAppStage('location');
      }
    }
  }, [splashFinished, fontsLoaded, loading, user]);

  // 1. Splash Screen
  if (appStage === 'splash') {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  // 2. Location Picker
  if (appStage === 'location') {
    return (
      <LocationScreen
        onFinish={(loc) => {
          setSelectedLocation(loc);
          setInitialLoginTab('login');
          setAppStage('login');
        }}
      />
    );
  }

  // 3. Login / Sign Up
  if (appStage === 'login') {
    return (
      <LoginScreen
        selectedLocation={selectedLocation}
        initialTab={initialLoginTab}
        onFinish={() => setAppStage('app')}
      />
    );
  }

  // 4. Main App
  return (
    <NavigationContainer>
      <MainNavigator selectedLocation={selectedLocation} />
    </NavigationContainer>
  );
}
